'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Activity,
  Cpu,
  Sparkles,
  KeyRound,
  UserPlus,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthActionButton } from './AuthActionButton'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

const INIT_STEPS = [
  { label: 'Establishing encrypted gateway session token (SHA-256)', icon: ShieldCheck },
  { label: 'Loading authorized fleet roster & driver profiles', icon: Activity },
  { label: 'Synchronizing 100 Hz CAN-Bus 2.0B powertrain telemetry', icon: Zap },
  { label: 'Calibrating Optimus AI Autonomous Copilot HUD', icon: Cpu },
]

export function EuroTruckLiveLogin() {
  const { stage, initStep, errorMessage, user, login, resetError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  const isSubmitting = stage === 'submitting'
  const isEmailValid = email.includes('@') && email.length > 5
  const isAuthenticating =
    stage === 'access_granted' || stage === 'system_initialization' || stage === 'transitioning'
  const isTransitioning = stage === 'transitioning'

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none bg-[#03080F]">
      {/* ============================================================== */}
      {/* 1. 4K LIVE EURO TRUCK BACKGROUND CANVAS WITH CINEMATIC ENTRANCE */}
      {/* ============================================================== */}
      <motion.div
        initial={{ scale: 1.15, opacity: 0, filter: 'blur(12px)' }}
        animate={{
          scale: isTransitioning ? 1.25 : 1.04,
          opacity: 1,
          filter: isTransitioning
            ? 'blur(6px) brightness(1.3)'
            : 'blur(0px) brightness(0.72)',
        }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        {/* 4K Volvo FH16 Flagship Truck Image with Cinematic Motion */}
        <img
          src="/assets/login/volvo-fh16-login-reference.png"
          alt="Euro Truck 4K Live Alpine Mountain Haul"
          className="w-full h-full object-cover object-center contrast-115 animate-truck-live pointer-events-none"
        />

        {/* Ambient Sunset Vignette & Depth Fog */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080F]/90 via-[#070F1C]/40 to-[#07518A]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(3,8,15,0.75)_100%)]" />

        {/* Moving Cybernetic Telemetry Scanning Line */}
        <div className="absolute inset-x-0 h-24 bg-gradient-to-b from-transparent via-[#f7801b]/15 to-transparent pointer-events-none animate-hud-scan" />

        {/* Subtle Cybernetic Telemetry Grid Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#f7801b_0.75px,transparent_0.75px)] [background-size:28px_28px] opacity-15 pointer-events-none" />
      </motion.div>

      {/* Top Floating Utility Bar with Smooth Slide-down Entrance */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto"
      >
        <Link
          href="/"
          className="py-2 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 text-xs font-manrope font-semibold group shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>FleetVision Public Portal</span>
        </Link>

        {/* Live System Online Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#03080F]/80 border border-[#f7801b]/40 backdrop-blur-md text-[11px] font-mono text-[#fba41c]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="tracking-widest uppercase">CAN-BUS GATEWAY: ENCRYPTED</span>
        </div>
      </motion.header>

      {/* ============================================================== */}
      {/* 2. IXDF CINEMATIC CARD WITH DUAL-STAGE TRANSFORMATION          */}
      {/* ============================================================== */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-4xl bg-[#FFFDFB]/98 backdrop-blur-2xl rounded-[32px] sm:rounded-[36px] border border-[#bf7e4d]/30 shadow-2xl shadow-black/60 overflow-hidden flex flex-col md:flex-row min-h-[580px] pointer-events-auto"
      >
        {/* ============================================================ */}
        {/* LEFT / TOP: ARTISTIC CALLIGRAPHY & LIVE SUNSET PANORAMA      */}
        {/* ============================================================ */}
        <div className="relative md:w-5/12 bg-gradient-to-br from-[#07518A] via-[#0C1E36] to-[#03080F] p-8 sm:p-10 flex flex-col justify-between overflow-hidden text-white">
          {/* Subtle Cyber Grid Inside Panel */}
          <div className="absolute inset-0 bg-[radial-gradient(#EA6113_1px,transparent_1px)] [background-size:20px_20px] opacity-20 pointer-events-none" />

          {/* Top Brand Tag */}
          <div className="relative z-10 flex items-center gap-2.5">
            <TransformerTruckSymbol size={28} variant="white" glow={true} />
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-[#FBB931] uppercase block">
                FLEETVISION AI
              </span>
              <span className="text-[10px] text-white/70 font-mono tracking-wider">
                SECURITY GATEWAY 2.4
              </span>
            </div>
          </div>

          {/* Big Artistic Welcome Headline */}
          <div className="relative z-10 my-8 sm:my-auto">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="font-inter font-extrabold text-4xl sm:text-5xl text-white tracking-tight leading-tight"
            >
              Control <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F88F22] to-[#FBB931]">
                Intelligence.
              </span>
            </motion.h1>

            <p className="mt-4 text-xs sm:text-sm font-manrope font-normal text-white/80 leading-relaxed max-w-xs">
              Access real-time Euro-haul telemetry, multi-unit dispatch, driver safety radars, and autonomous diagnostics.
            </p>
          </div>

          {/* Bottom Security Notice */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/60">
            <span>256-Bit SSL Enforced</span>
            <span className="text-[#FBB931]">Server Verified</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RIGHT: AUTHENTICATION FORM / COCKPIT INITIALIZATION STAGE     */}
        {/* ============================================================ */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white relative">
          <AnimatePresence mode="wait">
            {!isAuthenticating ? (
              <motion.div
                key="login-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFF1E6] border border-[#EA6113]/30 text-[#EA6113] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    AUTHENTICATED ENTERPRISE PORTAL
                  </div>
                  <h2 className="font-inter font-bold text-2xl text-[#0C1E36]">
                    Sign In to Fleet Console
                  </h2>
                  <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1">
                    Enter your registered operator email and secure passphrase.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-manrope flex items-start gap-2.5"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold">{errorMessage}</p>
                      {errorMessage.includes('verified') && (
                        <Link
                          href={`/verify-email?email=${encodeURIComponent(email)}`}
                          className="mt-1.5 inline-block text-[11px] font-bold text-[#EA6113] hover:underline"
                        >
                          Verify Account Email Now →
                        </Link>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Sign In Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value)
                          if (errorMessage) resetError()
                        }}
                        placeholder="operator@fleetvision.com"
                        className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                      />
                      {isEmailValid && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>

                  {/* Password Field with Forgot Link */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                        Security Password
                      </label>
                      <Link
                        href="/forgot-password"
                        className="text-[11px] font-manrope font-semibold text-[#EA6113] hover:text-[#07518A] hover:underline"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          if (errorMessage) resetError()
                        }}
                        placeholder="••••••••••••"
                        className="w-full h-12 pl-10 pr-10 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0C1E36]/50 hover:text-[#0C1E36] transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Premium Animated Auth Button */}
                  <div className="pt-2">
                    <AuthActionButton
                      type="submit"
                      label="SIGN IN"
                      loading={isSubmitting}
                      loadingText="AUTHENTICATING CREDENTIALS..."
                      variant="sunset"
                    />
                  </div>
                </form>

                {/* Footer Navigation to Registration */}
                <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-manrope text-[#0C1E36]/70">
                  <span>Need an enterprise account?</span>
                  <Link
                    href="/register"
                    className="font-bold text-[#EA6113] hover:text-[#07518A] flex items-center gap-1 group"
                  >
                    <span>Register Organisation</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ) : (
              /* ======================================================= */
              /* STATE B: COCKPIT ACCESS GRANTED & INITIALIZATION HUD   */
              /* ======================================================= */
              <motion.div
                key="cockpit-hud"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="space-y-6 flex flex-col justify-between py-2"
              >
                {/* Header with Transformer Symbol */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#EA6113] to-[#FBB931] flex items-center justify-center shadow-lg shadow-[#EA6113]/30 shrink-0">
                    <TransformerTruckSymbol size={34} variant="white" isAnimated={true} glow={true} />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ACCESS GRANTED
                    </div>
                    <h3 className="font-inter font-bold text-xl text-[#0C1E36]">
                      Welcome, {user?.name || 'Operator'}
                    </h3>
                    <p className="text-xs font-mono text-[#07518A] uppercase">
                      ROLE: {user?.role || 'FLEET_MANAGER'} · SESSION VERIFIED
                    </p>
                  </div>
                </div>

                {/* Stepwise Telemetry Initialization Indicators */}
                <div className="space-y-2.5 bg-[#FAFAF9] p-4 rounded-2xl border border-[#E5DFD7]">
                  <p className="text-[10px] font-mono uppercase text-[#0C1E36]/60 tracking-wider">
                    SYSTEM INITIALIZATION SEQUENCE
                  </p>
                  {INIT_STEPS.map((step, idx) => {
                    const StepIcon = step.icon
                    const isDone = initStep > idx
                    const isCurrent = initStep === idx

                    return (
                      <div
                        key={idx}
                        className={`flex items-center gap-3 p-2 rounded-xl text-xs font-mono transition-all duration-300 ${
                          isDone
                            ? 'text-emerald-700 bg-emerald-50/60 font-semibold'
                            : isCurrent
                            ? 'text-[#EA6113] bg-[#FFF1E6] font-bold border border-[#EA6113]/30'
                            : 'text-[#0C1E36]/40 opacity-50'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : isCurrent ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#EA6113] shrink-0" />
                        ) : (
                          <StepIcon className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span className="truncate">{step.label}</span>
                      </div>
                    )
                  })}
                </div>

                <div className="text-center pt-2">
                  <p className="text-[11px] font-mono text-[#EA6113] animate-pulse">
                    Launching Fleet Command Center...
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
