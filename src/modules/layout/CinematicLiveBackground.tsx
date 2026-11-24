'use client'

import React, { memo } from 'react'

/**
 * FLEETVISION AI — LIGHT LIVE SUNSET ORANGE AMBIENT BACKDROP
 * Aligned with the public portal visual identity:
 * - Clean pearl & alabaster canvas (#FAFAF9 / #FFF8F2)
 * - Living volumetric breathing sunset orange & golden amber plasma orbs
 * - Anamorphic sunset horizon flare band
 * - Subtle warm sandstone & copper telemetry grid
 * - Floating golden amber ember nodes
 * - Gentle sunset HUD scanline sweep
 * - Soft perimeter vignette
 */
export const CinematicLiveBackground = memo(function CinematicLiveBackground() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#FAFAF9]"
    >
      {/* 1. Base Alabaster to Warm Sunset Peach Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FFF5EC] via-[#FFFDFB] to-[#FAFAF9]" />

      {/* 2. Primary Breathing Sunset Orange Orb (Top-Left) */}
      <div
        className="absolute -top-[12%] -left-[10%] w-[68vw] h-[68vw] max-w-[950px] max-h-[950px] rounded-full bg-gradient-to-br from-[#F7801B]/20 via-[#EA6113]/12 to-transparent blur-[125px] animate-sunset-drift"
        style={{ willChange: 'transform, opacity' }}
      />

      {/* 3. Golden Hour Amber Sun Halo (Top-Right) */}
      <div
        className="absolute -top-[8%] -right-[12%] w-[62vw] h-[62vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-bl from-[#FCB234]/25 via-[#FBA41C]/15 to-transparent blur-[135px] animate-sunset-vibe"
        style={{ willChange: 'transform, opacity', animationDelay: '-3.5s' }}
      />

      {/* 4. Warm Peach & Magma Center Glow (Behind Main KPI Deck) */}
      <div
        className="absolute top-[32%] left-[15%] w-[60vw] h-[50vw] max-w-[850px] max-h-[700px] rounded-full bg-gradient-to-tr from-[#FFF1E6]/90 via-[#F7801B]/12 to-transparent blur-[130px] animate-sunset-drift"
        style={{ willChange: 'transform, opacity', animationDelay: '-7s' }}
      />

      {/* 5. Anamorphic Sunset Horizon Flare Band */}
      <div
        className="absolute top-[48%] inset-x-0 h-[260px] -translate-y-1/2 opacity-60 blur-3xl pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 45% at 50% 50%, rgba(247, 128, 27, 0.16) 0%, rgba(254, 237, 222, 0.6) 45%, rgba(251, 185, 49, 0.08) 75%, transparent 100%)',
        }}
      />

      {/* 6. Subtle Warm Sandstone / Copper Telemetry Grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(234, 97, 19, 0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(234, 97, 19, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 95% 85% at 50% 35%, black 40%, transparent 95%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 95% 85% at 50% 35%, black 40%, transparent 95%)',
        }}
      />

      {/* 7. Holographic Sunset Orange HUD Scanline Sweep */}
      <div className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-[#F7801B]/10 to-transparent animate-hud-scan" />

      {/* 8. Floating Golden Ember Constellation Nodes */}
      <div className="absolute inset-0">
        <span
          className="absolute top-[16%] left-[14%] w-2 h-2 rounded-full bg-[#EA6113] shadow-[0_0_10px_#EA6113] animate-pulse"
          style={{ animationDuration: '3.2s' }}
        />
        <span
          className="absolute top-[28%] right-[16%] w-1.5 h-1.5 rounded-full bg-[#FCB234] shadow-[0_0_8px_#FCB234] animate-pulse"
          style={{ animationDuration: '4.5s', animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-[52%] left-[9%] w-1.5 h-1.5 rounded-full bg-[#F7801B] shadow-[0_0_8px_#F7801B] animate-pulse"
          style={{ animationDuration: '2.8s', animationDelay: '0.6s' }}
        />
        <span
          className="absolute top-[68%] right-[22%] w-2 h-2 rounded-full bg-[#FBA41C] shadow-[0_0_10px_#FBA41C] animate-pulse"
          style={{ animationDuration: '5.1s', animationDelay: '2.4s' }}
        />
        <span
          className="absolute top-[82%] left-[34%] w-1.5 h-1.5 rounded-full bg-[#EA6113] shadow-[0_0_8px_#EA6113] animate-pulse"
          style={{ animationDuration: '3.9s', animationDelay: '1.8s' }}
        />
      </div>

      {/* 9. Soft Perimeter Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(250,250,249,0.35)_80%,rgba(250,250,249,0.85)_100%)] pointer-events-none" />
    </div>
  )
})
