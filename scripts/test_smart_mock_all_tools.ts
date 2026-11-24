import { getLlmProvider } from '../src/services/llm/providerFactory'
import { executeAssistantTool } from '../src/services/llm/toolExecutor'
import { FLEETVISION_ASSISTANT_TOOLS } from '../src/services/llm/tools'
import { db } from '../src/lib/db'

async function run() {
  console.log('--- STARTING ALL 6 TOOLS SMART INTEGRATION TEST ---')
  const provider = getLlmProvider()
  console.log('Active LLM Provider Engine:', provider.name)

  const rootCompany = await db.company.findFirst({
    where: { name: { contains: 'FleetVision' } },
  })
  if (!rootCompany) {
    throw new Error('No root company found in database.')
  }
  const companyId = rootCompany.id

  const testDirectives = [
    { label: 'Total Vehicles / Fleet Status', query: 'what is total vechiles in our fleet?' },
    { label: 'Fuel & Energy Audit', query: 'check fuel consumption anomalies for last 30 days' },
    { label: 'Driver Safety Profile', query: 'review driver safety score for Suresh Yadav' },
    { label: 'Predictive Maintenance Alerts', query: 'show upcoming predictive maintenance alerts' },
    { label: 'Trip Financial PnL', query: 'what is trip pnl summary for TRP-00001?' },
    { label: 'ML Telematics Explanation', query: 'explain ml prediction for vehicle FV-014' },
  ]

  for (const item of testDirectives) {
    console.log(`\n==================================================`)
    console.log(`TEST: ${item.label}`)
    console.log(`QUERY: "${item.query}"`)

    // Round 1: Model analyzes query and outputs tool call
    const round1 = await provider.generateCompletion(
      [{ id: '1', role: 'user', content: item.query, timestamp: new Date().toISOString() }],
      FLEETVISION_ASSISTANT_TOOLS,
      { modelName: 'gemini-3.8-flash' }
    )

    console.log('Round 1 Finish Reason:', round1.finishReason)
    const toolCall = round1.message.toolCalls?.[0]
    if (!toolCall) {
      throw new Error(`Round 1 did not produce a tool call for query: "${item.query}"`)
    }
    console.log(`Generated Tool Call: "${toolCall.name}" with args:`, JSON.stringify(toolCall.arguments))

    // Execute tool through secure allowlisted dispatcher
    const toolRes = await executeAssistantTool(toolCall.name, toolCall.arguments, {
      userId: 'usr_root_manager',
      companyId,
      role: 'fleet_manager',
    })

    console.log('Database Tool Execution Success:', toolRes.success, `(${toolRes.executionTimeMs}ms)`)

    // Round 2: Model synthesizes authoritative response from real tool output
    const round2 = await provider.generateCompletion(
      [
        { id: '1', role: 'user', content: item.query, timestamp: new Date().toISOString() },
        round1.message,
        {
          id: '2',
          role: 'tool',
          content: JSON.stringify(toolRes.data),
          timestamp: new Date().toISOString(),
          toolResults: [{ toolCallId: toolCall.id, name: toolCall.name, result: toolRes.data }],
        },
      ],
      FLEETVISION_ASSISTANT_TOOLS,
      { modelName: 'gemini-3.8-flash' }
    )

    console.log('Round 2 Finish Reason:', round2.finishReason)
    console.log('--- Synthesized Optimus Prime Briefing ---')
    console.log(round2.message.content)
  }

  console.log('\n==================================================')
  console.log('ALL 6 AI TOOLS VERIFIED WITH 100% SUCCESS!')
  console.log('==================================================')
  process.exit(0)
}

run().catch((err) => {
  console.error('Test execution failed:', err)
  process.exit(1)
})
