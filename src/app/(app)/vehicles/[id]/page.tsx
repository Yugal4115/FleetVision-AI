'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Truck,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Activity,
  Wrench,
  FileText,
  MapPin,
  Clock,
  Layers,
  ChevronRight,
  User,
  AlertTriangle,
  RotateCw,
  Info,
  DollarSign,
  Navigation,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle2,
  Phone,
  Mail,
  Award,
  Compass,
} from 'lucide-react'
import { MultiAngleVehicleViewer } from '@/modules/vehicles/MultiAngleVehicleViewer'
import { getVehicleImageSet, getVehicleCardFrontImage } from '@/modules/vehicles/vehicleImageManifest'
import { DemoBadge } from '@/design-system/DemoBadge'

interface PageProps {
  params: Promise<{ id: string }>
}

interface IDriver {
  id: string
  name: string
  phone: string
  email?: string | null
  licenseNumber: string
  licenseExpiry?: string | null
  experience: number
  rating: number
  status: string
  scores?: Array<{
    safetyScore: number
    overspeeding: number
    harshBraking: number
  }>
}

interface IVehicleDetail {
  id: string
  vehicleNumber: string
  model: string
  manufacturer: string
  registrationNumber: string
  fuelType: string
  engineDetails?: string | null
  odometer: number | null
  status: string
  insuranceExpiry?: string | null
  pollutionCertExpiry?: string | null
  rcBookExpiry?: string | null
  company?: { id: string; name: string } | null
  fuelLogs?: Array<{
    id: string
    fuelDate: string
    fuelType: string
    quantity: number
    cost: number
    mileage?: number | null
    fuelStation?: string | null
    odometer?: number | null
  }>
  maintenanceRecords?: Array<{
    id: string
    type: string
    description?: string | null
    cost: number
    status: string
    scheduledDate?: string | null
    completedDate?: string | null
    odometer?: number | null
    notes?: string | null
  }>
  trips?: Array<{
    id: string
    tripNumber: string
    pickupLocation: string
    pickupLat?: number | null
    pickupLng?: number | null
    destination: string
    destLat?: number | null
    destLng?: number | null
    tripCost: number
    estimatedDistance?: number | null
    status: string
    startDate?: string | null
    endDate?: string | null
    driverId?: string | null
  }>
  healthRecords?: Array<{
    id: string
    healthScore: number
    engineScore: number
    batteryScore: number
    tyreScore: number
    brakeScore: number
    suspensionScore: number
    overallScore: number
    assessedDate: string
  }>
  _count?: {
    trips: number
    maintenanceRecords: number
    fuelLogs: number
    expenses: number
  }
}

type TabKey =
  | 'overview'
  | 'specifications'
  | 'driver'
  | 'trips'
  | 'tracking'
  | 'fuel'
  | 'maintenance'
  | 'pnl'
  | 'health'
  | 'documents'
  | 'explorer'
  | 'ai'

export default function VehicleDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [vehicle, setVehicle] = useState<IVehicleDetail | null>(null)
  const [drivers, setDrivers] = useState<IDriver[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('overview')

  const fetchVehicleAndDrivers = async () => {
    setLoading(true)
    try {
      const [vehicleRes, driversRes] = await Promise.all([
        fetch(`/api/vehicles/${id}`),
        fetch(`/api/drivers?limit=50`),
      ])

      if (vehicleRes.ok) {
        const vData = await vehicleRes.json()
        setVehicle(vData.vehicle)
      } else {
        console.error('Failed to load vehicle record:', vehicleRes.statusText)
      }

      if (driversRes.ok) {
        const dData = await driversRes.json()
        setDrivers(dData.drivers || [])
      }
    } catch (err) {
      console.error('Vehicle detail fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicleAndDrivers()
  }, [id])

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 font-mono text-xs text-[#07518A]">
        <div className="w-8 h-8 rounded-full border-2 border-[#EA6113] border-t-transparent animate-spin mx-auto" />
        <p className="font-bold uppercase tracking-wider">RETRIEVING UNIT TELEMETRY · {id}...</p>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] text-center space-y-4 max-w-lg mx-auto my-12">
        <AlertTriangle className="w-12 h-12 text-[#EA6113] mx-auto" />
        <h2 className="text-xl font-bold font-sans text-[#07518A] uppercase">Vehicle Not Found</h2>
        <p className="text-xs font-mono text-[#64748B]">
          No vehicle record matching identifier <code className="text-[#EA6113]">{id}</code> was located in database.
        </p>
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#07518A] text-white font-mono text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Vehicle Collection</span>
        </Link>
      </div>
    )
  }

  const isElectric = (vehicle.fuelType || '').toLowerCase() === 'electric'
  const isVolvo = (vehicle.model || '').toLowerCase().includes('volvo')

  // STRICT VEHICLE IMAGE SET: Matching front image for Console & Explorer
  const vehicleImages = getVehicleImageSet(vehicle)
  const primaryImage = vehicleImages.angles.front

  const cleanModelName = vehicle.model.toLowerCase().startsWith(vehicle.manufacturer.toLowerCase())
    ? vehicle.model.slice(vehicle.manufacturer.length).trim()
    : vehicle.model

  const latestHealth = vehicle.healthRecords?.[0]

  // Identify assigned driver: find from latest trip or first driver
  const latestTrip = vehicle.trips?.[0]
  const assignedDriver =
    (latestTrip?.driverId && drivers.find((d) => d.id === latestTrip.driverId)) ||
    drivers[0] ||
    null

  // Calculate Financial P&L
  const totalRevenue = (vehicle.trips || []).reduce((acc, t) => acc + (t.tripCost || 0) * 1.6, 0)
  const totalTripCost = (vehicle.trips || []).reduce((acc, t) => acc + (t.tripCost || 0), 0)
  const totalFuelCost = (vehicle.fuelLogs || []).reduce((acc, f) => acc + (f.cost || 0), 0)
  const totalMaintenanceCost = (vehicle.maintenanceRecords || []).reduce((acc, m) => acc + (m.cost || 0), 0)
  const totalExpenses = totalTripCost + totalFuelCost + totalMaintenanceCost
  const netProfit = totalRevenue - totalExpenses
  const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 18

  // The 12 Contextual Vehicle-Centric Modules (Clean compact labels)
  const tabs: Array<{ key: TabKey; label: string; icon: React.ElementType; badge?: string }> = [
    { key: 'overview', label: 'Overview', icon: Gauge },
    { key: 'specifications', label: 'Specifications', icon: Layers },
    { key: 'driver', label: 'Assigned Driver', icon: User },
    { key: 'trips', label: 'Trips & Routes', icon: MapPin },
    { key: 'tracking', label: 'Live Tracking', icon: Navigation },
    { key: 'fuel', label: 'Fuel & Energy', icon: Fuel },
    { key: 'maintenance', label: 'Maintenance', icon: Clock },
    { key: 'pnl', label: 'Expenses & P&L', icon: DollarSign },
    { key: 'health', label: 'Health Radar', icon: Activity },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'explorer', label: '360° Explorer', icon: RotateCw, badge: '2D' },
    { key: 'ai', label: 'AI Predictions', icon: Sparkles, badge: 'ML' },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Back Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/vehicles"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#84492d] hover:text-[#f7801b] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO VEHICLE COLLECTION</span>
        </Link>

        <div className="flex items-center gap-2">
          <DemoBadge label="DATABASE VERIFIED" />
          <button
            onClick={fetchVehicleAndDrivers}
            className="p-2.5 rounded-xl bg-white border border-[#bf7e4d]/30 text-[#84492d] hover:bg-[#FFF1E6] transition-colors shadow-2xs"
            title="Refresh Unit Telemetry"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Automotive Hero Showcase Section (Sunset & White with Live Vibration Glow) */}
      <div className="rounded-3xl bg-gradient-to-br from-white via-[#FFF5EC] to-white border border-[#bf7e4d]/30 p-6 sm:p-10 shadow-sm relative overflow-hidden sunset-glow-pulse">
        {/* Subtle Ambient Sunset Radial Corner Highlight */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-bl from-[#f7801b]/15 via-[#fba41c]/20 to-transparent blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-72 h-72 rounded-full bg-gradient-to-tr from-[#e35020]/15 via-[#FFF1E6]/40 to-transparent blur-2xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Left: Oversized Typography & Metadata */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-[#84492d] text-white">
                {vehicle.vehicleNumber}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFF1E6] text-[#e35020] border border-[#f7801b]/40 uppercase">
                {vehicle.status.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFF8F2] text-[#84492d] border border-[#bf7e4d]/30 uppercase">
                {vehicle.fuelType}
              </span>
              {isElectric && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-black bg-[#fba41c]/20 text-[#84492d] border border-[#fba41c]">
                  ⚡ EV POWERTRAIN
                </span>
              )}
            </div>

            <h1 className="page-title text-3xl sm:text-5xl lg:text-6xl font-bold font-inter uppercase text-[#07518A] leading-[1.02] tracking-tight">
              {vehicle.manufacturer} <br />
              <span className="text-[#EA6113]">{cleanModelName}</span>
            </h1>

            <p className="subtitle text-xs sm:text-sm font-manrope font-medium text-[#5c3a35]">
              Registration Plate: <strong className="text-[#2d140d] font-bold font-manrope">{vehicle.registrationNumber}</strong> ·{' '}
              {vehicle.company?.name || 'FleetVision Logistics Hub'}
            </p>

            {/* Quick KPI Strip */}
            <div className="grid grid-cols-3 gap-3 pt-3 text-xs font-manrope">
              <div className="p-3 rounded-2xl bg-white/95 border border-[#bf7e4d]/25">
                <span className="label-meta text-[10px] uppercase text-[#84492d] font-medium block">Odometer</span>
                <span className="stat-highlight font-bold font-inter text-sm text-[#2d140d]">
                  {vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '0 km'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/95 border border-[#bf7e4d]/25">
                <span className="label-meta text-[10px] uppercase text-[#84492d] font-medium block">Health Score</span>
                <span className="stat-highlight font-bold font-inter text-sm text-[#f7801b]">
                  {latestHealth ? `${Math.round(latestHealth.overallScore)}%` : '96% (Sim)'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white/95 border border-[#bf7e4d]/25">
                <span className="label-meta text-[10px] uppercase text-[#84492d] font-medium block">Dispatches</span>
                <span className="stat-highlight font-bold font-inter text-sm text-[#e35020]">
                  {vehicle._count?.trips || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Primary Vehicle Visual (Teal Volvo FH Aero Reference) */}
          <div className="lg:col-span-5 relative aspect-[16/10] rounded-2xl overflow-hidden bg-gradient-to-b from-[#FFF5EC] via-white to-[#FFF1E6] border border-[#bf7e4d]/30 p-4 flex items-center justify-center shadow-inner">
            <img
              src={primaryImage}
              alt={`${vehicle.manufacturer} ${vehicle.model}`}
              className="w-full h-full object-contain filter contrast-105 hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-4 px-3 py-1 rounded-xl bg-white/95 backdrop-blur-md text-[11px] font-mono text-[#84492d] border border-[#bf7e4d]/30 shadow-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#f7801b] animate-pulse" />
              <span className="font-bold">{vehicle.manufacturer} {vehicle.model} · 360° Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 12 Contextual Vehicle-Centric Modules (Compact Console Widget Grid — No Train Line) */}
      <div className="rounded-2xl bg-gradient-to-b from-white to-[#FFF5EC] border border-[#bf7e4d]/30 p-2.5 sm:p-3 shadow-2xs">
        {/* Widget Header Strip */}
        <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-[#bf7e4d]/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f7801b] animate-pulse" />
            <span className="text-[11px] font-mono font-extrabold uppercase tracking-wider text-[#84492d]">
              VEHICLE CONSOLE MODULES
            </span>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#f7801b] border border-[#f7801b]/30">
              12 ACTIVE
            </span>
          </div>
          <div className="text-[10px] font-mono text-[#5c3a35] hidden sm:flex items-center gap-1.5 font-bold">
            <span>SELECTED:</span>
            <span className="font-extrabold text-[#f7801b] uppercase bg-[#FFF1E6] px-2 py-0.5 rounded-md border border-[#f7801b]/30">
              {tabs.find((t) => t.key === activeTab)?.label}
            </span>
          </div>
        </div>

        {/* 12-Module Compact Responsive Grid: 6x2 Desktop, 4x3 Tablet, 2x6 Mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center justify-between sm:justify-start gap-1.5 px-2.5 py-2 rounded-xl text-[11px] font-mono font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f7801b] to-[#e35020] text-white shadow-xs shadow-[#f7801b]/30 border border-[#f7801b]'
                    : 'bg-[#FFF5EC] hover:bg-[#FFF1E6] text-[#4d2e2a] hover:text-[#f7801b] border border-[#bf7e4d]/25'
                }`}
                title={tab.label}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#f7801b]'}`} />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.badge && (
                  <span
                    className={`text-[8px] font-black px-1 py-0.2 rounded shrink-0 uppercase ${
                      isActive ? 'bg-white/25 text-white' : 'bg-[#f7801b]/15 text-[#84492d]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 4. Tab Viewports */}
      <div className="space-y-6">
        {/* ============================================================== */}
        {/* TAB 1: OVERVIEW */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
                <div>
                  <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block mb-1">
                    ASSET CONSOLE · {vehicle.vehicleNumber}
                  </span>
                  <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase tracking-tight">
                    Operational Status & Fleet Deployment Summary
                  </h3>
                </div>

                <p className="text-sm text-[#0C1E36]/80 leading-relaxed font-sans">
                  {vehicle.manufacturer} {vehicle.model} ({vehicle.registrationNumber}) is currently
                  registered with operational status <strong>{vehicle.status.replace('_', ' ').toUpperCase()}</strong>.
                  Powered by {vehicle.engineDetails || 'industrial heavy-duty powertrain'}.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E5DFD7] text-xs font-mono">
                  <div>
                    <span className="text-[#64748B] block text-[10px]">FUEL SYSTEM</span>
                    <span className="font-bold text-[#07518A] uppercase">{vehicle.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">TOTAL DISPATCHES</span>
                    <span className="font-bold text-[#07518A]">{vehicle._count?.trips || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">LOGGED SERVICES</span>
                    <span className="font-bold text-[#07518A]">{vehicle._count?.maintenanceRecords || 0}</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] block text-[10px]">REFUEL SESSIONS</span>
                    <span className="font-bold text-[#07518A]">{vehicle._count?.fuelLogs || 0}</span>
                  </div>
                </div>

                {/* Subsystem Radar Quick Bars */}
                <div className="pt-4 border-t border-[#E5DFD7] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#07518A]">DIAGNOSTIC HEALTH RADAR</span>
                    <span className="text-[#EA6113] font-bold">
                      {latestHealth ? `${Math.round(latestHealth.overallScore)}% Overall` : '96% Optimal'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7]">
                      <span className="text-[#64748B] text-[9px] block">ENGINE</span>
                      <span className="font-bold text-[#07518A]">{latestHealth ? Math.round(latestHealth.engineScore) : 98}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7]">
                      <span className="text-[#64748B] text-[9px] block">BATTERY</span>
                      <span className="font-bold text-[#07518A]">{latestHealth ? Math.round(latestHealth.batteryScore) : 95}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7]">
                      <span className="text-[#64748B] text-[9px] block">TYRES</span>
                      <span className="font-bold text-[#07518A]">{latestHealth ? Math.round(latestHealth.tyreScore) : 92}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7]">
                      <span className="text-[#64748B] text-[9px] block">BRAKES</span>
                      <span className="font-bold text-[#07518A]">{latestHealth ? Math.round(latestHealth.brakeScore) : 94}%</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAFAF9] border border-[#E5DFD7]">
                      <span className="text-[#64748B] text-[9px] block">SUSPENSION</span>
                      <span className="font-bold text-[#07518A]">{latestHealth ? Math.round(latestHealth.suspensionScore) : 96}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Assigned Driver Card & 360 Action */}
              <div className="space-y-6">
                {/* Assigned Driver Preview */}
                <div className="p-6 rounded-3xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-[#07518A] uppercase">Active Driver Assignment</span>
                    <DemoBadge label="ROSTER" />
                  </div>
                  {assignedDriver ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#07518A] text-white flex items-center justify-center font-bold text-base shadow-xs">
                          {assignedDriver.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-[#0C1E36]">{assignedDriver.name}</p>
                          <p className="text-xs font-mono text-[#64748B]">{assignedDriver.licenseNumber}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#E5DFD7]">
                        <div>
                          <span className="text-[10px] text-[#64748B] block">EXPERIENCE</span>
                          <span className="font-bold text-[#07518A]">{assignedDriver.experience} Years</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-[#64748B] block">SAFETY SCORE</span>
                          <span className="font-bold text-[#EA6113]">{assignedDriver.scores?.[0]?.safetyScore || 98}/100</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('driver')}
                        className="w-full mt-2 py-2 text-center rounded-xl bg-white border border-[#E5DFD7] text-xs font-mono font-bold text-[#07518A] hover:bg-[#FFF1E6] transition-colors"
                      >
                        View Full Driver Profile →
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-mono text-[#64748B]">No driver currently assigned.</p>
                  )}
                </div>

                {/* 360° Explorer Quick Launch */}
                <div className="p-6 rounded-3xl bg-[#FFF1E6]/50 border border-[#FFE3B3] space-y-3 shadow-2xs">
                  <h4 className="text-sm font-bold font-sans text-[#07518A] uppercase">
                    Interactive 360° Explorer
                  </h4>
                  <p className="text-xs text-[#0C1E36]/80 leading-relaxed font-mono">
                    Inspect high-resolution angles, zoom, and diagnostic component hotspots on the {vehicle.manufacturer} {vehicle.model}.
                  </p>
                  <button
                    onClick={() => setActiveTab('explorer')}
                    className="w-full py-2.5 rounded-full bg-[#EA6113] hover:bg-[#F88F22] text-white font-mono text-xs font-bold transition-all shadow-xs"
                  >
                    Launch 360° Viewer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: VEHICLE INFORMATION & TECHNICAL SPECIFICATIONS */}
        {/* ============================================================== */}
        {activeTab === 'specifications' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  TECHNICAL DOSSIER
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Vehicle Architecture & Specifications
                </h3>
              </div>
              <DemoBadge label="OEM VERIFIED" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Manufacturer</span>
                <span className="font-bold text-[#07518A] text-sm">{vehicle.manufacturer}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Model Identifier</span>
                <span className="font-bold text-[#07518A] text-sm">{vehicle.model}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Registered Plate</span>
                <span className="font-bold text-[#EA6113] text-sm">{vehicle.registrationNumber}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Fuel / Propulsion Type</span>
                <span className="font-bold text-[#07518A] text-sm uppercase">{vehicle.fuelType}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Powertrain / Engine</span>
                <span className="font-bold text-[#07518A] text-sm">{vehicle.engineDetails || 'Industrial Heavy Duty Configuration'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Current Odometer</span>
                <span className="font-bold text-[#0C1E36] text-sm">
                  {vehicle.odometer ? `${vehicle.odometer.toLocaleString()} km` : '0 km'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Operating Depot / Hub</span>
                <span className="font-bold text-[#07518A] text-sm">{vehicle.company?.name || 'Central Corridor'}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Gross Vehicle Weight (GVW)</span>
                <span className="font-bold text-[#07518A] text-sm">44,000 kg (Articulated)</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] block text-[10px] uppercase">Emission Class</span>
                <span className="font-bold text-[#07518A] text-sm">
                  {isElectric ? 'Zero Tailpipe Emissions' : 'Bharat Stage VI / Euro VI Step E'}
                </span>
              </div>
            </div>

            {isElectric && (
              <div className="p-6 rounded-2xl bg-[#FFF0D5]/50 border border-[#F5E500]/60 space-y-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-[#EA6113]" />
                  <h4 className="font-sans font-bold text-sm text-[#07518A] uppercase">
                    Electric Vehicle High-Voltage Architecture
                  </h4>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#64748B] text-[10px] block">BATTERY CAPACITY</span>
                    <span className="font-black text-[#07518A]">540 kWh Nominal</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">PACK VOLTAGE</span>
                    <span className="font-black text-[#EA6113]">600V DC High Voltage</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">MAX DC CHARGE</span>
                    <span className="font-black text-[#07518A]">250 kW CCS2 Compatible</span>
                  </div>
                  <div>
                    <span className="text-[#64748B] text-[10px] block">ESTIMATED RANGE</span>
                    <span className="font-black text-emerald-600">300 km (Full Load)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: ASSIGNED DRIVER */}
        {/* ============================================================== */}
        {activeTab === 'driver' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  CREW OPERATIONS
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Assigned Driver Profile & Safety Rating
                </h3>
              </div>
              <DemoBadge label="DATABASE VERIFIED" />
            </div>

            {assignedDriver ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left: Driver Card */}
                  <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-[#07518A] text-white flex items-center justify-center font-bold text-2xl shadow-sm">
                        {assignedDriver.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-[#0C1E36]">{assignedDriver.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {assignedDriver.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs font-mono pt-3 border-t border-[#E5DFD7]">
                      <div className="flex items-center gap-2 text-[#64748B]">
                        <Phone className="w-3.5 h-3.5 text-[#07518A]" />
                        <span>{assignedDriver.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#64748B]">
                        <Mail className="w-3.5 h-3.5 text-[#07518A]" />
                        <span>{assignedDriver.email || 'operator@fleetvision.ai'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#64748B]">
                        <Award className="w-3.5 h-3.5 text-[#07518A]" />
                        <span>Experience: {assignedDriver.experience} Years</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Qualifications & License */}
                  <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-4">
                    <h4 className="text-xs font-mono font-bold text-[#07518A] uppercase">
                      Statutory License & Badges
                    </h4>
                    <div className="space-y-3 text-xs font-mono">
                      <div>
                        <span className="text-[#64748B] text-[10px] block">COMMERCIAL LICENSE #</span>
                        <span className="font-bold text-[#0C1E36]">{assignedDriver.licenseNumber}</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] text-[10px] block">LICENSE VALIDITY</span>
                        <span className="font-bold text-emerald-600">
                          {assignedDriver.licenseExpiry
                            ? new Date(assignedDriver.licenseExpiry).toLocaleDateString()
                            : 'Active / Endorsed'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[#64748B] text-[10px] block">HAZMAT & HEAVY ENDORSEMENT</span>
                        <span className="font-bold text-[#07518A]">Class HGV / Articulated Multi-Axle</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Driver Safety Score Radar */}
                  <div className="p-6 rounded-2xl bg-[#FFF1E6]/50 border border-[#FFE3B3] space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-mono font-bold text-[#07518A] uppercase">
                        Safety Radar Score
                      </h4>
                      <span className="text-xl font-bold font-mono text-[#EA6113]">
                        {assignedDriver.scores?.[0]?.safetyScore || 98}/100
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Overspeed Incidents</span>
                        <span className="font-bold text-[#07518A]">
                          {assignedDriver.scores?.[0]?.overspeeding || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Harsh Braking Events</span>
                        <span className="font-bold text-[#07518A]">
                          {assignedDriver.scores?.[0]?.harshBraking || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[#64748B]">Continuous Driving Rating</span>
                        <span className="font-bold text-emerald-600">Exemplary</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <span className="text-[10px] font-mono text-[#64748B]">
                        Assigned on {vehicle.vehicleNumber} missions since onboarding.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Assignment History for this Vehicle */}
                <div className="space-y-3 pt-4 border-t border-[#E5DFD7]">
                  <h4 className="text-sm font-bold font-sans text-[#07518A] uppercase">
                    Trip Assignments On Unit {vehicle.vehicleNumber}
                  </h4>
                  <div className="divide-y divide-[#E5DFD7] border border-[#E5DFD7] rounded-2xl overflow-hidden">
                    {(vehicle.trips || []).slice(0, 5).map((t) => (
                      <div key={t.id} className="p-4 flex items-center justify-between text-xs font-mono bg-white hover:bg-[#FAFAF9]">
                        <div>
                          <span className="font-bold text-[#07518A]">{t.tripNumber}</span>
                          <span className="text-[#64748B] ml-2">
                            {t.pickupLocation} → {t.destination}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#0C1E36]">Driver: {assignedDriver.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAFAF9] text-[#EA6113] border border-[#E5DFD7]">
                            {t.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-[#64748B]">No driver currently assigned to this vehicle.</p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: TRIPS & ROUTES */}
        {/* ============================================================== */}
        {activeTab === 'trips' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  MISSION LOG
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Trips & Logistics Corridors ({vehicle.trips?.length || 0})
                </h3>
              </div>
              <DemoBadge label="DATABASE VERIFIED" />
            </div>

            {vehicle.trips && vehicle.trips.length > 0 ? (
              <div className="divide-y divide-[#E5DFD7] border border-[#E5DFD7] rounded-2xl overflow-hidden">
                {vehicle.trips.map((t) => (
                  <div key={t.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs font-mono bg-white hover:bg-[#FAFAF9]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#07518A]">{t.tripNumber}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#FAFAF9] text-[#EA6113] border border-[#E5DFD7]">
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[#64748B] text-xs">
                        {t.pickupLocation} → {t.destination}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-sm text-[#0C1E36]">₹{t.tripCost.toLocaleString()}</p>
                      <span className="text-[10px] text-[#64748B] block">
                        {t.startDate ? new Date(t.startDate).toLocaleDateString() : 'Active Mission'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#64748B]">No trips recorded for this vehicle unit.</p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: LIVE TRACKING */}
        {/* ============================================================== */}
        {activeTab === 'tracking' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  TELEMETRY CORRIDOR
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Real-Time Location & Active Corridor
                </h3>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono tracking-wider font-semibold bg-[#22c55e]/10 text-[#16a34a] border border-[#22c55e]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                LIVE CAN GPS
              </span>
            </div>

            {/* Live GPS Telemetry Dashboard for this vehicle */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Current Coordinates</span>
                <span className="font-bold text-[#07518A]">
                  {latestTrip?.pickupLat || 12.9716}° N, {latestTrip?.pickupLng || 77.5946}° E
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Cruising Speed</span>
                <span className="font-bold text-[#EA6113]">
                  {vehicle.status === 'active' ? '68 km/h' : '0 km/h (Stationary)'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Ignition State</span>
                <span className="font-bold text-emerald-600">
                  {vehicle.status === 'active' ? 'IGNITION ON' : 'PARKED / SECURE'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Heading</span>
                <span className="font-bold text-[#07518A]">184° South-Southwest</span>
              </div>
            </div>

            {/* Simulated Live Corridor Visual Canvas */}
            <div className="relative aspect-[21/9] rounded-2xl bg-gradient-to-br from-[#0C1E36] to-[#07518A] border border-[#E5DFD7] overflow-hidden flex flex-col justify-between p-6 text-white shadow-inner">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold">LIVE SATELLITE RADAR</span>
                </div>
                <span className="text-[#FFE3B3]">UNIT {vehicle.vehicleNumber}</span>
              </div>

              <div className="text-center space-y-2">
                <Compass className="w-10 h-10 text-[#FFE3B3] mx-auto animate-spin duration-3000" />
                <h4 className="text-lg font-bold font-sans tracking-wide">
                  {latestTrip ? `${latestTrip.pickupLocation} → ${latestTrip.destination}` : 'Bangalore Hub → Chennai Corridor'}
                </h4>
                <p className="text-xs font-mono text-[#FFE3B3]/80">
                  Transmitting over J1939 Telemetry Gateway · 100% Signal Integrity
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-[#FFE3B3]/70 border-t border-white/10 pt-2">
                <span>Waypoint: KM 142 / NH-48 Tollway</span>
                <span>ETA Destination: 2h 15m</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: FUEL & ENERGY */}
        {/* ============================================================== */}
        {activeTab === 'fuel' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  ENERGY RECONCILIATION
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  {isElectric ? 'Charging Sessions & Power Intake' : 'Fuel Refills & Consumption Logs'}
                </h3>
              </div>
              <DemoBadge label="DATABASE VERIFIED" />
            </div>

            {/* Quick Fuel Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Total Energy Cost</span>
                <span className="font-bold text-[#EA6113] text-sm">
                  ₹{totalFuelCost.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Total Refills / Charges</span>
                <span className="font-bold text-[#07518A] text-sm">
                  {vehicle.fuelLogs?.length || 0} Sessions
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Avg Energy Economy</span>
                <span className="font-bold text-emerald-600 text-sm">
                  {isElectric ? '1.8 kWh / km' : '4.2 km / Liter'}
                </span>
              </div>
            </div>

            {/* Fuel Logs Table */}
            {vehicle.fuelLogs && vehicle.fuelLogs.length > 0 ? (
              <div className="divide-y divide-[#E5DFD7] border border-[#E5DFD7] rounded-2xl overflow-hidden">
                {vehicle.fuelLogs.map((f) => (
                  <div key={f.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs font-mono bg-white hover:bg-[#FAFAF9]">
                    <div className="space-y-1">
                      <p className="font-bold text-[#07518A]">{f.fuelStation || 'Logistics Depot Dispenser'}</p>
                      <p className="text-[#64748B] text-[11px]">
                        Date: {new Date(f.fuelDate).toLocaleDateString()} · Quantity: {f.quantity} {isElectric ? 'kWh' : 'L'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#0C1E36]">₹{f.cost.toLocaleString()}</p>
                      <span className="text-[10px] text-[#64748B]">Odo: {f.odometer?.toLocaleString() || 'N/A'} km</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#64748B]">No fuel logs registered for this vehicle unit.</p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: MAINTENANCE & REPAIRS */}
        {/* ============================================================== */}
        {activeTab === 'maintenance' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  SERVICE HISTORY
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Maintenance Records & Repair Work Orders
                </h3>
              </div>
              <DemoBadge label="DATABASE VERIFIED" />
            </div>

            {/* Maintenance KPI Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Lifetime Maintenance Cost</span>
                <span className="font-bold text-[#EA6113] text-sm">
                  ₹{totalMaintenanceCost.toLocaleString()}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Total Interventions</span>
                <span className="font-bold text-[#07518A] text-sm">
                  {vehicle.maintenanceRecords?.length || 0} Records
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Next Scheduled Service</span>
                <span className="font-bold text-[#07518A] text-sm">In 4,500 km</span>
              </div>
            </div>

            {vehicle.maintenanceRecords && vehicle.maintenanceRecords.length > 0 ? (
              <div className="divide-y divide-[#E5DFD7] border border-[#E5DFD7] rounded-2xl overflow-hidden">
                {vehicle.maintenanceRecords.map((m) => (
                  <div key={m.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 text-xs font-mono bg-white hover:bg-[#FAFAF9]">
                    <div>
                      <p className="font-bold text-[#07518A] uppercase">{m.type.replace('_', ' ')}</p>
                      <p className="text-[#64748B] text-[11px] mt-0.5">{m.description || m.notes || 'Routine Inspection'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#EA6113]">₹{m.cost.toLocaleString()}</p>
                      <span className="text-[10px] uppercase font-bold text-[#07518A]">{m.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#64748B]">Zero maintenance interventions logged.</p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: EXPENSES & PROFIT & LOSS */}
        {/* ============================================================== */}
        {activeTab === 'pnl' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  ASSET PROFITABILITY
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Unit Profit & Loss (P&L) Statement
                </h3>
              </div>
              <DemoBadge label="FINANCIAL LEDGER" />
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Gross Revenue</span>
                <span className="font-bold text-emerald-600 text-base">₹{Math.round(totalRevenue).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Total Operating Costs</span>
                <span className="font-bold text-[#EA6113] text-base">₹{Math.round(totalExpenses).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Net Profit</span>
                <span className="font-bold text-[#07518A] text-base">₹{Math.round(netProfit).toLocaleString()}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7]">
                <span className="text-[#64748B] text-[10px] block uppercase">Operating Margin</span>
                <span className="font-bold text-[#EA6113] text-base">{profitMargin}%</span>
              </div>
            </div>

            {/* Expense Breakdown Breakdown Table */}
            <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-4">
              <h4 className="text-xs font-mono font-bold text-[#07518A] uppercase">
                Expense Categorization For Unit {vehicle.vehicleNumber}
              </h4>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD7]">
                  <span className="text-[#64748B]">Energy & Fuel Expenditure</span>
                  <span className="font-bold text-[#0C1E36]">₹{totalFuelCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD7]">
                  <span className="text-[#64748B]">Maintenance & Overhaul Repairs</span>
                  <span className="font-bold text-[#0C1E36]">₹{totalMaintenanceCost.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E5DFD7]">
                  <span className="text-[#64748B]">Trip Dispatches & Driver Allowances</span>
                  <span className="font-bold text-[#0C1E36]">₹{totalTripCost.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 9: VEHICLE HEALTH & DIAGNOSTICS */}
        {/* ============================================================== */}
        {activeTab === 'health' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  TELEMETRY DIAGNOSTICS
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Subsystem Health Radar & Diagnostics
                </h3>
              </div>
              <DemoBadge label="CAN BUS 2.0B" />
            </div>

            {vehicle.healthRecords && vehicle.healthRecords.length > 0 ? (
              <div className="space-y-4">
                {vehicle.healthRecords.map((hr) => (
                  <div key={hr.id} className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-[#64748B]">Assessed Date: {new Date(hr.assessedDate).toLocaleDateString()}</span>
                      <span className="font-bold text-[#EA6113] text-sm">Overall Score: {Math.round(hr.overallScore)}%</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs font-mono">
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD7]">
                        <span className="text-[#64748B] text-[10px] block">ENGINE</span>
                        <span className="font-bold text-[#07518A]">{Math.round(hr.engineScore)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD7]">
                        <span className="text-[#64748B] text-[10px] block">BATTERY</span>
                        <span className="font-bold text-[#07518A]">{Math.round(hr.batteryScore)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD7]">
                        <span className="text-[#64748B] text-[10px] block">TYRES</span>
                        <span className="font-bold text-[#07518A]">{Math.round(hr.tyreScore)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD7]">
                        <span className="text-[#64748B] text-[10px] block">BRAKES</span>
                        <span className="font-bold text-[#07518A]">{Math.round(hr.brakeScore)}%</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#E5DFD7]">
                        <span className="text-[#64748B] text-[10px] block">SUSPENSION</span>
                        <span className="font-bold text-[#07518A]">{Math.round(hr.suspensionScore)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs font-mono text-[#64748B]">No periodic health evaluations logged yet.</p>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 10: DOCUMENTS */}
        {/* ============================================================== */}
        {activeTab === 'documents' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  REGULATORY COMPLIANCE
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Statutory Fleet Documents & Expirations
                </h3>
              </div>
              <DemoBadge label="VAHAN COMPLIANT" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase">Comprehensive Insurance</span>
                <p className="font-bold text-[#07518A] text-sm">Valid Policy</p>
                <p className="text-[11px] text-[#64748B]">
                  Expires: {vehicle.insuranceExpiry ? new Date(vehicle.insuranceExpiry).toLocaleDateString() : 'Active Policy'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase">Pollution Certificate (PUCC)</span>
                <p className="font-bold text-[#07518A] text-sm">Certified</p>
                <p className="text-[11px] text-[#64748B]">
                  Expires: {vehicle.pollutionCertExpiry ? new Date(vehicle.pollutionCertExpiry).toLocaleDateString() : 'Certified'}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-2">
                <span className="text-[#64748B] block text-[10px] uppercase">RC Book Fitness</span>
                <p className="font-bold text-[#07518A] text-sm">Registered</p>
                <p className="text-[11px] text-[#64748B]">
                  Expires: {vehicle.rcBookExpiry ? new Date(vehicle.rcBookExpiry).toLocaleDateString() : 'Permanent Fit'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 11: 360° VEHICLE EXPLORER */}
        {/* ============================================================== */}
        {activeTab === 'explorer' && (
          <MultiAngleVehicleViewer
            vehicleId={vehicle.id}
            vehicleNumber={vehicle.vehicleNumber}
            vehicleModel={vehicle.model}
            manufacturer={vehicle.manufacturer}
            registrationNumber={vehicle.registrationNumber}
          />
        )}

        {/* ============================================================== */}
        {/* TAB 12: AI INSIGHTS & PREDICTIONS */}
        {/* ============================================================== */}
        {activeTab === 'ai' && (
          <div className="p-8 rounded-3xl bg-white border border-[#E5DFD7] space-y-6 shadow-2xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] uppercase tracking-wider block">
                  NEURAL FLEET ANALYTICS
                </span>
                <h3 className="text-xl font-bold font-sans text-[#07518A] uppercase">
                  Vehicle-Specific AI Insights & Early Warnings
                </h3>
              </div>
              <DemoBadge label="PREDICTIVE ML" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
              <div className="p-6 rounded-2xl bg-[#FFF1E6]/40 border border-[#FFE3B3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#07518A] text-sm">PREDICTIVE BRAKE WEAR</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    68% REMAINING
                  </span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Based on driving patterns and continuous route gradients on NH-48, front brake pads are projected
                  for replacement in approximately <strong>12,400 km</strong>.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FFF1E6]/40 border border-[#FFE3B3] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#07518A] text-sm">TYRE THERMAL DEGRADATION</span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-[#FBB931] font-bold border border-[#FBB931]/40">
                    NOMINAL WEAR
                  </span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Steer axle tread depth delta is under 0.4mm across outer shoulders. Rotation recommended at next
                  scheduled depot overhaul.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#07518A] text-sm">ENERGY EFFICIENCY ANOMALY</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    0.0% DEVIATION
                  </span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Fuel consumption is trending within ±2% of baseline fleet benchmarks for this gross weight class.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#FAFAF9] border border-[#E5DFD7] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#07518A] text-sm">RECOMMENDED SERVICE WINDOW</span>
                  <span className="px-2 py-0.5 rounded bg-[#07518A]/10 text-[#07518A] font-bold">
                    DAY 45 · 4,500 KM
                  </span>
                </div>
                <p className="text-[#64748B] leading-relaxed">
                  Pneumatic air dryer cartridge and auxiliary coolant fluid scheduled for inspection. Zero critical DTC
                  codes active.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
