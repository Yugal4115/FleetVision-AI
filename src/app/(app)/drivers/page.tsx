'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  ShieldCheck,
  Calendar,
  Truck,
  RotateCw,
  Plus,
  ArrowRight,
  UserCheck,
  AlertTriangle,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IDriver {
  id: string
  name: string
  phone: string
  email: string
  licenseNumber: string
  licenseExpiry: string
  experience: number
  emergencyContact: string
  emergencyPhone: string
  address: string
  rating: number
  status: string
  _count?: { trips: number; scores: number; fuelLogs: number }
}

export default function DriverManagementPage() {
  const [drivers, setDrivers] = useState<IDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchDrivers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/drivers?limit=50')
      if (res.ok) {
        const data = await res.json()
        setDrivers(data.drivers || [])
      }
    } catch (err) {
      console.error('Failed to fetch drivers:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [])

  const filtered = drivers.filter((d) => {
    const matchSearch =
      !search ||
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      d.phone.includes(search)
    const matchStatus = statusFilter === 'all' || d.status.toLowerCase() === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              CREW OPERATIONS · OPERATOR ROSTER
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            DRIVER <br />
            <span className="text-[#EA6113]">MANAGEMENT.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Active commercial drivers · Safety ratings · Certification audits · Real-time mission assignments
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchDrivers}
            className="p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh Drivers Roster"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EA6113]' : ''}`} />
          </button>

          <Link
            href="/drivers/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#EA6113]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Onboard Driver</span>
          </Link>
        </div>
      </div>

      {/* 2. Controls & Search Filter */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search driver by name, license, or phone..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#EA6113] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#64748B] font-bold hidden sm:inline">Status:</span>
          {['all', 'on_trip', 'available', 'off_duty'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all font-bold ${
                statusFilter === s
                  ? 'bg-gradient-to-r from-[#EA6113] to-[#F7801B] text-white shadow-xs'
                  : 'bg-[#FFF5EC] text-[#0C1E36] hover:bg-[#FFE3B3]'
              }`}
            >
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Driver Cards Grid */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#64748B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#EA6113] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING OPERATOR TELEMETRY...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#E5DFD7] p-8 space-y-3">
          <Users className="w-12 h-12 text-[#64748B] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#07518A] uppercase">No Drivers Matched</h3>
          <p className="text-xs font-mono text-[#64748B]">Try adjusting search filters or status criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <div
              key={d.id}
              className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] p-6 shadow-xs hover:shadow-xl hover:border-[#EA6113]/60 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold font-sans text-[#07518A] uppercase leading-tight">
                      {d.name}
                    </h3>
                    <p className="text-xs font-mono text-[#EA6113] font-semibold mt-0.5">
                      {d.experience} Years Heavy Vehicle Exp
                    </p>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FFF5EC] border border-[#E5DFD7] px-2.5 py-1 rounded-xl shadow-xs">
                    <Star className="w-3.5 h-3.5 text-[#EA6113] fill-[#EA6113]" />
                    <span className="text-xs font-bold text-[#0C1E36] font-mono">{d.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="space-y-2.5 py-3 border-y border-[#E5DFD7]/70 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Commercial License:</span>
                    <span className="font-bold text-[#0C1E36]">{d.licenseNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Phone:</span>
                    <span className="font-bold text-[#07518A]">{d.phone}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">License Expiry:</span>
                    <span className="font-semibold text-[#0C1E36]">
                      {new Date(d.licenseExpiry).toLocaleDateString('en-IN', { year: 'numeric', month: 'short' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B]">Completed Trips:</span>
                    <span className="font-black text-[#EA6113]">{d._count?.trips || 0} Missions</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    d.status === 'on_trip'
                      ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                      : d.status === 'available'
                      ? 'bg-[#FFF5EC] text-[#EA6113] border border-[#f7801b]/30'
                      : 'bg-slate-100 text-[#64748B] border border-slate-200'
                  }`}
                >
                  {d.status.replace('_', ' ')}
                </span>

                <Link
                  href={`/drivers/${d.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#EA6113] hover:text-[#d33e1b] transition-colors"
                >
                  <span>Operator Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
