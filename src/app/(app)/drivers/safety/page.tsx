'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Shield,
  Star,
  Search,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  UserCheck,
  RotateCw,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface ISafetyDriver {
  id: string
  name: string
  rating: number
  harshBraking: number
  overspeedEvents: number
  fatigueScore: string
  status: 'exemplary' | 'good' | 'coaching_required'
  coachingPlan: string
}

const DRIVER_SAFETY_ROSTER: ISafetyDriver[] = [
  {
    id: '1',
    name: 'Pradeep Kumar',
    rating: 4.8,
    harshBraking: 0,
    overspeedEvents: 0,
    fatigueScore: 'Optimal (Low)',
    status: 'exemplary',
    coachingPlan: 'Eligible for quarterly safety performance bonus',
  },
  {
    id: '2',
    name: 'Suresh Raina',
    rating: 4.6,
    harshBraking: 1,
    overspeedEvents: 0,
    fatigueScore: 'Nominal',
    status: 'good',
    coachingPlan: 'Routine expressway curve speed reminders',
  },
  {
    id: '3',
    name: 'Ramesh Patel',
    rating: 3.4,
    harshBraking: 4,
    overspeedEvents: 2,
    fatigueScore: 'Elevated (Night Shifts)',
    status: 'coaching_required',
    coachingPlan: 'Mandatory night corridor braking & rest interval session',
  },
  {
    id: '4',
    name: 'Anand Rao',
    rating: 4.7,
    harshBraking: 0,
    overspeedEvents: 0,
    fatigueScore: 'Optimal',
    status: 'exemplary',
    coachingPlan: 'Eco-driving EV regenerative braking champion',
  },
]

export default function DriverSafetyPage() {
  const [search, setSearch] = useState('')

  const filtered = DRIVER_SAFETY_ROSTER.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              OPERATOR TELEMETRICS · BEHAVIORAL SAFETY
            </span>
            <DemoBadge label="AI TELEMETRY AUDIT" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            DRIVER SAFETY <br />
            <span className="text-[#f7801b]">RADAR.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            CAN-bus G-force telemetry · Harsh braking & overspeed infractions · Night corridor fatigue indices · Safety coaching
          </p>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Fleet Average Safety Rating</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">4.6 / 5.0</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">Top 5% commercial fleet benchmark</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Zero Incident Days</span>
          <p className="text-3xl font-black text-[#2d140d] mt-1">42 Days</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">No major damage or severe collision events</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Coaching Recommendations</span>
          <p className="text-3xl font-black text-[#f7801b] mt-1">1 Operator</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">Scheduled for night driving safety review</p>
        </div>
      </div>

      {/* 3. Driver Safety Roster */}
      <div className="rounded-3xl bg-white border border-[#bf7e4d]/25 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FFF5EC] border-b border-[#bf7e4d]/25 text-[#84492d] uppercase font-bold">
              <tr>
                <th className="p-4">Commercial Operator</th>
                <th className="p-4">Safety Rating</th>
                <th className="p-4">Harsh Braking</th>
                <th className="p-4">Speed Violations</th>
                <th className="p-4">Fatigue Index</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action Plan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bf7e4d]/20">
              {filtered.map((d) => (
                <tr key={d.id} className="hover:bg-[#FFF5EC] transition-colors">
                  <td className="p-4 font-bold text-[#2d140d]">{d.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 bg-[#FFF1E6] border border-[#bf7e4d]/30 px-2.5 py-1 rounded-xl w-max">
                      <Star className="w-3.5 h-3.5 text-[#fba41c] fill-[#fba41c]" />
                      <span className="text-xs font-bold text-[#2d140d]">{d.rating.toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#2d140d] font-semibold">{d.harshBraking} Events</td>
                  <td className="p-4 text-[#2d140d] font-semibold">{d.overspeedEvents} Flags</td>
                  <td className="p-4 font-bold text-[#84492d]">{d.fatigueScore}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        d.status === 'exemplary'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : d.status === 'good'
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-red-100 text-[#a02515] border-red-300'
                      }`}
                    >
                      {d.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right text-[#5c3a35] font-medium max-w-[260px] truncate">
                    {d.coachingPlan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
