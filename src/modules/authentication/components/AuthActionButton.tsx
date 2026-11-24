'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

interface AuthActionButtonProps {
  type?: 'submit' | 'button'
  label: string
  loading?: boolean
  loadingText?: string
  success?: boolean
  error?: boolean
  disabled?: boolean
  onClick?: () => void
  variant?: 'sunset' | 'secondary' | 'outline'
  className?: string
  iconPosition?: 'left' | 'right'
}

/**
 * FLEETVISION AI — ANIMATED AUTHENTICATION BUTTON
 *
 * Rules Compliance:
 * - Features the original Transformer-inspired European truck symbol
 * - Subtle mechanical alignment animation on hover
 * - Smooth spring-based micro-interactions
 * - High-contrast automotive Sunset & White palette
 * - Clear loading, success, and error feedback states
 */
export const AuthActionButton: React.FC<AuthActionButtonProps> = ({
  type = 'submit',
  label,
  loading = false,
  loadingText,
  success = false,
  error = false,
  disabled = false,
  onClick,
  variant = 'sunset',
  className = '',
  iconPosition = 'left',
}) => {
  const isDisabled = disabled || loading || success

  const baseStyles =
    'relative w-full py-3.5 px-6 rounded-xl font-manrope font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-3 select-none overflow-hidden group shadow-md'

  const variantStyles = {
    sunset:
      'bg-gradient-to-r from-[#EA6113] via-[#F88F22] to-[#EA6113] text-white border border-[#FBB931]/40 hover:shadow-[0_4px_20px_rgba(234,97,19,0.4)] active:scale-[0.99]',
    secondary:
      'bg-[#0C1E36] text-white border border-[#07518A]/50 hover:bg-[#122A4A] hover:shadow-[0_4px_16px_rgba(12,30,54,0.3)] active:scale-[0.99]',
    outline:
      'bg-white/80 text-[#0C1E36] border border-[#E5DFD7] hover:bg-white hover:border-[#EA6113] active:scale-[0.99]',
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.015 } : undefined}
      whileTap={!isDisabled ? { scale: 0.985 } : undefined}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`${baseStyles} ${variantStyles[variant]} ${
        isDisabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {/* Dynamic Sheen Sweep on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

      {/* State 1: Loading */}
      {loading && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>{loadingText || 'AUTHENTICATING...'}</span>
        </div>
      )}

      {/* State 2: Success */}
      {!loading && success && (
        <div className="flex items-center gap-2 text-emerald-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>ACCESS VERIFIED</span>
        </div>
      )}

      {/* State 3: Error */}
      {!loading && error && (
        <div className="flex items-center gap-2 text-rose-200">
          <AlertCircle className="w-4 h-4" />
          <span>FAILED · RETRY</span>
        </div>
      )}

      {/* State 4: Normal Action Display */}
      {!loading && !success && !error && (
        <>
          {iconPosition === 'left' && (
            <motion.div
              className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:rotate-1"
            >
              <TransformerTruckSymbol
                size={20}
                variant={variant === 'outline' ? 'sunset' : 'white'}
                glow={true}
              />
            </motion.div>
          )}

          <span className="font-extrabold tracking-wider">{label}</span>

          {iconPosition === 'right' && (
            <motion.div
              className="shrink-0 transition-transform duration-300 group-hover:scale-115 group-hover:-rotate-1"
            >
              <TransformerTruckSymbol
                size={20}
                variant={variant === 'outline' ? 'sunset' : 'white'}
                glow={true}
              />
            </motion.div>
          )}
        </>
      )}
    </motion.button>
  )
}
