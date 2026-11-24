'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Send,
  Sparkles,
  ChevronRight,
  RotateCcw,
  Cpu,
  AlertCircle,
  Activity,
} from 'lucide-react'
import { TransformerOptimusIcon } from '@/modules/ai/OptimusAssistantWidget'
import { DemoBadge } from '@/design-system/DemoBadge'
import { useFleetAssistant } from '@/modules/assistant/useAssistant'

export default function AIAssistantPage() {
  const [query, setQuery] = useState('')
  const {
    messages,
    isThinking,
    activeTool,
    error,
    lastExecutedTools,
    sendMessage,
    resetSession,
  } = useFleetAssistant({
    initialGreeting:
      'Greetings, Fleet Commander. I am Optimus Prime AI, autonomous intelligence engine for FleetVision. All 16 heavy commercial haulers and J1939 CAN-Bus telemetry streams are synchronized online. What operational vector shall we analyze?',
  })

  const quickPrompts = [
    { label: '⚡ Fleet Health Radar', prompt: 'Analyze vehicle health radar scores across fleet' },
    { label: '⛽ Fuel & Energy Audit', prompt: 'Check fuel consumption anomalies for the past 30 days' },
    { label: '🔧 Predictive Maintenance', prompt: 'Show upcoming predictive maintenance alerts' },
    { label: '🛡️ Driver Safety Rankings', prompt: 'Review driver safety rankings and recent incidents' },
    { label: '🚛 Flagship Telemetry (FV-014)', prompt: 'What is the current operational status and battery state of vehicle FV-014?' },
  ]

  const handleExecute = (pText: string) => {
    if (isThinking) return
    setQuery('')
    sendMessage(pText)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner with Optimus Prime Theme — Light Sunset Orange */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white/90 backdrop-blur-xl text-[#0C1E36] border border-[#E5DFD7] shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-[#EA6113]/10 via-[#FCB234]/15 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] text-white flex items-center justify-center shadow-md shadow-black/20 border-2 border-[#4B5563] shrink-0">
              <TransformerOptimusIcon className="w-10 h-10" variant="graphite" opticGlow opticColor="#EA6113" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-inter uppercase tracking-tight text-[#07518A]">
                  OPTIMUS PRIME <span className="text-[#EA6113]">AI</span>
                </h1>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFF5EC] text-[#EA6113] border border-[#EA6113]/30 shadow-2xs">
                  NEURAL COPILOT
                </span>
                <DemoBadge label="CAN-BUS 100Hz" />
              </div>
              <p className="text-xs font-manrope font-semibold text-[#64748B] tracking-wide">
                Persistent Intelligent Telematics Assistant · Autonomous LLM Heavy Commercial Fleet Intelligence
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={resetSession}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF5EC] text-[#0C1E36] font-mono text-xs font-bold transition-colors border border-[#E5DFD7] flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
              <span>Reset Context</span>
            </button>
            <Link
              href="/ai-center"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-[#EA6113]/25"
            >
              <span>AI Intelligence Center</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Interactive Copilot Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] space-y-6 shadow-sm flex flex-col justify-between text-[#0C1E36]">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#E5DFD7] pb-4">
              <h3 className="text-base font-bold font-inter text-[#07518A] uppercase tracking-wide">
                Natural Language Telematics Directives
              </h3>
              <span className="text-xs font-mono font-semibold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                Live Tool Engine Active
              </span>
            </div>

            {/* Quick Prompt Chips (Sunset Orange & Frosted White Badges) */}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleExecute(qp.prompt)}
                  disabled={isThinking}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white hover:bg-[#FFF5EC] text-[#07518A] hover:text-[#EA6113] border border-[#E5DFD7] hover:border-[#EA6113]/50 transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Conversation Log Viewport */}
            <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
              {messages.map((m) => {
                const isOptimus = m.role === 'assistant'
                const toolNames = m.toolResults?.map((t) => t.name) || []

                return (
                  <div
                    key={m.id}
                    className={`p-5 rounded-2xl border shadow-2xs space-y-2 transition-all ${
                      isOptimus
                        ? 'bg-[#FFFDFB] border-[#E5DFD7] text-[#0C1E36]'
                        : 'bg-gradient-to-r from-[#EA6113] via-[#F7801B] to-[#FCB234] text-white border-transparent ml-8 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <div className="flex items-center gap-2">
                        {isOptimus ? (
                          <>
                            <TransformerOptimusIcon
                              className="w-4 h-4"
                              variant="graphite"
                              opticGlow
                              opticColor="#EA6113"
                            />
                            <span className="text-[#07518A] uppercase tracking-wider font-bold text-[11px]">
                              Optimus AI Copilot
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-white uppercase tracking-wider font-bold text-[11px]">
                              Commander Fleet Directive
                            </span>
                          </>
                        )}
                      </div>
                      <span className={`${isOptimus ? 'text-[#64748B]' : 'text-white/80'} font-normal text-[11px]`}>{m.timestamp}</span>
                    </div>

                    <p className={`text-xs font-sans font-medium leading-relaxed whitespace-pre-wrap ${isOptimus ? 'text-[#0C1E36]' : 'text-white'}`}>
                      {m.content}
                    </p>

                    {/* Tool Badges */}
                    {toolNames.length > 0 && (
                      <div className="flex items-center gap-1.5 pt-2 border-t border-[#E5DFD7] flex-wrap">
                        {toolNames.map((tn) => (
                          <span
                            key={tn}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"
                          >
                            <Cpu className="w-3 h-3 text-emerald-600" />
                            <span>Executed: {tn}</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Thinking Indicator */}
              {isThinking && (
                <div className="p-4 rounded-2xl bg-white border border-[#EA6113]/40 text-xs font-mono text-[#07518A] flex items-center gap-2.5 animate-pulse shadow-sm">
                  <Sparkles className="w-4 h-4 animate-spin text-[#EA6113]" />
                  <span>{activeTool || 'Optimus LLM Telematics Copilot reasoning through fleet telemetry...'}</span>
                </div>
              )}

              {/* Error Notice */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (query.trim()) handleExecute(query)
            }}
            className="flex items-center gap-2 pt-4 border-t border-[#E5DFD7]"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isThinking}
              placeholder="Ask Optimus: 'What is the fuel economy of vehicle FV-014?' or 'Review driver safety rankings'..."
              className="flex-1 h-12 px-4 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] text-xs font-medium text-[#0C1E36] placeholder-[#94A3B8] focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isThinking || !query.trim()}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md shadow-[#EA6113]/25 disabled:opacity-50 transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Analyze</span>
            </button>
          </form>
        </div>

        {/* Quick Diagnostics Panel — Frosted White & Deep Nordic Blue */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] space-y-5 shadow-sm text-[#0C1E36]">
          <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[#07518A] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EA6113] animate-ping" />
            Telemetry Engine Status
          </h3>
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">LLM Model Engine</span>
                <span className="font-bold text-[#07518A]">Gemini 3.8 Flash (Optimus Neural)</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">Telemetry Protocol</span>
                <span className="font-bold text-[#0C1E36]">100 Hz Streaming CAN 2.0B</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">Active Fleet Corridor</span>
                <span className="font-bold text-[#0C1E36]">FleetVision Core Network</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">Allowlisted Tools</span>
                <span className="font-bold text-emerald-700">6 Domain Tools Active</span>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#FFFDFB] border border-[#E5DFD7] space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#64748B]">Tenant Isolation</span>
                <span className="font-bold text-emerald-700">Enforced (AND Array)</span>
              </div>
            </div>
          </div>

          {/* Last Executed Tools Summary */}
          {lastExecutedTools.length > 0 && (
            <div className="pt-3 border-t border-[#E5DFD7] space-y-2">
              <span className="text-[11px] font-mono font-bold text-[#64748B] uppercase">
                Last Telematics Query Actions
              </span>
              <div className="flex flex-col gap-1.5">
                {lastExecutedTools.map((t, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-[#FFFDFB] border border-[#E5DFD7] text-[11px] font-mono flex items-center justify-between"
                  >
                    <span className="font-bold text-[#07518A] flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#EA6113]" />
                      {t.name}
                    </span>
                    <span className="text-emerald-700 font-bold">Executed</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
