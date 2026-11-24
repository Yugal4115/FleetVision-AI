'use client'

import { useState, useCallback } from 'react'
import { IAssistantMessage, IToolResult } from '@/services/llm/types'

export interface IUseFleetAssistantOptions {
  initialGreeting?: string
}

/**
 * PRODUCTION FRONTEND HOOK FOR FLEETVISION AI ASSISTANT
 * Connects directly to authenticated /api/ai/chat endpoint.
 * Handles state, error trapping, multi-turn history, and tool execution status.
 */
export function useFleetAssistant(options: IUseFleetAssistantOptions = {}) {
  const defaultGreeting =
    options.initialGreeting ||
    'Greetings, Commander. I am Optimus AI, linked to your commercial fleet CAN-Bus records. What telemetry, driver safety, or predictive maintenance report do you require?'

  const [messages, setMessages] = useState<IAssistantMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: defaultGreeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 1.0,
    },
  ])

  const [isThinking, setIsThinking] = useState(false)
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [lastExecutedTools, setLastExecutedTools] = useState<IToolResult[]>([])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isThinking) return

      setError(null)
      setActiveTool('Connecting to Fleet Telematics Engine...')

      const userMsg: IAssistantMessage = {
        id: `usr-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      // Optimistically append user message to thread
      setMessages((prev) => [...prev, userMsg])
      setIsThinking(true)

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            history: messages.slice(-8), // Send recent conversation context
          }),
        })

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}))
          let errorDescription = 'An unexpected error occurred while communicating with Optimus AI.'

          if (response.status === 401) {
            errorDescription = 'Your session has expired. Please sign in again to access fleet intelligence.'
          } else if (response.status === 403) {
            errorDescription = errData.message || 'Access denied: Insufficient fleet operational permissions.'
          } else if (response.status === 429) {
            errorDescription = errData.message || 'Operational AI quota or budget limit reached. Please wait.'
          } else if (response.status === 503) {
            errorDescription = 'Optimus AI reasoning service is currently degraded or unreachable.'
          }

          setError(errorDescription)

          const errorReply: IAssistantMessage = {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `[ALERT: OPERATIONAL NOTICE]\n\n${errorDescription}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            confidence: 0,
          }

          setMessages((prev) => [...prev, errorReply])
          return
        }

        const data = await response.json()
        const assistantMessage: IAssistantMessage = {
          ...data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolResults: data.executedTools,
        }

        if (data.executedTools && data.executedTools.length > 0) {
          setLastExecutedTools(data.executedTools)
        }

        setMessages((prev) => [...prev, assistantMessage])
      } catch (err: unknown) {
        const netErr = 'Network connection failed. Verify internet and server availability.'
        setError(netErr)
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: `[COMMUNICATION ERROR]\n\n${netErr}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            confidence: 0,
          },
        ])
      } finally {
        setIsThinking(false)
        setActiveTool(null)
      }
    },
    [isThinking, messages]
  )

  const resetSession = useCallback(() => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: defaultGreeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 1.0,
      },
    ])
    setError(null)
    setActiveTool(null)
    setLastExecutedTools([])
  }, [defaultGreeting])

  return {
    messages,
    isThinking,
    activeTool,
    error,
    lastExecutedTools,
    sendMessage,
    resetSession,
  }
}
