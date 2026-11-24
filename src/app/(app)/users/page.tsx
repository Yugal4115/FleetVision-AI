'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  UserCheck,
  Search,
  Plus,
  Shield,
  Key,
  Mail,
  Building2,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IPlatformUser {
  id: string
  name: string
  email: string
  role: string
  depot: string
  permissions: string[]
  status: 'active' | 'suspended'
  lastLogin: string
}

const PLATFORM_USERS: IPlatformUser[] = [
  {
    id: 'u-1',
    name: 'Yugal Yuvaraj',
    email: 'yugal@fleetvision.com',
    role: 'Fleet Executive Commander',
    depot: 'Bengaluru Central Depot',
    permissions: ['Full Root Access', 'Financial Approval', 'Trip Dispatch', 'AI Model Override'],
    status: 'active',
    lastLogin: 'Just now',
  },
  {
    id: 'u-2',
    name: 'Rajesh Sharma',
    email: 'rajesh@fleetvision.com',
    role: 'Operations Dispatch Manager',
    depot: 'Chennai Port Container Hub',
    permissions: ['Trip Dispatch', 'Driver Assignment', 'Fuel Telematics'],
    status: 'active',
    lastLogin: '2 hours ago',
  },
  {
    id: 'u-3',
    name: 'Dr. Anita Desai',
    email: 'anita@fleetvision.com',
    role: 'Safety & Compliance Officer',
    depot: 'Bengaluru Central Depot',
    permissions: ['Driver Coaching', 'Safety Audits', 'Accident Investigation'],
    status: 'active',
    lastLogin: 'Yesterday',
  },
  {
    id: 'u-4',
    name: 'Vikram Mehta',
    email: 'vikram@fleetvision.com',
    role: 'Lead Service Engineer',
    depot: 'Mumbai Logistics Corridor',
    permissions: ['Bay Work Orders', 'Diagnostic DTC Clearing', 'Parts Inventory'],
    status: 'active',
    lastLogin: '3 days ago',
  },
]

export default function UsersAccessPage() {
  const [search, setSearch] = useState('')

  const filtered = PLATFORM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              ADMINISTRATION · ROLE-BASED ACCESS
            </span>
            <DemoBadge label="RBAC SECURITY ENFORCED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            USERS & <br />
            <span className="text-[#f7801b]">ACCESS.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Authorized fleet managers · Dispatch engineers · Safety compliance auditors · Permission management
          </p>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#84492d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search team member by name, email, or role..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#bf7e4d]/30 text-xs font-mono text-[#2d140d] placeholder-[#84492d]/70 focus:outline-none focus:border-[#f7801b] transition-colors"
          />
        </div>

        <span className="text-xs font-mono text-[#5c3a35] font-medium">
          {PLATFORM_USERS.length} Authorized Team Members
        </span>
      </div>

      {/* 3. Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="p-6 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm shadow-[#f7801b]/5 hover:shadow-xl hover:border-[#f7801b]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-bold font-sans text-[#2d140d] uppercase leading-tight">
                    {user.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#f7801b] block mt-0.5">
                    {user.role}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {user.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-[#bf7e4d]/20 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="text-[#5c3a35]">Email:</span>
                  <span className="font-bold text-[#2d140d]">{user.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c3a35]">Depot Hub:</span>
                  <span className="font-bold text-[#84492d]">{user.depot}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5c3a35]">Last Authentication:</span>
                  <span className="font-semibold text-[#2d140d]">{user.lastLogin}</span>
                </div>
              </div>

              {/* Permissions Pills */}
              <div className="pt-3">
                <span className="text-[10px] font-mono font-bold uppercase text-[#84492d] block mb-2">
                  Active Security Capabilities:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {user.permissions.map((perm, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-[#FFF1E6] text-[#4d2e2a] border border-[#bf7e4d]/20"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
