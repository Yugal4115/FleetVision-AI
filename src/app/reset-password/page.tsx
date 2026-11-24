'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react'
import { AuthActionButton } from '@/modules/authentication/components/AuthActionButton'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') || ''
  const initialToken = searchParams.get('token') || ''

  const [email, setEmail] = useState(initialEmail)
  const [token, setToken] = useState(initialToken)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isPasswordValid = password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password)
  const passwordsMatch = password && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!isPasswordValid) {
      setErrorMessage('Password must be at least 8 characters and contain both letters and numbers.')
      return
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please verify.')
      return
    }

    if (!token?.trim()) {
      setErrorMessage('Reset token is required.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          token: token.trim(),
          password,
          confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Password reset failed. Token may be invalid or expired.')
        setLoading(false)
        return
      }

      setSuccess(true)
    } catch (err) {
      console.error('Password reset network error:', err)
      setErrorMessage('Secure gateway connection failed. Please retry.')
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

      {/* Main Reset Card */}
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
            SECURE CREDENTIAL ROTATION
          </div>
          <h1 className="font-inter font-bold text-2xl text-[#0C1E36]">
            Set New Password
          </h1>
          <p className="text-xs font-manrope text-[#0C1E36]/70 max-w-sm mx-auto">
            Choose a strong password with at least 8 characters, combining letters and numbers.
          </p>
        </div>

        {success ? (
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
                Password Updated Successfully
              </h3>
              <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1">
                Your credentials have been securely hashed and updated in the database. Active sessions have been invalidated.
              </p>
            </div>

            <Link
              href="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F88F22] text-white font-manrope font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
            >
              <span>SIGN IN WITH NEW PASSWORD</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-manrope flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                Registered Work Email
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

            {/* Token Field */}
            <div className="space-y-1">
              <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                Reset Token (64-char Hex)
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Enter or paste reset token..."
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                />
              </div>
            </div>

            {/* New Password & Confirm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0C1E36]/50 hover:text-[#0C1E36]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                  />
                  {passwordsMatch && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <AuthActionButton
                type="submit"
                label="RESET PASSWORD"
                loading={loading}
                loadingText="ENCRYPTING NEW CREDENTIALS..."
                variant="sunset"
              />
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#03080F] flex items-center justify-center text-white font-mono text-xs">
          LOADING RECOVERY PORTAL...
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
