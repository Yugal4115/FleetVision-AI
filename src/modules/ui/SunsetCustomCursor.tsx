'use client'

import React, { useEffect, useState, useRef } from 'react'
import { TransformerTruckSymbol } from '../branding/TransformerTruckSymbol'

/**
 * FLEETVISION AI — PREMIUM SUNSET CUSTOM CURSOR
 *
 * Rules Compliance:
 * - Circular cursor with warm sunset orange ring and soft golden/peach glow
 * - Embedded original futuristic truck-front emblem in center
 * - High-precision requestAnimationFrame interpolation with fluid trailing physics
 * - pointer-events: none (never interferes with clicks or interactions)
 * - Changes subtly when hovering over links/buttons
 * - Restrained click compression feedback
 * - Auto-disabled on touch devices (@media (pointer: coarse))
 * - Respects prefers-reduced-motion
 * - Native caret preserved inside text inputs
 */
export const SunsetCustomCursor: React.FC = () => {
  const [enabled, setEnabled] = useState(false)
  const [visible, setVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isInputHovered, setIsInputHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  // Mouse coords and smooth trailing position
  const mousePos = useRef({ x: -100, y: -100 })
  const cursorPos = useRef({ x: -100, y: -100 })
  const cursorRef = useRef<HTMLDivElement>(null)
  const animFrameId = useRef<number | null>(null)

  useEffect(() => {
    // Only enable on desktop with fine pointer and no reduced-motion preference
    if (typeof window === 'undefined') return

    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!finePointer || reducedMotion) {
      setEnabled(false)
      return
    }

    setEnabled(true)

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
      if (!visible) setVisible(true)

      // Check hover target
      const target = e.target as HTMLElement | null
      if (target) {
        const isClickable = Boolean(
          target.closest('button') ||
            target.closest('a') ||
            target.closest('[role="button"]') ||
            target.closest('[role="tab"]') ||
            target.closest('summary') ||
            target.closest('.cursor-pointer')
        )
        const isTextInput = Boolean(
          target.closest('input') || target.closest('textarea') || target.isContentEditable
        )

        setIsHovered(isClickable && !isTextInput)
        setIsInputHovered(isTextInput)
      }
    }

    const handleMouseDown = () => setIsClicked(true)
    const handleMouseUp = () => setIsClicked(false)

    const handleMouseLeave = () => setVisible(false)
    const handleMouseEnter = () => setVisible(true)

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // Smooth physics loop
    const springLerp = 0.22

    const render = () => {
      cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) * springLerp
      cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) * springLerp

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`
      }

      animFrameId.current = requestAnimationFrame(render)
    }

    animFrameId.current = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current)
    }
  }, [visible])

  if (!enabled) return null

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-200 select-none ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-100px, -100px, 0)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    >
      {/* Outer Sunset Halo & Ring */}
      <div
        className={`relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-200 ease-out ${
          isInputHovered
            ? 'w-5 h-5 opacity-40 border border-[#EA6113]/40'
            : isHovered
            ? 'w-10 h-10 border-2 border-[#EA6113] bg-[#EA6113]/10 shadow-[0_0_16px_rgba(234,97,19,0.55)] scale-110'
            : isClicked
            ? 'w-7 h-7 border-2 border-[#FBB931] bg-[#EA6113]/25 shadow-[0_0_12px_rgba(251,185,49,0.7)] scale-90'
            : 'w-8 h-8 border border-[#EA6113]/80 bg-[#FFF1E6]/25 shadow-[0_0_10px_rgba(248,143,34,0.35)]'
        } rounded-full backdrop-blur-[1px]`}
      >
        {/* Center Mini Transformer Truck Emblem (hidden over text inputs to preserve native caret) */}
        {!isInputHovered && (
          <div
            className={`transition-transform duration-150 ${
              isHovered ? 'scale-115 rotate-2' : isClicked ? 'scale-75' : 'scale-100'
            }`}
          >
            <TransformerTruckSymbol
              size={isHovered ? 16 : 13}
              variant={isClicked ? 'amber' : 'sunset'}
              glow={isHovered}
            />
          </div>
        )}

        {/* Precision Center Aim Dot */}
        <div
          className={`absolute w-1 h-1 rounded-full bg-[#EA6113] transition-transform ${
            isInputHovered ? 'opacity-0' : 'opacity-80'
          }`}
        />
      </div>
    </div>
  )
}
