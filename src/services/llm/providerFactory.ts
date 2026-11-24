import { ILlmProvider, ILlmProviderConfig } from './provider.interface'
import { GeminiProvider } from './providers/geminiProvider'
import { MockProvider } from './providers/mockProvider'

let cachedGeminiProvider: GeminiProvider | null = null
let cachedMockProvider: MockProvider | null = null

/**
 * CANONICAL LLM PROVIDER FACTORY
 * Resolves the active provider based on environment secrets:
 * - If GEMINI_API_KEY is configured: returns production GeminiProvider (gemini-3.8-flash)
 * - If absent: returns resilient MockProvider to preserve offline developer simulation
 */
export function getLlmProvider(config?: Partial<ILlmProviderConfig>): ILlmProvider {
  const apiKey = config?.apiKey || process.env.GEMINI_API_KEY

  if (apiKey) {
    if (!cachedGeminiProvider) {
      cachedGeminiProvider = new GeminiProvider(apiKey)
    }
    return cachedGeminiProvider
  }

  // Always return fresh MockProvider instance to prevent stale singleton cache
  return new MockProvider()
}

/**
 * Returns current provider status and health diagnostic without leaking keys
 */
export async function getProviderDiagnostics(): Promise<{
  activeProvider: string
  hasApiKey: boolean
  health: { isHealthy: boolean; latencyMs: number; error?: string }
}> {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY)
  const provider = getLlmProvider()

  let health: { isHealthy: boolean; latencyMs: number; error?: string }

  if (provider instanceof GeminiProvider) {
    health = await provider.healthCheck()
  } else {
    health = await (provider as MockProvider).healthCheck()
  }

  return {
    activeProvider: provider.name,
    hasApiKey,
    health,
  }
}
