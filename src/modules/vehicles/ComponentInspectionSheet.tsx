'use client'

import React from 'react'
import {
  X,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Activity,
  Wrench,
  CheckCircle2,
  Calendar,
  Gauge,
  Zap,
} from 'lucide-react'
import { IComponentHotspot } from './types'
import { DemoBadge } from '@/design-system/DemoBadge'

interface ComponentInspectionSheetProps {
  hotspot: IComponentHotspot | null
  onClose: () => void
}

export const ComponentInspectionSheet: React.FC<ComponentInspectionSheetProps> = ({
  hotspot,
  onClose,
}) => {
  if (!hotspot) return null

  const getConditionBadge = (cond: string) => {
    switch (cond) {
      case 'optimal':
        return 'text-emerald-700 bg-emerald-50 border-emerald-300'
      case 'good':
        return 'text-[#07518A] bg-[#FFF1E6] border-[#FFE3B3]'
      case 'attention_required':
        return 'text-[#EA6113] bg-orange-50 border-orange-200'
      case 'critical':
        return 'text-rose-700 bg-rose-50 border-rose-200'
      default:
        return 'text-[#07518A] bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Component Diagnostics: ${hotspot.name}`}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg bg-white/95 backdrop-blur-xl border-l border-[#E5DFD7] shadow-2xl flex flex-col text-[#0C1E36] animate-in slide-in-from-right duration-300"
    >
      {/* Header */}
      <div className="p-6 border-b border-[#E5DFD7] flex items-start justify-between bg-[#FAFAF9]">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase border ${getConditionBadge(
                hotspot.condition
              )}`}
            >
              {hotspot.condition.replace('_', ' ')}
            </span>
            <span className="text-[11px] font-mono font-bold text-[#07518A] bg-[#FFF1E6] px-2 py-0.5 rounded border border-[#FFE3B3]">
              {hotspot.category.toUpperCase()}
            </span>
            <DemoBadge label="COMPONENT TELEMETRY" />
          </div>
          <h2 className="text-xl font-bold font-sans text-[#07518A]">
            {hotspot.name}
          </h2>
          <p className="text-xs font-mono text-[#64748B] mt-0.5">
            Component Identifier: {hotspot.id}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-[#64748B] hover:text-[#07518A] hover:bg-white transition-colors border border-transparent hover:border-[#E5DFD7]"
          aria-label="Close component diagnostics"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description Card */}
        <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
          <p className="text-xs text-[#64748B] font-mono uppercase tracking-wider mb-1">
            System Function & Architecture
          </p>
          <p className="text-sm text-[#0C1E36] leading-relaxed font-sans">
            {hotspot.description}
          </p>
        </div>

        {/* Live Specifications Grid */}
        <div>
          <h3 className="text-xs font-mono font-bold text-[#07518A] uppercase tracking-wider mb-3">
            Hardware Parameters & Specifications
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(hotspot.specs).map(([key, rawVal]) => {
              const val = rawVal as any
              const displayLabel =
                typeof val === 'object' && val !== null && val.label
                  ? val.label
                  : key.replace(/([A-Z])/g, ' $1')
              const displayValue =
                typeof val === 'object' && val !== null
                  ? `${val.value ?? ''} ${val.unit ?? ''}`.trim()
                  : String(val)

              return (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-white border border-[#E5DFD7] shadow-2xs"
                >
                  <p className="text-[10px] font-mono uppercase text-[#64748B] truncate">
                    {displayLabel}
                  </p>
                  <p className="text-xs sm:text-sm font-bold font-mono text-[#07518A] truncate mt-0.5">
                    {displayValue || 'N/A'}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Maintenance Lifecycle Card */}
        <div className="p-4 rounded-2xl bg-[#FFF1E6]/40 border border-[#FFE3B3] space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#EA6113] uppercase">
            <Clock className="w-4 h-4" />
            <span>Inspection & Service Log</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase">Last Verified Service</span>
              <span className="font-bold text-[#0C1E36]">{(hotspot as any).lastInspected || 'Recent Service'}</span>
            </div>
            <div>
              <span className="text-[#64748B] block text-[10px] uppercase">Next Scheduled Service</span>
              <span className="font-bold text-[#07518A]">{(hotspot as any).nextServiceDue || (hotspot as any).nextServiceDueKm || '10,000 km'}</span>
            </div>
          </div>
        </div>

        {/* Health Index Bar */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5DFD7] space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-[#07518A]">COMPONENT RELIABILITY INDEX</span>
            <span className="font-bold text-[#EA6113]">
              {hotspot.condition === 'optimal'
                ? '98.5%'
                : hotspot.condition === 'good'
                ? '91.0%'
                : '78.2%'}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#FAFAF9] border border-[#E5DFD7] overflow-hidden">
            <div
              className={`h-full rounded-full ${
                hotspot.condition === 'optimal'
                  ? 'bg-emerald-500 w-[98%]'
                  : hotspot.condition === 'good'
                  ? 'bg-[#FBB931] w-[91%]'
                  : 'bg-[#EA6113] w-[78%]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#E5DFD7] bg-[#FAFAF9] flex items-center justify-between text-xs font-mono">
        <span className="text-[#64748B]">Telemetry Source: CAN 2.0B</span>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-[#07518A] hover:bg-[#0C1E36] text-white font-bold transition-colors"
        >
          Close Diagnostics
        </button>
      </div>
    </div>
  )
}
