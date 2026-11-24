'use client'

import React from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Terminal,
  Activity,
  LucideIcon,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ModulePlaceholderProps {
  title: string
  subtitle: string
  section: string
  icon: LucideIcon
  subphaseBadge: string
  statusNote?: string
  highlights?: { label: string; value: string; detail?: string }[]
  actions?: { label: string; href: string; primary?: boolean }[]
}

export const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({
  title,
  subtitle,
  section,
  icon: Icon,
  subphaseBadge,
  statusNote = 'Module architecture verified. Real-time data pipeline connected to FleetVision core.',
  highlights = [
    { label: 'Security Context', value: 'Fleet Operator Tier-1', detail: 'Encrypted token session' },
    { label: 'Data Gateway', value: 'REST / Telemetry v2', detail: 'Active backend channel' },
    { label: 'AI Readiness', value: 'Operational', detail: 'Inference endpoints mapped' },
  ],
  actions = [
    { label: 'Return to Executive Dashboard', href: '/dashboard', primary: true },
    { label: 'Launch 360° Vehicle Explorer', href: '/vehicles/explorer' },
  ],
}) => {
  return (
    <div className="space-y-6 select-none font-sans">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E5DFD7] pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] mb-1">
            <span>OPERATIONS</span>
            <ChevronRight className="w-3 h-3 text-[#E5DFD7]" />
            <span className="text-[#EA6113] uppercase font-bold">{section}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border border-[#3E4452] flex items-center justify-center text-white shadow-md shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black font-inter text-[#07518A] tracking-tight">
                {title}
              </h1>
              <p className="text-xs text-[#64748B] font-mono">{subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFF5EC] text-[#EA6113] border border-[#f7801b]/30">
            {subphaseBadge}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-700 border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            LIVE LINKED
          </span>
        </div>
      </div>

      {/* Main Content Hero Card */}
      <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 lg:p-8 relative overflow-hidden shadow-xs text-[#0C1E36]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F7801B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#07518A] font-bold">
            <Activity className="w-3.5 h-3.5 text-[#EA6113]" />
            <span>FLEETVISION ENTERPRISE ARCHITECTURE · 2026 EDITION</span>
          </div>

          <h2 className="text-lg sm:text-xl font-bold font-inter text-[#07518A]">
            {title} Control Surface
          </h2>
          <p className="text-sm text-[#475569] font-sans leading-relaxed">
            {statusNote}
          </p>

          {/* Quick Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            {highlights.map((h, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl border border-[#E5DFD7] bg-[#FFF5EC] font-mono"
              >
                <p className="text-[10px] uppercase text-[#64748B] tracking-wider mb-1 font-bold">{h.label}</p>
                <p className="text-sm font-bold text-[#07518A]">{h.value}</p>
                {h.detail && (
                  <p className="text-[10px] text-[#EA6113] mt-0.5 font-semibold">{h.detail}</p>
                )}
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 flex flex-wrap items-center gap-3">
            {actions.map((act, i) => (
              <Link key={i} href={act.href}>
                <Button
                  className={`font-mono text-xs px-4 py-2 rounded-xl transition-all ${
                    act.primary
                      ? 'bg-gradient-to-r from-[#f7801b] to-[#d33e1b] hover:from-[#d33e1b] hover:to-[#b83214] text-white font-bold shadow-md shadow-[#f7801b]/30'
                      : 'bg-white hover:bg-[#FFF5EC] text-[#0C1E36] border border-[#E5DFD7] shadow-xs'
                  }`}
                >
                  {act.label}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
