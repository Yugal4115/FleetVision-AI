'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2, Mail, Building2, Phone, User, MessageSquare } from 'lucide-react'

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    fleetSize: '25-100',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#FAFAF9] text-[#0C1E36] relative border-t border-[#E5DFD7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Column: Context & Direct Info */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF1E6] border border-[#FFE3B3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA6113]" />
              <span className="text-xs font-mono font-bold text-[#07518A] uppercase tracking-wider">
                Enterprise Onboarding
              </span>
            </div>

            <h2 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[1.02]">
              CONNECT YOUR FLEET <br />
              <span className="text-[#EA6113]">TO FLEETVISION AI</span>
            </h2>

            <p className="text-sm sm:text-base text-[#0C1E36]/80 leading-relaxed font-sans max-w-lg">
              Schedule an executive walkthrough or request technical API integration specifications
              for your transport operation.
            </p>

            <div className="pt-6 space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD7]">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] flex items-center justify-center text-[#EA6113]">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0C1E36]/60">Enterprise Inquiries</p>
                  <p className="text-sm font-mono font-bold text-[#07518A]">operations@fleetvision.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD7]">
                <div className="w-10 h-10 rounded-xl bg-[#FFF1E6] flex items-center justify-center text-[#EA6113]">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#0C1E36]/60">Corporate Central Hub</p>
                  <p className="text-sm font-sans font-bold text-[#07518A]">Bengaluru Central Depot Corridor, Karnataka</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#FFE3B3] shadow-md">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#FFF1E6] text-[#EA6113] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-sans text-[#07518A] uppercase">Inquiry Received</h3>
                <p className="text-sm text-[#0C1E36]/70 max-w-sm mx-auto">
                  An enterprise fleet specialist will review your parameters and follow up within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A]">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Fleet Director / Operations Lead"
                    className="w-full h-12 px-4 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-sm text-[#0C1E36] focus:outline-none focus:border-[#EA6113] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A]">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="operator@company.com"
                      className="w-full h-12 px-4 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-sm text-[#0C1E36] focus:outline-none focus:border-[#EA6113] transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A]">
                      Fleet Size
                    </label>
                    <select
                      value={formData.fleetSize}
                      onChange={(e) => setFormData({ ...formData, fleetSize: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-sm text-[#0C1E36] focus:outline-none focus:border-[#EA6113] transition-colors"
                    >
                      <option value="10-25">10 - 25 Vehicles</option>
                      <option value="25-100">25 - 100 Vehicles</option>
                      <option value="100-500">100 - 500 Vehicles</option>
                      <option value="500+">500+ Commercial Units</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A]">
                    Message / Operational Scope
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe current corridor, depot locations, or telematics requirements..."
                    className="w-full p-4 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7] text-sm text-[#0C1E36] focus:outline-none focus:border-[#EA6113] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-full bg-[#EA6113] hover:bg-[#F88F22] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(234,97,19,0.3)]"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'SUBMITTING...' : 'REQUEST WALKTHROUGH'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
