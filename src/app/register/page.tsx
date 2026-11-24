'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  User,
  Mail,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { AuthActionButton } from '@/modules/authentication/components/AuthActionButton'
import { TransformerTruckSymbol } from '@/modules/branding/TransformerTruckSymbol'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successData, setSuccessData] = useState<any | null>(null)

  const isEmailValid = email.includes('@') && email.length > 3
  const isPasswordValid = Boolean(password && password.length >= 1)
  const passwordsMatch = Boolean(password && password === confirmPassword)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!acceptTerms) {
      setErrorMessage('Please accept the FleetVision Enterprise Terms & Security Policy.')
      return
    }

    if (!isPasswordValid) {
      setErrorMessage('Please enter a password.')
      return
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please verify.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          companyName: companyName.trim(),
          password,
          confirmPassword,
          acceptTerms,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMessage(data.error || 'Registration failed. Please check your inputs.')
        setLoading(false)
        return
      }

      setSuccessData(data)
    } catch (err) {
      console.error('Registration network error:', err)
      setErrorMessage('Secure gateway unreachable. Please check connection.')
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
          alt="Euro Truck Fleet Background"
          className="w-full h-full object-cover object-center filter blur-xs brightness-60 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03080F]/95 via-[#0C1E36]/70 to-[#07518A]/35" />
      </div>

      {/* Top Header Link */}
      <header className="absolute top-0 inset-x-0 z-30 p-4 sm:p-6 flex items-center justify-between pointer-events-auto">
        <Link
          href="/login"
          className="py-2 px-4 rounded-full bg-white/15 hover:bg-white/25 text-white border border-white/25 backdrop-blur-md transition-all flex items-center gap-2 text-xs font-manrope font-semibold group shadow-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Already registered? Sign In</span>
        </Link>
      </header>

      {/* Main Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-4xl bg-white rounded-[32px] border border-[#bf7e4d]/30 shadow-2xl overflow-hidden flex flex-col md:flex-row pointer-events-auto my-8"
      >
        {/* Left Branding Strip */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#07518A] via-[#0C1E36] to-[#03080F] p-8 sm:p-10 flex flex-col justify-between text-white">
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <TransformerTruckSymbol size={28} variant="white" glow={true} />
              <div>
                <span className="text-xs font-mono font-bold tracking-widest text-[#FBB931] uppercase block">
                  FLEETVISION AI
                </span>
                <span className="text-[10px] text-white/70 font-mono tracking-wider">
                  ENTERPRISE ENROLLMENT
                </span>
              </div>
            </div>

            <h1 className="font-inter font-extrabold text-3xl sm:text-4xl leading-tight">
              Register <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F88F22] to-[#FBB931]">
                Your Fleet.
              </span>
            </h1>

            <p className="mt-4 text-xs font-manrope text-white/80 leading-relaxed">
              Create your organization account to unlock 100 Hz telematics, driver rosters, predictive maintenance, and Optimus AI intelligence.
            </p>
          </div>

          <div className="space-y-3 pt-6 border-t border-white/10 text-xs font-manrope text-white/75">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Role-Based Operational Access Control</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Argon2id/Bcrypt 12-Round Password Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5" />
              </div>
              <span>Multi-Unit Commercial Vehicle Monitoring</span>
            </div>
          </div>
        </div>

        {/* Right Form Container */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-white">
          {!successData ? (
            <div className="space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#FFF1E6] text-[#EA6113] text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  AUTHENTICATED ACCESS REGISTRATION
                </div>
                <h2 className="font-inter font-bold text-2xl text-[#0C1E36]">
                  Create FleetVision Account
                </h2>
                <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1">
                  All fields are verified on both client and server before provisioning.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-manrope flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Vikram Malhotra"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Work Email */}
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
                      placeholder="vikram@logistics-corp.in"
                      className="w-full h-11 pl-10 pr-10 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                    />
                    {isEmailValid && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                </div>

                {/* Company / Organisation Name */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                    Organisation / Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-[#0C1E36]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Western Express Logistics"
                      className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-xs font-manrope text-[#0C1E36] placeholder-[#0C1E36]/40 focus:outline-none focus:border-[#EA6113] focus:ring-2 focus:ring-[#EA6113]/20 focus:bg-white transition-all shadow-xs"
                    />
                  </div>
                </div>

                {/* Password & Confirm Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-manrope font-semibold uppercase text-[#0C1E36] tracking-wider">
                      Password
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
                      Confirm Password
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

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#EA6113] focus:ring-[#EA6113] border-slate-300"
                  />
                  <label htmlFor="terms" className="text-xs font-manrope text-[#0C1E36]/75 cursor-pointer">
                    I agree to the FleetVision Terms of Service, CAN-Bus Telemetry Data Policies and Security Agreement.
                  </label>
                </div>

                <div className="pt-2">
                  <AuthActionButton
                    type="submit"
                    label="CREATE ACCOUNT"
                    loading={loading}
                    loadingText="PROVISIONING ENCRYPTED RECORD..."
                    variant="sunset"
                  />
                </div>
              </form>

              <div className="pt-3 border-t border-[#E5DFD7] text-center text-xs font-manrope text-[#0C1E36]/70">
                <span>Already have authorized access? </span>
                <Link href="/login" className="font-bold text-[#EA6113] hover:underline">
                  Sign In to Fleet
                </Link>
              </div>
            </div>
          ) : (
            /* SUCCESS CONFIRMATION STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-5 text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  DATABASE VERIFIED · ACCOUNT CREATED
                </span>
                <h3 className="font-inter font-bold text-2xl text-[#0C1E36] mt-2">
                  Welcome to FleetVision AI
                </h3>
                <p className="text-xs font-manrope text-[#0C1E36]/70 mt-1 max-w-sm mx-auto">
                  Your operator profile for <span className="font-bold text-[#0C1E36]">{successData.user?.companyName}</span> has been provisioned.
                </p>
              </div>

              {/* Unique User ID Display */}
              <div className="bg-[#FAFAF9] p-4 rounded-2xl border border-[#E5DFD7] text-left space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#0C1E36]/60">Unique Operator ID:</span>
                  <span className="font-bold text-[#EA6113]">{successData.user?.id}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#0C1E36]/60">Assigned Operational Role:</span>
                  <span className="font-bold text-[#07518A] uppercase">{successData.user?.role}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#0C1E36]/60">Registered Email:</span>
                  <span className="font-bold text-[#0C1E36]">{successData.user?.email}</span>
                </div>
              </div>

              {/* Email Verification Status Notification */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs font-manrope text-amber-900 space-y-1">
                <p className="font-semibold text-amber-950">Next Step: Email Verification</p>
                <p className="text-[11px] leading-relaxed text-amber-800">
                  {successData.verification?.notice}
                </p>
                {successData.verification?.token && (
                  <div className="mt-2 pt-2 border-t border-amber-200/70 font-mono text-[10px] text-amber-950">
                    <span>Generated One-Time Token: </span>
                    <span className="font-bold select-all bg-amber-200/60 px-1.5 py-0.5 rounded">
                      {successData.verification.token}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <Link
                  href={
                    successData.verification?.actionUrl ||
                    `/verify-email?email=${encodeURIComponent(successData.user?.email || '')}`
                  }
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#EA6113] hover:bg-[#F88F22] text-white font-manrope font-bold text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  <span>Proceed to Email Verification</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
