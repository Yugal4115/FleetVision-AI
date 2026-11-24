'use client'

import React from 'react'
import { CheckCircle2, ShieldCheck, Zap, Activity, Cpu, ArrowRight } from 'lucide-react'
import { IAuthUser } from '../hooks/useAuth'

interface AccessGrantedSequenceProps {
  user: IAuthUser | null
  initStep: number
}

const STEPS = [
  { label: 'Establishing encrypted gateway session token', icon: ShieldCheck },
  { label: 'Loading authorized fleet roster & operational profiles', icon: Activity },
  { label: 'Synchronizing high-voltage CAN-bus telemetry & predictive models', icon: Zap },
  { label: 'Preparing operational executive dashboard', icon: Cpu },
]

export const AccessGrantedSequence: React.FC<AccessGrantedSequenceProps> = ({ user, initStep }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#070F1C]/95 backdrop-blur-2xl border border-[#F5E500]/40 shadow-[0_0_50px_rgba(245,229,0,0.25)] text-center text-white space-y-6 animate-in fade-in zoom-in-95 duration-500"
    >
      {/* HUD Scanner Icon */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-[#F5E500] animate-ping opacity-30" />
        <div className="absolute inset-1 rounded-full border border-[#07518A] animate-spin" />
        <div className="w-16 h-16 rounded-full bg-[#07518A]/40 border border-[#F5E500] flex items-center justify-center text-[#F5E500] shadow-[0_0_25px_rgba(245,229,0,0.6)]">
          <CheckCircle2 className="w-9 h-9" />
        </div>
      </div>

      {/* Header */}
      <div>
        <span className="text-[11px] font-mono font-bold tracking-widest text-[#F5E500] uppercase px-3 py-1 rounded-full bg-[#F5E500]/10 border border-[#F5E500]/30 inline-block mb-2">
          AUTHENTICATION CONFIRMED
        </span>
        <h2 className="text-2xl font-black font-mono tracking-tight text-white uppercase">
          ACCESS GRANTED
        </h2>
        <p className="text-xs font-mono text-[#C5D3E2] mt-1">
          Welcome back, <strong className="text-white">{user?.name || 'Fleet Operator'}</strong> (
          <span className="text-[#FBB931]">{user?.role || 'fleet_manager'}</span>)
        </p>
      </div>

      {/* System Initialization Checklist */}
      <div className="p-4 rounded-xl bg-[#0C182A]/80 border border-[#FFF0D5]/10 space-y-3 text-left">
        <p className="text-[10px] font-mono uppercase text-[#7D93A9] tracking-wider mb-2">
          System Initialization Sequence
        </p>
        {STEPS.map((step, idx) => {
          const stepNumber = idx + 1
          const isDone = initStep > stepNumber
          const isCurrent = initStep === stepNumber
          const Icon = step.icon

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 text-xs font-mono transition-opacity duration-300 ${
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-[#F5E500] font-semibold'
                  : 'text-[#7D93A9] opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 border ${
                  isDone
                    ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400'
                    : isCurrent
                    ? 'bg-[#F5E500]/20 border-[#F5E500] text-[#F5E500] animate-pulse'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="truncate">{step.label}</span>
            </div>
          )
        })}
      </div>

      {/* Transition Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono text-[#7D93A9]">
          <span>INITIALIZING COCKPIT HUD</span>
          <span className="text-[#F5E500]">{Math.min(100, Math.max(20, initStep * 25))}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-[#0C182A] overflow-hidden border border-[#FFF0D5]/10">
          <div
            className="h-full bg-gradient-to-r from-[#07518A] via-[#FBB931] to-[#F5E500] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(245,229,0,0.5)]"
            style={{ width: `${Math.min(100, Math.max(20, initStep * 25))}%` }}
          />
        </div>
      </div>
    </div>
  )
}
