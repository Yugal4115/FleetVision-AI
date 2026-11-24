import React from 'react'

interface DemoBadgeProps {
  label?: string
  className?: string
  variant?: 'banner' | 'pill' | 'subtle'
}

/**
 * MANDATORY REQUIREMENT:
 * Graphite HUD Diagnostic Indicator
 */
export const DemoBadge: React.FC<DemoBadgeProps> = ({
  label = 'TELEMATICS ACTIVE',
  className = '',
  variant = 'pill',
}) => {
  if (variant === 'banner') {
    return (
      <aside
        aria-label="Simulation Mode Banner"
        className={`w-full py-2.5 px-5 bg-white/95 backdrop-blur-xl border border-[#E5DFD7] text-[#0C1E36] flex items-center justify-between text-xs tracking-wider font-mono rounded-2xl shadow-xs ${className}`}
      >
        <div className="flex items-center gap-2.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#EA6113] animate-pulse shadow-[0_0_8px_rgba(234,97,19,0.5)]" />
          <span className="font-bold text-[#07518A]">{label}</span>
          <span className="text-[#64748B] hidden sm:inline text-[11px]">
            — Autonomous J1939 CAN-Bus Telemetry Stream Connected
          </span>
        </div>
        <span className="text-[10px] text-[#EA6113] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FFF5EC] border border-[#f7801b]/30">
          LIVE FEED
        </span>
      </aside>
    )
  }

  if (variant === 'subtle') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium tracking-tight bg-[#FFF5EC] text-[#0C1E36] border border-[#E5DFD7] shadow-xs ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#EA6113] shadow-[0_0_6px_rgba(234,97,19,0.5)]" />
        {label}
      </span>
    )
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide bg-gradient-to-r from-[#2D3139] via-[#1E2128] to-[#101216] text-[#F3F4F6] border border-[#4B5563]/60 shadow-[0_0_12px_rgba(0,0,0,0.5)] ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
      {label}
    </span>
  )
}
