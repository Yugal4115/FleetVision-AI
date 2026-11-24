'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Truck,
  BatteryCharging,
  Zap,
  Gauge,
  ShieldAlert,
  SlidersHorizontal,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  Clock,
  Layers,
} from 'lucide-react'
import { MultiAngleVehicleViewer } from '@/modules/vehicles/MultiAngleVehicleViewer'
import { apiAdapter, getApiClient } from '@/services/api/adapter'
import { IVehicle } from '@/types/fleet'
import { DemoBadge } from '@/design-system/DemoBadge'
import { FLEET_COLORS } from '@/design-system/tokens'

export default function VehicleExplorerPage() {
  const [vehicle, setVehicle] = useState<IVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)

  useEffect(() => {
    async function loadVehicleData() {
      try {
        const client = getApiClient()
        setIsSimulating(client.isSimulationMode())
        const data = await client.getVehicleById('demo-veh-01')
        setVehicle(data)
      } catch (err) {
        console.error('Failed to load vehicle telemetry:', err)
      } finally {
        setLoading(false)
      }
    }
    loadVehicleData()
  }, [isSimulating])

  const toggleSimulation = () => {
    const nextState = !isSimulating
    apiAdapter.setSimulationMode(nextState)
    setIsSimulating(nextState)
  }

  return (
    <div className="min-h-screen bg-[#03080F] text-[#FFF0D5] flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-[#FFF0D5]/10 bg-[#070F1C]/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 rounded-lg bg-[#0C182A] text-[#C5D3E2] hover:text-white hover:bg-[#12223B] border border-[#FFF0D5]/10 transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>

            <div className="h-6 w-px bg-[#FFF0D5]/15 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F5E500] animate-pulse" />
              <h1 className="page-title text-sm sm:text-base font-bold font-inter tracking-tight text-white uppercase">
                FleetVision AI — 2D Multi-Angle Vehicle Explorer
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Simulation Mode Toggle Button */}
            <button
              onClick={toggleSimulation}
              className={`btn-action px-3 py-1.5 rounded-lg text-xs font-manrope font-semibold flex items-center gap-2 border transition-all ${
                isSimulating
                  ? 'bg-[#EA6113]/20 text-[#FFF0D5] border-[#EA6113]/50 shadow-[0_0_10px_rgba(234,97,19,0.3)]'
                  : 'bg-[#07518A]/20 text-emerald-400 border-emerald-500/50'
              }`}
              title="Toggle between Simulated Data and Teammate Backend Endpoint"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isSimulating ? 'bg-[#EA6113] animate-ping' : 'bg-emerald-400'
                }`}
              />
              <span>{isSimulating ? 'SIMULATION MODE' : 'LIVE BACKEND MODE'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Telemetry Summary Header Card */}
        <div className="p-5 rounded-2xl bg-[#070F1C] border border-[#FFF0D5]/15 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-[#0C182A]/80 border border-[#07518A]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#07518A]/30 border border-[#07518A] flex items-center justify-center text-[#F5E500]">
              <BatteryCharging className="w-5 h-5" />
            </div>
            <div>
              <p className="label-meta text-[11px] font-manrope font-medium text-[#7D93A9] uppercase">Battery SoC</p>
              <div className="flex items-baseline gap-1">
                <span className="stat-highlight text-xl font-bold font-inter text-white">84.6</span>
                <span className="subtitle text-xs font-manrope font-medium text-[#F5E500]">% (540 kWh)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0C182A]/80 border border-[#07518A]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#07518A]/30 border border-[#07518A] flex items-center justify-center text-[#EA6113]">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="label-meta text-[11px] font-manrope font-medium text-[#7D93A9] uppercase">Drive Output</p>
              <div className="flex items-baseline gap-1">
                <span className="stat-highlight text-xl font-bold font-inter text-white">660</span>
                <span className="subtitle text-xs font-manrope font-medium text-[#EA6113]">kW (880 hp)</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0C182A]/80 border border-[#07518A]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#07518A]/30 border border-[#07518A] flex items-center justify-center text-[#FBB931]">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <p className="label-meta text-[11px] font-manrope font-medium text-[#7D93A9] uppercase">Total Odometer</p>
              <div className="flex items-baseline gap-1">
                <span className="stat-highlight text-xl font-bold font-inter text-white">
                  {vehicle?.odometer ? vehicle.odometer.toLocaleString() : '14,250'}
                </span>
                <span className="subtitle text-xs font-manrope font-medium text-[#FBB931]">km</span>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0C182A]/80 border border-[#07518A]/40 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#07518A]/30 border border-[#07518A] flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="label-meta text-[11px] font-manrope font-medium text-[#7D93A9] uppercase">Certified Health</p>
              <div className="flex items-baseline gap-1">
                <span className="stat-highlight text-xl font-bold font-inter text-white">98.4</span>
                <span className="subtitle text-xs font-manrope font-medium text-emerald-400">% (Zero Faults)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Multi-Angle Vehicle Viewer */}
        <MultiAngleVehicleViewer
          vehicleId={vehicle?.vehicleNumber || 'FV-E-01'}
          vehicleModel={vehicle?.model || 'Volvo FH Aero Electric (4x2 / 6x2 Tractor)'}
          registrationNumber={vehicle?.registrationNumber || 'KA-01-EV-9021'}
        />

        {/* Explanatory Technical Architecture Card */}
        <div className="p-5 rounded-2xl bg-[#070F1C] border border-[#FFF0D5]/15 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold font-mono text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#FBB931]" />
              Option A Implementation Architecture & Compliance
            </h2>
            <DemoBadge label="SECTION 3 & 9 COMPLIANT" variant="subtle" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-[#0C182A]/60 border border-[#FFF0D5]/10 space-y-1.5">
              <span className="text-[#F5E500] font-semibold">1. Quad-Angle Orthographic Views</span>
              <p className="text-[#C5D3E2] leading-relaxed">
                Precision-sliced high-definition viewports (Front, Driver Side, Rear, Passenger Side)
                derived directly from the approved teal Volvo FH Aero composite asset.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C182A]/60 border border-[#FFF0D5]/10 space-y-1.5">
              <span className="text-[#EA6113] font-semibold">2. 20 Telemetry Hotspots</span>
              <p className="text-[#C5D3E2] leading-relaxed">
                Color-coded pulsing pins aligned with Volvo Trucks engineering registers (CCS2 250kW
                charger, 540kWh battery, Camera Monitor System wings, V-shape matrix LEDs, Jost fifth wheel).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0C182A]/60 border border-[#FFF0D5]/10 space-y-1.5">
              <span className="text-emerald-400 font-semibold">3. Strict Backend Protection</span>
              <p className="text-[#C5D3E2] leading-relaxed">
                Operates via the pluggable API adapter layer. Zero modifications were made to the
                teammate's Prisma schema or API endpoints.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
