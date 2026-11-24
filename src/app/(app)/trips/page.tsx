'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Search,
  Plus,
  RotateCw,
  Truck,
  ArrowRight,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface ITrip {
  id: string
  tripNumber?: string
  pickupLocation: string
  destination: string
  status: string
  tripCost: number | null
  cargoDescription?: string | null
  scheduledDate?: string | null
  vehicle?: { vehicleNumber: string; model: string } | null
  driver?: { name: string; phone: string } | null
}

export default function TripManagementPage() {
  const [trips, setTrips] = useState<ITrip[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchTrips = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/trips?limit=50')
      if (res.ok) {
        const data = await res.json()
        setTrips(data.trips || [])
      }
    } catch (err) {
      console.error('Failed to fetch trips:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const filtered = trips.filter((t) => {
    const matchSearch =
      !search ||
      (t.tripNumber && t.tripNumber.toLowerCase().includes(search.toLowerCase())) ||
      t.pickupLocation.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase()) ||
      (t.driver?.name && t.driver.name.toLowerCase().includes(search.toLowerCase())) ||
      (t.vehicle?.vehicleNumber && t.vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  const formatCurrency = (val: number | null) => {
    if (!val) return '—'
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              LOGISTICS MISSIONS · DISPATCH CONSOLE
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            TRIP <br />
            <span className="text-[#EA6113]">MANAGEMENT.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Active freight corridors · Scheduled dispatches · Driver manifests · Financial logistics tracking
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchTrips}
            className="p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh Trips"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EA6113]' : ''}`} />
          </button>

          <Link
            href="/trips/new"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#EA6113]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Dispatch New Mission</span>
          </Link>
        </div>
      </div>

      {/* 2. Controls Bar */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manifest #, origin, destination, driver, or vehicle..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#EA6113] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#64748B] font-bold hidden sm:inline">Status:</span>
          {['all', 'in_progress', 'scheduled', 'completed'].map((s) => (
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

      {/* 3. Dispatches Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#64748B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#EA6113] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING LOGISTICS MANIFESTS...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#E5DFD7] p-8 space-y-3">
          <MapPin className="w-12 h-12 text-[#64748B] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#07518A] uppercase">No Dispatches Found</h3>
          <p className="text-xs font-mono text-[#64748B]">Try adjusting search filters or corridor status.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF5EC] border-b border-[#E5DFD7] text-[#07518A] uppercase font-bold">
                <tr>
                  <th className="p-4">Manifest #</th>
                  <th className="p-4">Freight Corridor</th>
                  <th className="p-4">Commercial Unit</th>
                  <th className="p-4">Operator</th>
                  <th className="p-4">Freight Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]/60">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-[#FFF5EC]/60 transition-colors">
                    <td className="p-4">
                      <span className="font-black text-[#EA6113]">
                        #{t.tripNumber || t.id.slice(-6)}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-[#0C1E36]">
                        {t.pickupLocation} <span className="text-[#EA6113] mx-1">→</span> {t.destination}
                      </div>
                      {t.cargoDescription && (
                        <span className="text-[10px] text-[#64748B] block truncate max-w-[200px]">
                          {t.cargoDescription}
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#07518A]">
                        {t.vehicle?.vehicleNumber || 'FV-UNIT'}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        {t.vehicle?.model || 'Commercial Carrier'}
                      </span>
                    </td>
                    <td className="p-4 text-[#0C1E36] font-semibold">
                      {t.driver?.name || 'Assigned Driver'}
                    </td>
                    <td className="p-4 font-black text-emerald-700">
                      {formatCurrency(t.tripCost)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          t.status === 'in_progress'
                            ? 'bg-[#f7801b]/15 text-[#EA6113] border-[#f7801b]/30'
                            : t.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                        }`}
                      >
                        {t.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/trips/${t.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-bold transition-all shadow-xs"
                      >
                        <span>Manifest</span>
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
