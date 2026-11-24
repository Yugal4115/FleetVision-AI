'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Truck,
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Fuel,
  Activity,
  User,
  ShieldCheck,
  Calendar,
  Gauge,
  ArrowRight,
  RotateCw,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'
import { getVehicleCardFrontImage } from '@/modules/vehicles/vehicleImageManifest'
import { PhotorealisticVehicleCard } from '@/modules/vehicles/PhotorealisticVehicleCard'

interface IVehicleRecord {
  id: string
  vehicleNumber: string
  model: string
  manufacturer: string
  registrationNumber: string
  fuelType: string
  engineDetails?: string | null
  odometer: number | null
  status: string
  company?: { name: string } | null
  _count?: { trips: number; maintenanceRecords: number; fuelLogs: number }
}

export default function VehicleCollectionPage() {
  const [vehicles, setVehicles] = useState<IVehicleRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [fuelFilter, setFuelFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const fetchVehicles = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/vehicles?limit=50')
      if (res.ok) {
        const data = await res.json()
        setVehicles(data.vehicles || [])
      }
    } catch (err) {
      console.error('Failed to fetch vehicles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [])

  // Filter vehicles
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      !search ||
      v.vehicleNumber.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.manufacturer.toLowerCase().includes(search.toLowerCase()) ||
      v.registrationNumber.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'all' || v.status.toLowerCase() === statusFilter.toLowerCase()

    const matchesFuel =
      fuelFilter === 'all' || v.fuelType.toLowerCase() === fuelFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesFuel
  })

  // 1:1 Matching Front Image from Vehicle Manifest
  const getVehicleImage = (v: IVehicleRecord) => {
    return getVehicleCardFrontImage(v)
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold'
      case 'available':
        return 'text-[#84492d] bg-[#FFF1E6] border-[#fba41c]/40 font-bold'
      case 'in_maintenance':
      case 'maintenance':
        return 'text-[#e35020] bg-orange-100 border-orange-300 font-bold'
      case 'out_of_service':
        return 'text-[#a02515] bg-red-100 border-red-300 font-bold'
      default:
        return 'text-[#5c3a35] bg-[#FFF8F2] border-[#bf7e4d]/30 font-bold'
    }
  }

  const getFuelBadge = (fuel: string) => {
    switch (fuel.toLowerCase()) {
      case 'electric':
        return 'text-[#84492d] bg-amber-100 border-[#fba41c] font-bold'
      case 'cng':
        return 'text-emerald-800 bg-emerald-100 border-emerald-300 font-bold'
      case 'diesel':
        return 'text-[#4d2e2a] bg-[#FFF1E6] border-[#bf7e4d]/40 font-bold'
      default:
        return 'text-[#2d140d] bg-[#FFF8F2] border-[#bf7e4d]/30 font-bold'
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Agenciex-Inspired Editorial Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="label-meta text-xs font-manrope font-semibold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              FLEET ASSETS · VEHICLE MANAGEMENT
            </span>
          </div>

          <h1 className="page-title text-4xl sm:text-6xl font-bold font-inter tracking-tight text-[#07518A] uppercase leading-[0.98]">
            VEHICLE <br />
            <span className="text-[#EA6113]">COLLECTION.</span>
          </h1>

          <p className="subtitle text-sm sm:text-base text-[#64748B] mt-3 font-manrope font-medium">
            Explore and manage your entire fleet. ·{' '}
            <span className="stat-highlight font-inter font-bold text-[#07518A]">
              {vehicles.length} Registered Commercial Units
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchVehicles}
            className="btn-action p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh Fleet Data"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <Link
            href="/vehicles/new"
            className="btn-action inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-manrope text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#EA6113]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Vehicle</span>
          </Link>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Real-time Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, model, plate, or manufacturer..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#EA6113] transition-colors"
          />
        </div>

        {/* Filter Pills & View Mode Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[#64748B] font-bold hidden sm:inline">Status:</span>
            {(['all', 'active', 'available', 'in_maintenance'] as const).map((s) => (
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

          {/* Fuel Filter */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[#64748B] font-bold hidden sm:inline">Fuel:</span>
            {(['all', 'electric', 'diesel', 'cng'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFuelFilter(f)}
                className={`px-3 py-1.5 rounded-xl uppercase transition-all font-bold ${
                  fuelFilter === f
                    ? 'bg-gradient-to-r from-[#EA6113] to-[#F7801B] text-white shadow-xs'
                    : 'bg-[#FFF5EC] text-[#0C1E36] hover:bg-[#FFE3B3]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] p-0.5 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-[#EA6113] shadow-xs' : 'text-[#64748B]'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table' ? 'bg-white text-[#EA6113] shadow-xs' : 'text-[#64748B]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Vehicles Display: Automotive Card Grid vs Table View */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#84492d]">
          <div className="w-8 h-8 rounded-full border-2 border-[#f7801b] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">SYNCHRONIZING VEHICLE FLEET...</p>
        </div>
      ) : filteredVehicles.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#bf7e4d]/25 p-8 space-y-3">
          <Truck className="w-12 h-12 text-[#bf7e4d] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#2d140d] uppercase">No Vehicles Matched</h3>
          <p className="text-xs font-mono text-[#5c3a35]">
            Adjust your search parameters or filter criteria to view units.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((v) => (
            <PhotorealisticVehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-3xl bg-white border border-[#bf7e4d]/25 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF5EC] border-b border-[#bf7e4d]/25 text-[#84492d] uppercase font-bold">
                <tr>
                  <th className="p-4">Vehicle ID</th>
                  <th className="p-4">Model & Manufacturer</th>
                  <th className="p-4">Plate</th>
                  <th className="p-4">Fuel</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Odometer</th>
                  <th className="p-4">Trips</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bf7e4d]/20">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FFF5EC] transition-colors">
                    <td className="p-4">
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="font-black text-[#f7801b] hover:underline"
                      >
                        {v.vehicleNumber}
                      </Link>
                    </td>
                    <td className="p-4 font-sans font-bold text-[#2d140d]">
                      {v.manufacturer} {v.model}
                    </td>
                    <td className="p-4 text-[#5c3a35] font-medium">{v.registrationNumber}</td>
                    <td className="p-4 uppercase font-bold text-[#4d2e2a]">{v.fuelType}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${getStatusBadge(
                          v.status
                        )}`}
                      >
                        {v.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-[#2d140d] font-bold">
                      {v.odometer ? `${v.odometer.toLocaleString()} km` : '—'}
                    </td>
                    <td className="p-4 font-extrabold text-[#84492d]">{v._count?.trips || 0}</td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/vehicles/${v.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f7801b] to-[#e35020] hover:from-[#e35020] hover:to-[#d33e1b] text-white font-bold transition-all shadow-xs"
                      >
                        <span>Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
