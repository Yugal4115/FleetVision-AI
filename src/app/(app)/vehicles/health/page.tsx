'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  Gauge,
  RotateCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Wrench,
  ShieldAlert,
  ArrowRight,
  Battery,
  Disc,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IHealthUnit {
  id: string
  code: string
  model: string
  powertrain: number
  battery: number
  brakes: number
  tyres: number
  dtcCount: number
  overall: number
  status: 'optimal' | 'attention_needed'
}

const FLEET_HEALTH_DATA: IHealthUnit[] = [
  {
    id: '1',
    code: 'FV-001',
    model: 'Volvo FH Aero Electric',
    powertrain: 96,
    battery: 94,
    brakes: 92,
    tyres: 95,
    dtcCount: 0,
    overall: 94,
    status: 'optimal',
  },
  {
    id: '2',
    code: 'FV-002',
    model: 'Volvo FH16 750 Globetrotter',
    powertrain: 92,
    battery: 88,
    brakes: 84,
    tyres: 90,
    dtcCount: 0,
    overall: 89,
    status: 'optimal',
  },
  {
    id: '3',
    code: 'FV-003',
    model: 'Tata Prima 5530.S',
    powertrain: 82,
    battery: 85,
    brakes: 76,
    tyres: 80,
    dtcCount: 2,
    overall: 81,
    status: 'attention_needed',
  },
  {
    id: '4',
    code: 'FV-014',
    model: 'Bajaj RE E-Tec 9.0',
    powertrain: 98,
    battery: 96,
    brakes: 94,
    tyres: 95,
    dtcCount: 0,
    overall: 96,
    status: 'optimal',
  },
]

export default function FleetHealthPage() {
  const [search, setSearch] = useState('')

  const filtered = FLEET_HEALTH_DATA.filter(
    (u) =>
      u.code.toLowerCase().includes(search.toLowerCase()) ||
      u.model.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              OBD-II CAN-BUS TELEMETRY · DIAGNOSTIC RADAR
            </span>
            <DemoBadge label="CAN BUS DIAGNOSTICS ACTIVE" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            FLEET <br />
            <span className="text-[#f7801b]">HEALTH.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Real-time CAN-bus diagnostic trouble codes · Powertrain & HV battery SoH · Component wear radar
          </p>
        </div>
      </div>

      {/* 2. Fleet Health Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((u) => (
          <div
            key={u.id}
            className="p-6 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm shadow-[#f7801b]/5 hover:shadow-xl hover:border-[#f7801b]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold font-sans text-[#2d140d] uppercase leading-tight">
                    {u.code} · {u.model}
                  </h3>
                  <span className="text-xs font-mono font-bold text-[#84492d] block mt-0.5">
                    Overall Diagnostic Score: {u.overall}%
                  </span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                    u.status === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-[#d33e1b] border border-amber-300'
                  }`}
                >
                  {u.status.replace('_', ' ')}
                </span>
              </div>

              {/* Subsystem Telemetry Bars */}
              <div className="space-y-3 font-mono text-xs py-3 border-y border-[#bf7e4d]/20">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#5c3a35]">Powertrain Assembly:</span>
                    <span className="font-bold text-[#2d140d]">{u.powertrain}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FFF1E6] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#f7801b] to-[#e35020] rounded-full" style={{ width: `${u.powertrain}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#5c3a35]">High-Voltage Battery SoH:</span>
                    <span className="font-bold text-[#2d140d]">{u.battery}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FFF1E6] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#fba41c] to-[#f7801b] rounded-full" style={{ width: `${u.battery}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[#5c3a35]">Braking Calipers & Liners:</span>
                    <span className="font-bold text-[#2d140d]">{u.brakes}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#FFF1E6] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#84492d] to-[#d33e1b] rounded-full" style={{ width: `${u.brakes}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-mono">
                <span className="text-[#5c3a35]">
                  DTC Error Codes: <strong className="text-[#2d140d]">{u.dtcCount} logged</strong>
                </span>

                <Link
                  href="/vehicles"
                  className="inline-flex items-center gap-1.5 font-bold text-[#f7801b] hover:text-[#e35020] transition-colors"
                >
                  <span>Vehicle Telemetry</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
