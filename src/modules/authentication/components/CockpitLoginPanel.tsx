'use client'

import React, { useState } from 'react'
import {
  Truck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Gauge,
  Activity,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AccessGrantedSequence } from './AccessGrantedSequence'

export const CockpitLoginPanel: React.FC = () => {
  const { stage, initStep, errorMessage, user, login, resetError } = useAuth()
  const [email, setEmail] = useState('admin@fleetvision.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  // If authentication has succeeded, render the multi-stage Access Granted sequence
  if (stage === 'access_granted' || stage === 'system_initialization' || stage === 'transitioning') {
    return <AccessGrantedSequence user={user} initStep={initStep} />
  }

  const isSubmitting = stage === 'submitting'

  return (
    <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#070F1C]/90 backdrop-blur-2xl border border-[#FFF0D5]/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-white relative overflow-hidden">
      {/* Top Cyber Cockpit Ambient Accent Bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#07518A] via-[#F5E500] to-[#EA6113]" />

      {/* Cockpit Status Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#FFF0D5]/10 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#07518A]/30 border border-[#07518A] flex items-center justify-center text-[#F5E500]">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-mono font-bold tracking-widest text-[#FFF0D5] uppercase">
              FLEETVISION COCKPIT
            </h1>
            <p className="text-[10px] font-mono text-[#7D93A9]">SECURE AUTHENTICATION HUD</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#0C182A] border border-[#FFF0D5]/10 text-[10px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          GATEWAY ACTIVE
        </div>
      </div>

      {/* Main Title & Description */}
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Operator Sign In
        </h2>
        <p className="text-xs text-[#C5D3E2] mt-1">
          Authenticate with your fleet management credentials to access live telemetry and AI analytics.
        </p>
      </div>

      {/* Error Message Alert */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-200 text-xs font-mono flex items-start gap-2.5 animate-in fade-in duration-200"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">{errorMessage}</p>
            <p className="text-[10px] text-rose-300/80 mt-0.5">
              Default demo credentials: admin@fleetvision.com / password123
            </p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#C5D3E2] mb-1.5 tracking-wider">
            Fleet Account Identifier / Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D93A9]">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errorMessage) resetError()
              }}
              placeholder="operator@fleetvision.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0C182A] border border-[#FFF0D5]/15 text-white placeholder-[#7D93A9] text-xs font-mono focus:outline-none focus:border-[#F5E500] focus:ring-1 focus:ring-[#F5E500] transition-colors"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-mono uppercase text-[#C5D3E2] tracking-wider">
              Security Key / Password
            </label>
            <span className="text-[10px] font-mono text-[#FBB931]">Demo: password123</span>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7D93A9]">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (errorMessage) resetError()
              }}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#0C182A] border border-[#FFF0D5]/15 text-white placeholder-[#7D93A9] text-xs font-mono focus:outline-none focus:border-[#F5E500] focus:ring-1 focus:ring-[#F5E500] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide security key' : 'Show security key'}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7D93A9] hover:text-white transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Action Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider text-black bg-[#F5E500] hover:bg-[#FFE3B3] disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(245,229,0,0.4)] transition-all flex items-center justify-center gap-2 group"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-black" />
              <span>Verifying Fleet Credentials...</span>
            </>
          ) : (
            <>
              <span>Engage System Access</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      {/* Cockpit Diagnostics Footnote */}
      <div className="mt-6 pt-4 border-t border-[#FFF0D5]/10 flex items-center justify-between text-[10px] font-mono text-[#7D93A9]">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#07518A]" />
          SSL / CAN-Bus 256-Bit
        </span>
        <span className="text-[#C5D3E2]">Volvo FH16 System Linked</span>
      </div>
    </div>
  )
}
