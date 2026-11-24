'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  X,
  Send,
  Sparkles,
  Activity,
  Fuel,
  Wrench,
  ShieldCheck,
  Minimize2,
  Maximize2,
  RotateCcw,
  ChevronRight,
  Radio,
  Cpu,
} from 'lucide-react'

/**
 * EXACT TRANSFORMERS AUTOBOT INSIGNIA SVG ICON — GRAPHITE EDITION
 * Authentic canonical Autobot emblem with brushed graphite titanium armor & glowing Cybertronian cyan optics
 */
export function TransformerOptimusIcon({
  className = 'w-6 h-6',
  opticGlow = true,
  opticColor = '#00F0FF',
  variant = 'graphite',
  ...props
}: React.SVGProps<SVGSVGElement> & {
  opticGlow?: boolean
  opticColor?: string
  variant?: 'graphite' | 'sunset'
}) {
  const gradId = React.useId()

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <defs>
        {/* Brushed Titanium Graphite vs Sunset Metallic Gradient */}
        {variant === 'graphite' ? (
          <linearGradient id={`autobot-armor-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="20%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="80%" stopColor="#475569" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
        ) : (
          <linearGradient id={`autobot-armor-${gradId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2D6" />
            <stop offset="25%" stopColor="#FBB931" />
            <stop offset="60%" stopColor="#EA6113" />
            <stop offset="100%" stopColor="#A82800" />
          </linearGradient>
        )}

        {/* Glowing Cybertronian Optic Flare */}
        <radialGradient id={`autobot-optic-${gradId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="35%" stopColor={opticColor} stopOpacity="0.95" />
          <stop offset="80%" stopColor={opticColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={opticColor} stopOpacity="0" />
        </radialGradient>

        {/* Armor Specular Drop Shadow */}
        <filter id={`autobot-glow-${gradId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="0.7"
            floodColor={variant === 'graphite' ? '#64748B' : '#EA6113'}
            floodOpacity="0.85"
          />
        </filter>
      </defs>

      {/* Cybertronian Glowing Optics (Illuminates from behind the eye slits) */}
      {opticGlow && (
        <g className="animate-pulse">
          <circle cx="10.5" cy="12.2" r="1.6" fill={`url(#autobot-optic-${gradId})`} />
          <circle cx="21.5" cy="12.2" r="1.6" fill={`url(#autobot-optic-${gradId})`} />
          <ellipse cx="10.5" cy="12.2" rx="0.75" ry="0.6" fill="#FFFFFF" />
          <ellipse cx="21.5" cy="12.2" rx="0.75" ry="0.6" fill="#FFFFFF" />
        </g>
      )}

      {/* Exact Canonical Transformers Autobot Insignia Faceplate */}
      <path
        fill={`url(#autobot-armor-${gradId})`}
        filter={`url(#autobot-glow-${gradId})`}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.115 5.265l0.045-1.455c-2.694-1.348-5.686-2.155-8.973-2.155s-6.653 0.807-9.347 2.155l0.045 1.455 9.115 5.981 9.115-5.981zM16 4.556c1.875 0 3.448 0.601 3.448 0.601l-3.448 2.317-3.448-2.317c0 0 1.573-0.601 3.448-0.601zM18.073 23.977v-7.020l0.468-6.035-2.541 1.671-2.479-1.671 0.53 6.035v7.020h4.022zM12.39 10.276l-6.789-4.526-0.045-1.761h-3.996l0.593 8.55 4.85 3.466h5.927l-0.54-5.729zM4.685 10.653l6.412 3.018 0.107 0.989-6.357-2.875-0.162-1.132zM4.415 7.582l6.358 3.071 0.161 1.069-6.411-2.955-0.108-1.185zM4.308 26.549l4.735 2.424v-9.412l-2.796-1.74v-1.078l-2.748-1.886 0.809 11.692zM13.054 24.992v-7.012l-3.071 1.562v10.186l1.384 0.861 1.886-4.598h5.496l1.886 4.598 1.446-0.861v-10.185l-3.071-1.562v7.012h-5.956zM14.168 27.070l-1.401 3.932h6.466l-1.4-3.932h-3.665zM19.071 16.004h5.927l4.85-3.466 0.593-8.55h-3.996l-0.046 1.762-6.79 4.526-0.538 5.728zM27.153 11.785l-6.421 3 0.171-1.114 6.412-3.018-0.162 1.132zM27.477 8.767l-6.412 3.018 0.162-1.132 6.358-3.071-0.108 1.185zM28.5 14.856l-2.747 1.886v1.078l-2.755 1.74v9.412l4.694-2.424 0.808-11.692z"
      />
    </svg>
  )
}

interface IMessage {
  id: string
  sender: 'optimus' | 'user'
  text: string
  timestamp: string
  tag?: string
  actions?: Array<{ label: string; query: string }>
  toolsExecuted?: string[]
}

export function OptimusAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  // Close assistant when user clicks outside or presses Escape
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const [messages, setMessages] = useState<IMessage[]>([
    {
      id: 'welcome',
      sender: 'optimus',
      tag: 'CAN-BUS RECON // 100Hz',
      text: 'Greetings, Fleet Commander. I am Optimus Prime AI, autonomous intelligence engine for FleetVision. All 16 heavy commercial haulers and J1939 CAN-Bus telemetry streams are synchronized online. What operational vector shall we analyze?',
      timestamp: 'Just now',
      actions: [
        { label: '⚡ Fleet Health Radar', query: 'Analyze vehicle health radar scores across fleet' },
        { label: '⛽ Fuel & Energy Audit', query: 'Check fuel consumption anomalies' },
        { label: '🔧 Predictive Maintenance', query: 'Show upcoming predictive maintenance' },
        { label: '🛡️ Driver Safety Index', query: 'Review driver safety rankings' },
      ],
    },
  ])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim()
    if (!textToSend || isThinking) return

    const userMsg: IMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!queryText) setInput('')
    setIsThinking(true)

    try {
      const historyPayload = messages.slice(-6).map((m) => ({
        id: m.id,
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
        timestamp: m.timestamp,
      }))

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
        }),
      })

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}))
        let errMsg = errJson.details || errJson.message || 'Optimus AI service is temporarily degraded.'
        if (response.status === 401) {
          errMsg = 'Session expired. Please re-authenticate in Fleet Console.'
        } else if (response.status === 403) {
          errMsg = errJson.message || 'Access restricted by operational RBAC.'
        } else if (response.status === 429) {
          errMsg = errJson.message || 'Operational AI rate limit or budget reached.'
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: 'optimus',
            tag: 'SYSTEM NOTICE',
            text: errMsg,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ])
        return
      }

      const data = await response.json()
      const toolNames: string[] = Array.isArray(data.executedTools)
        ? data.executedTools.map((t: any) => t.name)
        : []

      const tagLabel = toolNames.length > 0
        ? `TOOL // ${toolNames[0].toUpperCase()}`
        : 'TELEMETRICS // VERIFIED'

      setMessages((prev) => [
        ...prev,
        {
          id: data.message?.id || `optimus-${Date.now()}`,
          sender: 'optimus',
          tag: tagLabel,
          text: data.message?.content || 'Telemetry query resolved with zero anomalies.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolsExecuted: toolNames,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'optimus',
          tag: 'CONNECTION FAULT',
          text: 'Communication link interrupted. Verify network connection and backend status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    } finally {
      setIsThinking(false)
    }
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'welcome-reset',
        sender: 'optimus',
        tag: 'TELEMETRIC RE-SYNC',
        text: 'Optimus AI session re-initialized. CAN-Bus telemetry link established with 16 commercial haulers. What intelligence report do you require?',
        timestamp: 'Just now',
        actions: [
          { label: '⚡ Fleet Health', query: 'Analyze vehicle health radar scores across fleet' },
          { label: '⛽ Fuel Check', query: 'Check fuel consumption anomalies' },
          { label: '🔧 Service Status', query: 'Show upcoming predictive maintenance' },
        ],
      },
    ])
  }

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 select-none">
      {/* 1. EXPANDABLE FLOATING INTELLIGENT ASSISTANT COCKPIT */}
      {isOpen && (
        <div
          className={`mb-4 w-[430px] max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden flex flex-col transition-all duration-300 relative border border-[#E5DFD7] shadow-[0_24px_60px_rgba(7,81,138,0.14),0_0_35px_rgba(234,97,19,0.12)] bg-white/95 backdrop-blur-2xl text-[#0C1E36] ${
            isMinimized ? 'h-18' : 'h-[580px] max-h-[85vh]'
          }`}
        >
          {/* COLOR GRADING ACCENT BLOOMS (Luminous Light Sunset Orange & Amber) */}
          <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-[#EA6113]/12 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 -right-16 w-48 h-48 rounded-full bg-[#FCB234]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/4 w-48 h-48 rounded-full bg-[#07518A]/10 blur-3xl pointer-events-none" />

          {/* SUBTLE TELEMETRY GRID OVERLAY */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(to right, #0C1E36 1px, transparent 1px), linear-gradient(to bottom, #0C1E36 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* HEADER CONSOLE */}
          <div className="relative z-10 px-4 py-3.5 bg-white/90 border-b border-[#E5DFD7] flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              {/* Authenticated Autobot Medallion — Machined Graphite */}
              <div className="relative group">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border-2 border-[#4B5563] flex items-center justify-center shadow-md shadow-black/20 group-hover:border-[#94A3B8] transition-all">
                  <TransformerOptimusIcon className="w-7 h-7" variant="graphite" opticGlow opticColor="#EA6113" />
                </div>
                {/* Active Ping Dot */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA6113] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EA6113] border border-white" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-[14px] font-black tracking-wider uppercase font-inter text-[#07518A]">
                    OPTIMUS PRIME
                  </h3>
                  <span className="text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] text-white shadow-xs">
                    AI v4.8
                  </span>
                </div>
                <p className="text-[11px] font-manrope font-semibold text-emerald-700 flex items-center gap-1.5 tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>AUTONOMOUS TELEMETRY // 100Hz</span>
                </p>
              </div>
            </div>

            {/* Tactical Action Buttons */}
            <div className="flex items-center gap-1 text-[#64748B]">
              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 hover:text-[#0C1E36] hover:bg-[#FFF5EC] rounded-lg transition-colors cursor-pointer"
                title="Re-sync Session"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:text-[#0C1E36] hover:bg-[#FFF5EC] rounded-lg transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Close Assistant (Esc or click outside)"
                aria-label="Close Assistant"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* BODY CONTENT (Active viewport) */}
          {!isMinimized && (
            <>
              {/* Message History Viewport */}
              <div className="relative z-10 flex-1 p-4 overflow-y-auto space-y-3.5 text-xs bg-[#FAF9F6]/50">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${
                      m.sender === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    {/* Message Header Strip */}
                    <div className="flex items-center gap-1.5 mb-1 px-1">
                      {m.sender === 'optimus' ? (
                        <>
                          <TransformerOptimusIcon className="w-3.5 h-3.5" variant="graphite" opticGlow opticColor="#EA6113" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#07518A]">
                            OPTIMUS PRIME
                          </span>
                          {m.tag && (
                            <span className="text-[8.5px] font-semibold px-2 py-0.2 rounded-full bg-[#FFF5EC] text-[#EA6113] border border-[#EA6113]/30">
                              {m.tag}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA6113]">
                            COMMANDER
                          </span>
                          <span className="text-[8.5px] font-semibold px-2 py-0.2 rounded-full bg-[#FFF5EC] text-[#84492d] border border-[#EA6113]/25">
                            AUTHORIZED OPS
                          </span>
                        </>
                      )}
                      <span className="text-[10px] text-[#64748B] font-semibold">
                        {m.timestamp}
                      </span>
                    </div>

                    {/* Message Card Body */}
                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed text-[13px] tracking-normal whitespace-pre-wrap ${
                        m.sender === 'user'
                          ? 'bg-gradient-to-r from-[#EA6113] via-[#F7801B] to-[#FCB234] text-white font-medium rounded-tr-xs shadow-[0_4px_16px_rgba(234,97,19,0.25)]'
                          : 'bg-white/95 text-[#0C1E36] border border-[#E5DFD7] rounded-tl-xs shadow-xs backdrop-blur-sm'
                      }`}
                    >
                      {m.text}

                      {/* Genuine Tool Execution Badges */}
                      {m.toolsExecuted && m.toolsExecuted.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2.5 flex-wrap pt-2 border-t border-[#E5DFD7]">
                          {m.toolsExecuted.map((tool) => (
                            <span
                              key={tool}
                              className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1 shadow-2xs"
                            >
                              <Cpu className="w-2.5 h-2.5 text-emerald-600" />
                              <span>{tool}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Tactical Action Chips from Optimus */}
                    {m.actions && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {m.actions.map((act, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSend(act.query)}
                            className="px-3 py-1.5 rounded-xl text-[11px] font-semibold tracking-tight bg-white hover:bg-gradient-to-r hover:from-[#EA6113] hover:to-[#F7801B] text-[#07518A] hover:text-white border border-[#E5DFD7] hover:border-transparent transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                          >
                            {act.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking / Neural Processing HUD */}
                {isThinking && (
                  <div className="flex items-center gap-2.5 text-xs p-3 bg-white rounded-2xl border border-[#EA6113]/40 w-max shadow-md shadow-[#EA6113]/10 backdrop-blur-md animate-pulse">
                    <TransformerOptimusIcon className="w-4 h-4 text-[#EA6113] animate-spin" opticGlow opticColor="#EA6113" />
                    <span className="text-[11px] font-bold text-[#07518A] tracking-wide">
                      OPTIMUS PARSING CAN-BUS TELEMETRY...
                    </span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT COCKPIT */}
              <div className="relative z-10 p-3.5 bg-white/95 border-t border-[#E5DFD7] backdrop-blur-xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Command Optimus AI (e.g. Total vehicles, Fuel, Trips)..."
                    className="flex-1 px-4 py-2.5 rounded-xl text-[13px] font-medium bg-[#FFFDFB] border border-[#E5DFD7] focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 text-[#0C1E36] placeholder:text-[#94A3B8] focus:outline-none transition-all shadow-2xs"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isThinking}
                    className="p-3 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] disabled:opacity-40 text-white transition-all shadow-[0_2px_10px_rgba(234,97,19,0.3)] active:scale-95 cursor-pointer shrink-0"
                    title="Transmit Directive"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Footer Status Indicators */}
                <div className="flex items-center justify-between text-[10.5px] font-medium text-[#64748B] pt-2 px-1">
                  <span className="flex items-center gap-1.5">
                    <Radio className="w-3 h-3 text-[#EA6113] animate-pulse" />
                    <span>Neural J1939 Architecture Active</span>
                  </span>
                  <Link
                    href="/ai-assistant"
                    className="text-[#EA6113] hover:text-[#07518A] flex items-center gap-0.5 font-bold text-[10px] tracking-wide transition-colors"
                  >
                    <span>FULL COCKPIT</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 2. FLOATING CORNER TRIGGER BUTTON (Machined Graphite Autobot Insignia) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-15 h-15 rounded-2xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] text-[#F3F4F6] border-2 transition-all duration-300 flex items-center justify-center shadow-[0_0_25px_rgba(15,23,42,0.7)] hover:scale-110 active:scale-95 group relative cursor-pointer ${
          isOpen
            ? 'border-white text-white shadow-[#00F0FF]/50'
            : 'border-[#4B5563] text-[#F3F4F6] hover:border-[#94A3B8] hover:shadow-[0_0_25px_rgba(100,116,139,0.6)]'
        }`}
        title="Optimus Prime AI — Autonomous Fleet Intelligence"
      >
        {/* Pulsing Ambient Graphite Energy Halo */}
        <span className="absolute inset-0 rounded-2xl bg-[#475569]/30 blur-md group-hover:bg-[#64748B]/50 transition-all" />

        {/* Outer Rotating Cybernetic Radar Ring on Hover */}
        <span className="absolute inset-[-4px] rounded-2xl border border-dashed border-[#94A3B8]/40 opacity-0 group-hover:opacity-100 group-hover:rotate-45 transition-all duration-500 pointer-events-none" />

        {/* Exact Canonical Transformers Autobots Insignia in Brushed Graphite */}
        <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
          <TransformerOptimusIcon
            className="w-8 h-8"
            variant="graphite"
            opticGlow
            opticColor="#00F0FF"
          />
        </div>

        {/* Cybertronian Online Core Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4 z-20">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F0FF] opacity-80" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400 border-2 border-[#101216] shadow-sm shadow-emerald-500" />
        </span>
      </button>
    </div>
  )
}
