import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { hasPermission } from '@/lib/auth/rbac'
import { db } from '@/lib/db'
import { getLlmProvider } from '@/services/llm/providerFactory'
import { FLEETVISION_ASSISTANT_TOOLS } from '@/services/llm/tools'
import { executeAssistantTool } from '@/services/llm/toolExecutor'
import { IAssistantMessage, IToolCall, IToolResult } from '@/services/llm/types'

export const dynamic = 'force-dynamic'
export const maxDuration = 20 // Enforce 20-second timeout window

// Operational Limits & Safeguards
const MAX_MESSAGE_LENGTH = 2000
const MAX_HISTORY_LENGTH = 10
const MAX_TOOL_ROUNDS = 3
const USER_RATE_LIMIT_PER_MINUTE = 15
const ORG_RATE_LIMIT_PER_HOUR = 300
const DEFAULT_MONTHLY_BUDGET_USD = 25.0

// Gemini 3.8 Flash Pricing per 1M tokens ($0.75 input / $3.75 output)
const COST_PER_INPUT_TOKEN = 0.75 / 1_000_000
const COST_PER_OUTPUT_TOKEN = 3.75 / 1_000_000

const OPTIMUS_SYSTEM_PROMPT = `You are Optimus AI, the heavy commercial fleet copilot for FleetVision AI.
You assist fleet managers, dispatchers, and engineers with vehicle telemetry, driver safety, trip P&L, fuel efficiency, and predictive maintenance.

STRICT OPERATIONAL RULES:
1. Always use the provided tool-calling functions to query real fleet information.
2. Never invent or hallucinate VINs, registration numbers, GPS coordinates, odometer readings, or fuel metrics.
3. Accurately distinguish recorded work orders from deterministic health threshold alerts and ML predictions.
4. If telemetry shows a vehicle has no active trip, report its last known recorded GPS position with exact timestamp and state whether it is confirmed stationary or unconfirmed.
5. If no records exist for a vehicle or metric, clearly state that no records were found in the organisation's fleet.
6. Provide concise, professional, industrial-grade operational insights with exact numbers, units (km, km/L, bar, %), and timestamps.`

/**
 * Validates request Origin/Host to protect against CSRF attacks.
 */
function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  const host = request.headers.get('host')

  if (!origin || !host) {
    // Non-browser or direct curl/internal requests without origin are evaluated normally
    return true
  }

  try {
    const originUrl = new URL(origin)
    return originUrl.host === host || host.includes('localhost') || host.includes('127.0.0.1')
  } catch {
    return false
  }
}

/**
 * Shared multi-instance rate limiting via AuditLog.
 * Uses atomic intent reservation to prevent race conditions during concurrent bursts.
 */
async function checkAndReserveRateLimit(
  userId: string,
  companyId: string
): Promise<{ allowed: boolean; reason?: string }> {
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000)
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)

  // Asynchronously clean up stale reservations older than 5 minutes
  db.auditLog
    .deleteMany({
      where: {
        action: 'ai_query_intent',
        createdAt: { lt: fiveMinutesAgo },
      },
    })
    .catch(() => {})

  // 1. Create atomic reservation intent
  const intentLog = await db.auditLog.create({
    data: {
      userId,
      action: 'ai_query_intent',
      entity: 'optimus_ai',
      entityId: companyId,
      details: JSON.stringify({ reservedAt: new Date().toISOString() }),
    },
  })

  // 2. Count active intents + completed queries in user window
  const userRecentCount = await db.auditLog.count({
    where: {
      userId,
      action: { in: ['ai_query', 'ai_query_intent'] },
      createdAt: { gte: oneMinuteAgo },
    },
  })

  if (userRecentCount > USER_RATE_LIMIT_PER_MINUTE) {
    // Delete reservation and reject
    await db.auditLog.delete({ where: { id: intentLog.id } }).catch(() => {})
    return {
      allowed: false,
      reason: `Rate limit exceeded: maximum ${USER_RATE_LIMIT_PER_MINUTE} requests per minute allowed per user.`,
    }
  }

  // 3. Count active intents + completed queries in organization window
  const orgRecentCount = await db.auditLog.count({
    where: {
      entityId: companyId,
      action: { in: ['ai_query', 'ai_query_intent'] },
      createdAt: { gte: oneHourAgo },
    },
  })

  if (orgRecentCount > ORG_RATE_LIMIT_PER_HOUR) {
    await db.auditLog.delete({ where: { id: intentLog.id } }).catch(() => {})
    return {
      allowed: false,
      reason: `Organisation rate limit exceeded: maximum ${ORG_RATE_LIMIT_PER_HOUR} queries per hour allowed.`,
    }
  }

  return { allowed: true }
}

/**
 * Checks monthly cumulative token expenditure against configured budget.
 */
async function checkMonthlyBudget(companyId: string): Promise<{ budgetOk: boolean; currentSpendUsd: number }> {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const monthlyLogs = await db.auditLog.findMany({
    where: {
      action: 'ai_query',
      entityId: companyId,
      createdAt: { gte: startOfMonth },
    },
    select: { details: true },
    take: 1000,
  })

  let currentSpendUsd = 0
  for (const log of monthlyLogs) {
    if (log.details) {
      try {
        const parsed = JSON.parse(log.details)
        if (typeof parsed.costUsd === 'number') {
          currentSpendUsd += parsed.costUsd
        }
      } catch {}
    }
  }

  const maxBudget = parseFloat(process.env.OPTIMUS_MONTHLY_BUDGET_USD || '') || DEFAULT_MONTHLY_BUDGET_USD
  return {
    budgetOk: currentSpendUsd < maxBudget,
    currentSpendUsd,
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  // 1. Origin & CSRF Validation
  if (!validateOrigin(request)) {
    return NextResponse.json(
      { error: 'FORBIDDEN', message: 'Cross-origin request rejected.' },
      { status: 403 }
    )
  }

  // 2. Authenticate Session or Fallback to Public Fleet Demo Mode
  const session = await getSession()
  let companyId: string | undefined
  let userId: string | undefined
  let userRole: string = 'fleet_manager'

  if (session) {
    if (!session.isActive) {
      return NextResponse.json(
        { error: 'ACCOUNT_INACTIVE', message: 'User account is inactive or suspended.' },
        { status: 403 }
      )
    }

    companyId = session.company?.id
    userId = session.id || (session as any).user?.id
    userRole = session.role || 'fleet_manager'

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'NO_ORGANISATION', message: 'User is not assigned to an active fleet organisation.' },
        { status: 403 }
      )
    }

    // Verify RBAC Permissions
    const canAccessAi =
      hasPermission(session.role, 'ai:view') ||
      hasPermission(session.role, 'fleet:view') ||
      hasPermission(session.role, 'reports:view')

    if (!canAccessAi) {
      return NextResponse.json(
        { error: 'FORBIDDEN', message: `Role "${session.role}" lacks permission to access Optimus AI.` },
        { status: 403 }
      )
    }
  } else {
    // Public Portal / Demo Visitor: associate with default fleet organisation
    const defaultCompany = await db.company.findFirst({
      select: {
        id: true,
        members: {
          take: 1,
          select: { userId: true },
        },
      },
    })
    companyId = defaultCompany?.id
    userId = defaultCompany?.members[0]?.userId

    if (!companyId || !userId) {
      return NextResponse.json(
        { error: 'NO_ORGANISATION', message: 'No default fleet organisation configured for demo.' },
        { status: 404 }
      )
    }
  }

  // 5. Validate Request Payload
  let body: any
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Invalid JSON request payload.' },
      { status: 400 }
    )
  }

  const messageText = typeof body.message === 'string' ? body.message.trim() : ''
  if (!messageText) {
    return NextResponse.json(
      { error: 'BAD_REQUEST', message: 'Message field cannot be empty.' },
      { status: 400 }
    )
  }

  if (messageText.length > MAX_MESSAGE_LENGTH) {
    return NextResponse.json(
      {
        error: 'BAD_REQUEST',
        message: `Message exceeds maximum allowed length of ${MAX_MESSAGE_LENGTH} characters.`,
      },
      { status: 400 }
    )
  }

  // 6. Check Rate Limits (Multi-Instance Concurrency Safe)
  const rateLimitCheck = await checkAndReserveRateLimit(userId, companyId)
  if (!rateLimitCheck.allowed) {
    return NextResponse.json(
      { error: 'RATE_LIMIT_EXCEEDED', message: rateLimitCheck.reason },
      { status: 429 }
    )
  }

  // 7. Check Monthly Spend Cap
  const budgetCheck = await checkMonthlyBudget(companyId)
  if (!budgetCheck.budgetOk) {
    return NextResponse.json(
      {
        error: 'BUDGET_CAP_EXCEEDED',
        message: `Monthly operational AI budget cap reached ($${budgetCheck.currentSpendUsd.toFixed(2)} USD). Contact enterprise administrator.`,
      },
      { status: 429 }
    )
  }

  // 8. Sanitize Conversation History
  const rawHistory: any[] = Array.isArray(body.history) ? body.history : []
  const sanitizedHistory: IAssistantMessage[] = rawHistory
    .slice(-MAX_HISTORY_LENGTH)
    .filter((m) => m && typeof m.content === 'string')
    .map((m, idx) => ({
      id: m.id || `hist-${idx}`,
      role: m.role === 'assistant' ? 'assistant' : m.role === 'tool' ? 'tool' : 'user',
      content: String(m.content).slice(0, 4000),
      timestamp: m.timestamp || new Date().toISOString(),
      toolCalls: Array.isArray(m.toolCalls) ? m.toolCalls : undefined,
      toolResults: Array.isArray(m.toolResults) ? m.toolResults : undefined,
    }))

  // Construct message thread starting with System Instruction
  const conversationThread: IAssistantMessage[] = [
    {
      id: 'sys-prompt',
      role: 'system',
      content: OPTIMUS_SYSTEM_PROMPT,
      timestamp: new Date().toISOString(),
    },
    ...sanitizedHistory,
    {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString(),
    },
  ]

  // 9. Multi-Turn Tool Calling Execution Loop
  const provider = getLlmProvider()
  const executedTools: IToolResult[] = []
  let totalPromptTokensEstimate = Math.ceil(messageText.length / 4) + 500
  let totalOutputTokensEstimate = 0
  let finalAssistantMessage: IAssistantMessage | null = null

  try {
    let currentRound = 0
    let continueLoop = true

    while (continueLoop && currentRound < MAX_TOOL_ROUNDS) {
      currentRound++

      const completion = await provider.generateCompletion(
        conversationThread,
        FLEETVISION_ASSISTANT_TOOLS,
        {
          modelName: 'gemini-3.8-flash',
          temperature: 0.2,
          maxTokens: 2048,
        }
      )

      finalAssistantMessage = completion.message
      totalOutputTokensEstimate += Math.ceil((completion.message.content || '').length / 4)

      if (completion.finishReason === 'tool_calls' && completion.message.toolCalls && completion.message.toolCalls.length > 0) {
        // Append model's tool-call request to thread
        conversationThread.push(completion.message)

        // Execute each requested tool through Stage 2 Allowlisted Dispatcher
        for (const toolCall of completion.message.toolCalls) {
          const executionResult = await executeAssistantTool(
            toolCall.name,
            toolCall.arguments,
            {
              userId,
              companyId,
              role: userRole,
            }
          )

          const toolResultItem: IToolResult = {
            toolCallId: toolCall.id,
            name: toolCall.name,
            result: executionResult.data ?? { error: executionResult.error },
            isError: !executionResult.success,
          }

          executedTools.push(toolResultItem)

          // Append tool result message to conversation thread for next round
          conversationThread.push({
            id: `tool-${Date.now()}-${toolCall.id}`,
            role: 'tool',
            content: JSON.stringify(toolResultItem.result),
            timestamp: new Date().toISOString(),
            toolResults: [toolResultItem],
          })

          totalPromptTokensEstimate += Math.ceil(JSON.stringify(toolResultItem.result).length / 4)
        }
      } else {
        // Standard textual response received; stop loop
        continueLoop = false
      }
    }

    if (!finalAssistantMessage) {
      throw new Error('Provider returned empty response.')
    }

    // 10. Calculate Usage & Cost and Record Audit Log
    const estimatedCostUsd =
      totalPromptTokensEstimate * COST_PER_INPUT_TOKEN +
      totalOutputTokensEstimate * COST_PER_OUTPUT_TOKEN

    await db.auditLog.create({
      data: {
        userId: userId!,
        action: 'ai_query',
        entity: 'optimus_ai',
        entityId: companyId,
        details: JSON.stringify({
          model: 'gemini-3.8-flash',
          promptTokens: totalPromptTokensEstimate,
          candidateTokens: totalOutputTokensEstimate,
          totalTokens: totalPromptTokensEstimate + totalOutputTokensEstimate,
          costUsd: Math.round(estimatedCostUsd * 10000) / 10000,
          toolRounds: currentRound,
          toolsExecuted: executedTools.map((t) => t.name),
          durationMs: Date.now() - startTime,
        }),
      },
    })

    return NextResponse.json({
      message: finalAssistantMessage,
      executedTools,
      usage: {
        promptTokens: totalPromptTokensEstimate,
        candidateTokens: totalOutputTokensEstimate,
        totalTokens: totalPromptTokensEstimate + totalOutputTokensEstimate,
        estimatedCostUsd: Math.round(estimatedCostUsd * 10000) / 10000,
      },
      provider: provider.name,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('[Optimus AI Chat Route Error]:', errorMsg)

    return NextResponse.json(
      {
        error: 'AI_PROVIDER_ERROR',
        message: 'The Optimus AI reasoning engine is currently unreachable.',
        details: errorMsg,
      },
      { status: 503 }
    )
  }
}
