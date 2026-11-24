/**
 * FLEETVISION AI ASSISTANT — TYPES & CONTRACTS
 */

export interface IToolDefinition {
  name: string
  description: string
  parameters: Record<string, any>
}

export type AssistantRole = 'user' | 'assistant' | 'system' | 'tool'

export interface IToolCall {
  id: string
  name: string
  arguments: Record<string, any>
}

export interface IToolResult {
  toolCallId: string
  name: string
  result: any
  isError?: boolean
}

export interface IAssistantMessage {
  id: string
  role: AssistantRole
  content: string
  timestamp: string
  toolCalls?: IToolCall[]
  toolResults?: IToolResult[]
  confidence?: number
  domainContext?: 'vehicle' | 'driver' | 'trip' | 'finance' | 'maintenance' | 'ml_explanation'
}

export interface IAssistantQueryRequest {
  conversationId: string
  message: string
  history?: IAssistantMessage[]
  allowedTools?: string[]
}

export interface IAssistantQueryResponse {
  message: IAssistantMessage
  executedTools: IToolResult[]
  suggestedFollowUps?: string[]
}
