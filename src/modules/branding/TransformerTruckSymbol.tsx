'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface TransformerTruckSymbolProps {
  className?: string
  size?: number | string
  isAnimated?: boolean
  glow?: boolean
  variant?: 'sunset' | 'amber' | 'blue' | 'white'
}

/**
 * FLEETVISION AI — ORIGINAL TRANSFORMER-INSPIRED TRUCK BRAND SYMBOL
 *
 * An original geometric emblem merging European heavy-duty cab-over-engine geometry
 * with futuristic robotic angularity:
 * - High-roof aerodynamic visor crown
 * - Dual geometric split-headlight matrix
 * - Symmetrical multi-tier trapezoidal intake grille
 * - Angular bumper chin with cybernetic tow-point nodes
 * - 100% original design (No copyrighted insignia)
 */
export const TransformerTruckSymbol: React.FC<TransformerTruckSymbolProps> = ({
  className = '',
  size = 28,
  isAnimated = false,
  glow = false,
  variant = 'sunset',
}) => {
  const colorMap = {
    sunset: {
      primary: '#EA6113',
      secondary: '#F88F22',
      accent: '#FBB931',
      dark: '#0C1E36',
      glow: 'rgba(234, 97, 19, 0.45)',
    },
    amber: {
      primary: '#FBB931',
      secondary: '#F88F22',
      accent: '#FFFFFF',
      dark: '#07518A',
      glow: 'rgba(251, 185, 49, 0.5)',
    },
    blue: {
      primary: '#07518A',
      secondary: '#1A73E8',
      accent: '#F88F22',
      dark: '#03080F',
      glow: 'rgba(7, 81, 138, 0.45)',
    },
    white: {
      primary: '#FFFFFF',
      secondary: '#FFE3B3',
      accent: '#EA6113',
      dark: '#0C1E36',
      glow: 'rgba(255, 255, 255, 0.5)',
    },
  }

  const c = colorMap[variant]

  const svgContent = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        filter: glow ? `drop-shadow(0 0 8px ${c.glow})` : undefined,
      }}
    >
      <defs>
        <linearGradient id={`fv-symbol-grad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.accent} />
          <stop offset="60%" stopColor={c.primary} />
          <stop offset="100%" stopColor={c.secondary} />
        </linearGradient>
      </defs>

      {/* 1. TOP AERODYNAMIC SUNVISOR / VISOR CROWN */}
      <path
        d="M12 8 L24 4 L36 8 L33 11 L15 11 Z"
        fill={`url(#fv-symbol-grad-${variant})`}
        stroke={c.accent}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* 2. CAB ROOF WINDSCREEN CORE (ANGULAR SHIELD) */}
      <path
        d="M14 12 L34 12 L31 20 L24 23 L17 20 Z"
        fill={c.dark}
        stroke={c.primary}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* WINDSCREEN HUD SCANNING DIVISION */}
      <line x1="24" y1="12" x2="24" y2="23" stroke={c.accent} strokeWidth="1" opacity="0.8" />

      {/* 3. SYMMETRICAL DUAL MATRIX HEADLIGHT PODS (LEFT & RIGHT) */}
      {/* Left Headlight Blade */}
      <polygon
        points="9,18 14,17 13,24 8,22"
        fill={c.accent}
        stroke={c.primary}
        strokeWidth="1"
      />
      {/* Right Headlight Blade */}
      <polygon
        points="39,18 34,17 35,24 40,22"
        fill={c.accent}
        stroke={c.primary}
        strokeWidth="1"
      />

      {/* 4. MECHANICAL TRAPEZOIDAL GRILLE (3 DISTINCT TIERS) */}
      {/* Grille Outer Armor Plate */}
      <path
        d="M15 24 L33 24 L30 36 L24 39 L18 36 Z"
        fill={c.dark}
        stroke={`url(#fv-symbol-grad-${variant})`}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Tier 1 Horizontal Louver */}
      <line x1="17" y1="27" x2="31" y2="27" stroke={c.primary} strokeWidth="1.4" strokeLinecap="round" />
      {/* Tier 2 Horizontal Louver */}
      <line x1="18.5" y1="31" x2="29.5" y2="31" stroke={c.secondary} strokeWidth="1.4" strokeLinecap="round" />
      {/* Tier 3 Horizontal Louver */}
      <line x1="20" y1="35" x2="28" y2="35" stroke={c.accent} strokeWidth="1.4" strokeLinecap="round" />

      {/* 5. HEAVY BUMPER CHIN & CORNER FLARES */}
      <path
        d="M6 26 L12 25 L14 36 L11 41 L5 38 Z"
        fill={c.primary}
        stroke={c.dark}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M42 26 L36 25 L34 36 L37 41 L43 38 Z"
        fill={c.primary}
        stroke={c.dark}
        strokeWidth="1"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* LOWER SKIDPLATE CHIN */}
      <polygon
        points="19,40 29,40 27,44 21,44"
        fill={c.accent}
        stroke={c.primary}
        strokeWidth="1"
      />
    </svg>
  )

  if (!isAnimated) {
    return svgContent
  }

  return (
    <motion.div
      whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
      transition={{ type: 'spring', stiffness: 350, damping: 18 }}
      className="inline-flex items-center justify-center shrink-0"
    >
      {svgContent}
    </motion.div>
  )
}
