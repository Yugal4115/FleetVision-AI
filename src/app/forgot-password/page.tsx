'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { AuthActionButton } from '@/modules/authentication/components/AuthActionButton'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email?.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid registered email address.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Request failed. Please try again.')
        setLoading(false)
        return
      }

      setFeedback(data)
    } catch (err) {
      console.error('Forgot password error:', err)
      setErrorMessage('Gateway connection failed. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden select-none bg-[#03080F]">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/assets/login/volvo-fh16-login-reference.png"
          alt="Fleet Background"
          className="w-full h-full object-cover object-center filter blur-xs brightness-60 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080F]/95 via-[#0C1E36]/70 to-[#07518A]/35" />
      </div>

      {/* Top Header */}
      <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        <Link
          href="/login"
          className="py-2 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 text-xs font-manrope font-semibold group shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-20 w-full max-w-xl bg-white rounded-[32px] border border-[#bf7e4d]/30 shadow-2xl p-8 sm:p-10 pointer-events-auto"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#EA6113] to-[#FBB931] flex items-center justify-center mx-auto shadow-md shadow-[#EA6113]/30">
            <TransformerTruckSymbol size={30} variant="white" glow={true} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF1E6] text-[#EA6113] text-[10px] font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            SECURE CREDENTIAL RECOVERY
          </div>
          <h1 className="font-inter font-bold text-2xl text-[#0C1E36]">
            Reset Account Password
          </h1>
          <p className="text-xs font-manrope text-[#0C1E36]/70 max-w-sm mx-auto">
            Enter your work email address to receive a secure, one-time cryptographically hashed reset link.
          </p>
        </div>

        {feedback ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 text-center py-2"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-inter font-bold text-xl text-[#0C1E36]">
                Reset Instructions Prepared
              </h3>
              <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1">
                {feedback.message}
              </p>
            </div>

            {feedback.reset?.notice && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs font-manrope text-amber-900 space-y-1">
                <p className="font-semibold text-amber-950">Email Service Notice</p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {feedback.reset.notice}
                </p>
                {feedback.reset?.token && (
                  <div className="mt-2 pt-2 border-t border-amber-200/70 font-mono text-[10px] text-amber-950">
                    <span>Generated One-Time Reset Token: </span>
                    <span className="font-bold select-all bg-amber-200/60 px-1.5 py-0.5 rounded">
                      {feedback.reset.token}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <Link
                href={
                  feedback.reset?.actionUrl ||
                  `/reset-password?email=${encodeURIComponent(email)}`
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#EA6113] hover:bg-[#F88F22] text-white font-manrope font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              >
                <span>Proceed to Reset Password</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-manrope flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@fleetvision.com"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <AuthActionButton
                type="submit"
                label="RESET PASSWORD"
                loading={loading}
                loadingText="ISSUING RECOVERY TOKEN..."
                variant="sunset"
              />
            </div>

            <div className="pt-3 border-t border-[#E5DFD7] text-center text-xs font-manrope text-[#0C1E36]/70">
              <span>Remembered credentials? </span>
              <Link href="/login" className="font-bold text-[#EA6113] hover:underline">
                Sign In
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
