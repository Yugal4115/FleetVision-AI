'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Truck,
  Navigation,
  Gauge,
  Fuel,
  Zap,
  RotateCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Radio,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface ITrackingVehicle {
  id: string
  code: string
  model: string
  fuelType: 'electric' | 'diesel' | 'cng'
  driver: string
  corridor: string
  lat: number
  lng: number
  speed: number
  fuelLevel: number
  status: 'en_route' | 'idle' | 'charging'
  eta: string
  progress: number
}

const LIVE_TRACKING_UNITS: ITrackingVehicle[] = [
  {
    id: '1',
    code: 'FV-001',
    model: 'Volvo FH Aero Electric',
    fuelType: 'electric',
    driver: 'Pradeep Kumar',
    corridor: 'Bengaluru Logistics Corridor (NH-48)',
    lat: 12.9716,
    lng: 77.5946,
    speed: 78,
    fuelLevel: 88,
    status: 'en_route',
    eta: '45 mins',
    progress: 74,
  },
  {
    id: '2',
    code: 'FV-002',
    model: 'Volvo FH16 750 Globetrotter',
    fuelType: 'diesel',
    driver: 'Suresh Raina',
    corridor: 'Mumbai → Pune Expressway Corridor',
    lat: 18.9894,
    lng: 73.1175,
    speed: 64,
    fuelLevel: 62,
    status: 'en_route',
    eta: '1h 15m',
    progress: 58,
  },
  {
    id: '3',
    code: 'FV-003',
    model: 'Tata Prima 5530.S',
    fuelType: 'diesel',
    driver: 'Ramesh Patel',
    corridor: 'Chennai Port Container Terminal Hub',
    lat: 13.0827,
    lng: 80.2707,
    speed: 0,
    fuelLevel: 45,
    status: 'idle',
    eta: 'At Hub',
    progress: 100,
  },
  {
    id: '4',
    code: 'FV-014',
    model: 'Bajaj RE E-Tec 9.0',
    fuelType: 'electric',
    driver: 'Anand Rao',
    corridor: 'Hyderabad Urban Distribution Grid',
    lat: 17.385,
    lng: 78.4867,
    speed: 38,
    fuelLevel: 94,
    status: 'en_route',
    eta: '25 mins',
    progress: 82,
  },
]

export default function LiveTrackingPage() {
  const [selectedUnit, setSelectedUnit] = useState<ITrackingVehicle>(LIVE_TRACKING_UNITS[0])
  const [filterText, setFilterText] = useState('')
  const [isLive, setIsLive] = useState(true)

  const filteredUnits = LIVE_TRACKING_UNITS.filter(
    (u) =>
      u.code.toLowerCase().includes(filterText.toLowerCase()) ||
      u.model.toLowerCase().includes(filterText.toLowerCase()) ||
      u.driver.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              SATELLITE TELEMETRY · LIVE GPS RADAR
            </span>
            <DemoBadge label="REAL-TIME TELEMETRY STREAM" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            FLEET LIVE <br />
            <span className="text-[#f7801b]">TRACKING.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Centimeter-accurate GPS coordinates · Speed & CAN-bus telemetry · Corridor progress & ETA forecasting
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-mono font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>STREAM ACTIVE (1000ms)</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Map & Fleet Telemetry Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Vehicle Selector Roster */}
        <div className="lg:col-span-4 rounded-3xl bg-white border border-[#bf7e4d]/25 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#bf7e4d]/20">
            <h3 className="text-sm font-mono font-extrabold text-[#2d140d] uppercase">Active Fleet Units</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#FFF1E6] text-[#84492d] border border-[#bf7e4d]/30">
              {LIVE_TRACKING_UNITS.length} ONLINE
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#84492d] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filter unit by code, driver..."
              className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#FFF5EC] border border-[#bf7e4d]/30 text-xs font-mono text-[#2d140d] placeholder-[#84492d]/70 focus:outline-none focus:border-[#f7801b]"
            />
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredUnits.map((u) => {
              const isSelected = selectedUnit.id === u.id
              return (
                <div
                  key={u.id}
                  onClick={() => setSelectedUnit(u)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF1E6] border-[#f7801b] shadow-md shadow-[#f7801b]/15'
                      : 'bg-[#FFF8F2] border-[#bf7e4d]/20 hover:bg-[#FFF5EC]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs font-black text-[#84492d]">{u.code}</span>
                    <span
                      className={`text-[9px] font-mono font-bold px-2 py-0.2 rounded-full uppercase ${
                        u.status === 'en_route'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : u.status === 'charging'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-[#5c3a35] border border-slate-200'
                      }`}
                    >
                      {u.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs font-bold text-[#2d140d] leading-tight truncate">{u.model}</p>
                  <p className="text-[11px] font-mono text-[#5c3a35] mt-1 truncate">Driver: {u.driver}</p>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#bf7e4d]/15 text-[11px] font-mono">
                    <span className="font-bold text-[#2d140d]">{u.speed} km/h</span>
                    <span className="font-black text-[#f7801b]">{u.progress}% Completed</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: High-Tech Satellite Canvas Simulation */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-[#bf7e4d]/25 p-6 shadow-sm space-y-6">
          {/* Simulated Satellite Map Surface */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[#2D140D] via-[#4D2E2A] to-[#1A0C08] p-6 flex flex-col justify-between border border-[#bf7e4d]/40 shadow-inner">
            {/* High-tech Topographic Grid Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#f7801b_1px,transparent_1px)] [background-size:28px_28px] opacity-20 pointer-events-none" />

            {/* Simulated Satellite Highway Corridors */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              <path d="M 50 250 Q 250 150 450 220 T 750 120" stroke="#f7801b" strokeWidth="3" fill="none" strokeDasharray="6 4" />
              <path d="M 120 400 Q 300 320 550 350 T 800 280" stroke="#fba41c" strokeWidth="2" fill="none" strokeDasharray="4 4" />
            </svg>

            {/* Top HUD Bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-xs">
                <Navigation className="w-3.5 h-3.5 text-[#f7801b] animate-spin" />
                <span className="font-bold">GPS: {selectedUnit.lat.toFixed(4)}° N, {selectedUnit.lng.toFixed(4)}° E</span>
              </div>
              <div className="bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-xs">
                <span className="text-[#fba41c] font-bold">CORRIDOR ETA: {selectedUnit.eta}</span>
              </div>
            </div>

            {/* Center Vehicle Beacon Point */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              <div className="relative flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-[#f7801b]/25 animate-ping absolute" />
                <div className="w-12 h-12 rounded-full bg-[#f7801b] border-2 border-white flex items-center justify-center text-white shadow-xl shadow-[#f7801b]/50">
                  <Truck className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-3 bg-black/75 backdrop-blur-md px-4 py-2 rounded-xl border border-[#f7801b]/60 text-white text-center font-mono">
                <span className="text-xs font-black text-[#fba41c] block">{selectedUnit.code} · {selectedUnit.model}</span>
                <span className="text-[10px] text-white/80">{selectedUnit.corridor}</span>
              </div>
            </div>

            {/* Bottom HUD: Live Telemetry telemetry bar */}
            <div className="relative z-10 grid grid-cols-3 gap-2 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white font-mono text-xs">
              <div>
                <span className="text-[9px] text-[#fba41c] block uppercase">Live Velocity</span>
                <span className="font-bold text-sm text-white">{selectedUnit.speed} km/h</span>
              </div>
              <div>
                <span className="text-[9px] text-[#fba41c] block uppercase">Energy Level</span>
                <span className="font-bold text-sm text-white">{selectedUnit.fuelLevel}% {selectedUnit.fuelType === 'electric' ? 'SoC' : 'Fuel'}</span>
              </div>
              <div>
                <span className="text-[9px] text-[#fba41c] block uppercase">Mission Progress</span>
                <span className="font-bold text-sm text-emerald-400">{selectedUnit.progress}% Route Complete</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#bf7e4d]/20 text-xs font-mono">
            <span className="text-[#5c3a35]">Connected to FleetVision Satellite Orbital Network</span>
            <Link href={`/vehicles`}>
              <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#f7801b] to-[#e35020] text-white font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs">
                <span>View Full Telematics Diagnostics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
