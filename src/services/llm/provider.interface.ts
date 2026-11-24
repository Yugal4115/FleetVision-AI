import { IAssistantMessage, IToolDefinition } from './types'

export interface ILlmProviderConfig {
  apiKey?: string
  modelName: string
  temperature?: number
  maxTokens?: number
}

/**
 * Provider-Agnostic LLM Interface.
 * Allows swapping between Google Gemini, OpenAI, Claude, or local Ollama runtime
 * without touching UI components.
 */
export interface ILlmProvider {
  name: string
  generateCompletion(
    messages: IAssistantMessage[],
    tools: IToolDefinition[],
    config: ILlmProviderConfig
  ): Promise<{
    message: IAssistantMessage
    finishReason: 'stop' | 'tool_calls' | 'length'
  }>
}
