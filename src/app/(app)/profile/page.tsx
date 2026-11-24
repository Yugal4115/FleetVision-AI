'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  User,
  Shield,
  Key,
  Mail,
  Building2,
  CheckCircle,
  Clock,
  Save,
  Lock,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'
import { useAuth } from '@/modules/authentication/hooks/useAuth'

export default function UserProfilePage() {
  const { user } = useAuth()
  const [name, setName] = useState(user?.name || 'Yugal Yuvaraj')
  const [email, setEmail] = useState(user?.email || 'yugal@fleetvision.com')
  const [saved, setSaved] = useState(false)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      toast.success('User credentials updated successfully!')
    }, 500)
  }

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              OPERATOR CREDENTIALS · SECURITY PROFILE
            </span>
            <DemoBadge label="SESSION AUTHENTICATED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            USER <br />
            <span className="text-[#EA6113]">PROFILE.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Personal identity · Role clearances · Operating terminal hub · Security credentials & audit history
          </p>
        </div>
      </div>

      {/* 2. Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#EA6113] to-[#F7801B] text-white flex items-center justify-center text-3xl font-black shadow-md shadow-[#EA6113]/30">
              {name.charAt(0)}
            </div>

            <div>
              <h2 className="text-xl font-bold font-sans text-[#07518A] uppercase">{name}</h2>
              <span className="text-xs font-mono font-bold text-[#EA6113] block mt-0.5">
                {user?.role?.toUpperCase() || 'FLEET EXECUTIVE COMMANDER'}
              </span>
            </div>

            <div className="space-y-2.5 pt-3 border-t border-[#E5DFD7]/70 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Depot Hub:</span>
                <span className="font-bold text-[#0C1E36]">Bengaluru Central Depot</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Security Clearance:</span>
                <span className="font-bold text-emerald-700">Tier-1 Root Admin</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#64748B]">Session Status:</span>
                <span className="font-bold text-[#07518A]">Active Verified</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono">
            <span className="font-bold text-[#07518A] block mb-1">Optimus Prime AI Assistant</span>
            <span className="text-[#64748B] text-[11px] block">
              Autonomous co-pilot widget is attached and listening at bottom-right corner.
            </span>
          </div>
        </div>

        {/* Credentials Editor */}
        <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-6">
          <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#EA6113]" />
            Edit Profile Details
          </h3>

          <form onSubmit={handleUpdate} className="space-y-4 font-mono text-xs">
            <div>
              <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                Full Legal Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                Work Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saved}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#EA6113]/25 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saved ? 'Updating Profile...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
