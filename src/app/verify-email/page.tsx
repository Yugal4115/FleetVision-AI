'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CheckCircle2,
  AlertCircle,
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { AuthActionButton } from '@/modules/authentication/components/AuthActionButton'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const initialToken = searchParams.get('token') || ''

  const [email, setEmail] = useState(initialEmail)
  const [token, setToken] = useState(initialToken)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [resendNotice, setResendNotice] = useState<string | null>(null)

  // Auto-verify if both token and email are in query parameters
  useEffect(() => {
    if (initialToken && initialEmail) {
      handleVerify(initialToken, initialEmail)
    }
  }, [initialToken, initialEmail])

  const handleVerify = async (tokenToVerify?: string, emailToVerify?: string) => {
    const activeToken = tokenToVerify || token
    const activeEmail = emailToVerify || email

    if (!activeEmail?.trim()) {
      setErrorMessage('Please enter your registered email address.')
      return
    }

    if (!activeToken?.trim()) {
      setErrorMessage('Please enter the 64-character verification token.')
      return
    }

    setErrorMessage(null)
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: activeToken.trim(),
          email: activeEmail.trim().toLowerCase(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Verification failed. Token may be invalid or expired.')
        setLoading(false)
        return
      }

      setSuccessMessage(data.message || 'Email successfully verified!')
    } catch (err) {
      console.error('Verification error:', err)
      setErrorMessage('Connection failed. Please retry verification.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email?.trim()) {
      setErrorMessage('Please enter your email to receive a new verification token.')
      return
    }

    setResending(true)
    setErrorMessage(null)
    setResendNotice(null)

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          resend: true,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to resend verification token.')
        return
      }

      setResendNotice(
        data.verification?.notice || 'A new verification token has been generated.'
      )

      if (data.verification?.token) {
        setToken(data.verification.token)
      }
    } catch (err) {
      console.error('Resend error:', err)
      setErrorMessage('Gateway unreachable.')
    } finally {
      setResending(false)
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

      {/* Verification Card */}
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
            IDENTITY & EMAIL VALIDATION
          </div>
          <h1 className="font-inter font-bold text-2xl text-[#0C1E36]">
            Verify Account Email
          </h1>
          <p className="text-xs font-manrope text-[#0C1E36]/70 max-w-sm mx-auto">
            Confirm your registered email address to unlock authorized access to FleetVision AI.
          </p>
        </div>

        {/* Success State */}
        {successMessage ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-5 py-4"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="font-inter font-bold text-xl text-[#0C1E36]">
                Verification Confirmed
              </h3>
              <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1">
                {successMessage}
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F88F22] text-white font-manrope font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              <span>SIGN IN NOW</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          /* Verification Form */
          <div className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-manrope flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {resendNotice && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-manrope flex items-start gap-2.5">
                <Check className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{resendNotice}</span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleVerify()
              }}
              className="space-y-3.5"
            >
              {/* Email Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                  Registered Email Address
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

              {/* Token Input */}
              <div className="space-y-1">
                <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                  Verification Token (64-char Hex)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter or paste received token..."
                    className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="pt-2">
                <AuthActionButton
                  type="submit"
                  label="VERIFY ACCOUNT"
                  loading={loading}
                  loadingText="VALIDATING CIPHER TOKEN..."
                  variant="sunset"
                />
              </div>
            </form>

            {/* Resend Action */}
            <div className="pt-4 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-manrope text-[#0C1E36]/70">
              <span>Token expired or not received?</span>
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="font-bold text-[#EA6113] hover:text-[#07518A] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>Resend Token</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#03080F] flex items-center justify-center text-white font-mono text-xs">
          LOADING VERIFICATION PORTAL...
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
