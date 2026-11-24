import { GoogleGenAI } from '@google/genai'
import { ILlmProvider, ILlmProviderConfig } from '../provider.interface'
import { IAssistantMessage, IToolCall, IToolDefinition } from '../types'

/**
 * PRODUCTION GOOGLE GEMINI PROVIDER
 * Directly implements ILlmProvider using official @google/genai SDK (pinned v3.6.1).
 * Anchored to gemini-3.8-flash for low-latency, deterministic fleet intelligence.
 */
export class GeminiProvider implements ILlmProvider {
  public readonly name = 'GoogleGeminiProvider'
  private client: GoogleGenAI | null = null
  private resolvedApiKey: string | null = null

  constructor(apiKey?: string) {
    this.resolvedApiKey = apiKey || process.env.GEMINI_API_KEY || null
    if (this.resolvedApiKey) {
      this.client = new GoogleGenAI({ apiKey: this.resolvedApiKey })
    }
  }

  private getClient(overrideKey?: string): GoogleGenAI {
    const key = overrideKey || this.resolvedApiKey || process.env.GEMINI_API_KEY
    if (!key) {
      throw new Error(
        'GEMINI_API_KEY is not configured. Please supply a valid Google Gemini API key in the server environment.'
      )
    }
    if (!this.client || this.resolvedApiKey !== key) {
      this.resolvedApiKey = key
      this.client = new GoogleGenAI({ apiKey: key })
    }
    return this.client
  }

  /**
   * Health probe to verify SDK connectivity without exposing secrets.
   */
  async healthCheck(): Promise<{ isHealthy: boolean; latencyMs: number; error?: string }> {
    const start = Date.now()
    try {
      const client = this.getClient()
      // Execute minimal non-sensitive prompt with 1 max token to verify API key & network
      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'ping',
        config: {
          maxOutputTokens: 1,
          temperature: 0,
        },
      })

      const latencyMs = Date.now() - start
      if (response && response.text !== undefined) {
        return { isHealthy: true, latencyMs }
      }
      return { isHealthy: false, latencyMs, error: 'Empty response returned from model' }
    } catch (err: unknown) {
      const latencyMs = Date.now() - start
      const message = err instanceof Error ? err.message : String(err)
      return { isHealthy: false, latencyMs, error: message }
    }
  }

  /**
   * Primary completion method satisfying canonical ILlmProvider contract.
   */
  async generateCompletion(
    messages: IAssistantMessage[],
    tools: IToolDefinition[] = [],
    config: ILlmProviderConfig
  ): Promise<{
    message: IAssistantMessage
    finishReason: 'stop' | 'tool_calls' | 'length'
  }> {
    const client = this.getClient(config.apiKey)
    const modelName = config.modelName || 'gemini-3.8-flash'

    // Separate system prompt from conversational content
    const systemMessages = messages.filter((m) => m.role === 'system')
    const conversationalMessages = messages.filter((m) => m.role !== 'system')

    const systemInstruction = systemMessages.map((m) => m.content).join('\n\n') || undefined

    // Map IAssistantMessage to Gemini contents
    const contents = conversationalMessages.map((m) => {
      if (m.role === 'tool') {
        return {
          role: 'user',
          parts: [
            {
              text: `[TOOL_RESULT: ${m.toolResults?.[0]?.name || 'unknown'}]\n${JSON.stringify(
                m.toolResults?.[0]?.result ?? m.content
              )}`,
            },
          ],
        }
      }

      return {
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }],
      }
    })

    // If no contents provided, inject neutral prompt
    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Operational status query' }] })
    }

    // Map tools to Gemini functionDeclarations format
    const functionDeclarations = tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    }))

    const geminiConfig: Record<string, unknown> = {
      temperature: config.temperature ?? 0.2,
      maxOutputTokens: config.maxTokens ?? 2048,
    }

    if (systemInstruction) {
      geminiConfig.systemInstruction = systemInstruction
    }

    if (functionDeclarations.length > 0) {
      geminiConfig.tools = [{ functionDeclarations }]
    }

    const response = await client.models.generateContent({
      model: modelName,
      contents,
      config: geminiConfig,
    })

    const candidate = response.candidates?.[0]
    const parts = candidate?.content?.parts || []

    // Detect function calls from model output parts
    const toolCalls: IToolCall[] = []
    let textContent = ''

    for (const part of parts) {
      if (part.text) {
        textContent += part.text
      }
      if (part.functionCall) {
        toolCalls.push({
          id: `call_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          name: part.functionCall.name || '',
          arguments: (part.functionCall.args as Record<string, unknown>) || {},
        })
      }
    }

    const finishReason: 'stop' | 'tool_calls' | 'length' =
      toolCalls.length > 0
        ? 'tool_calls'
        : candidate?.finishReason === 'MAX_TOKENS'
        ? 'length'
        : 'stop'

    return {
      message: {
        id: `gemini-${Date.now()}`,
        role: 'assistant',
        content: textContent,
        timestamp: new Date().toISOString(),
        toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
        confidence: 0.98,
      },
      finishReason,
    }
  }
}
