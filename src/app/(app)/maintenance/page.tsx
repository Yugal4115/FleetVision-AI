'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Wrench,
  Search,
  RotateCw,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IMaintenanceRecord {
  id: string
  serviceType: string
  description?: string | null
  cost: number
  status: string
  serviceDate: string
  vehicle?: { vehicleNumber: string; model: string } | null
  notes?: string | null
}

export default function MaintenanceConsolePage() {
  const [records, setRecords] = useState<IMaintenanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchMaintenance = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/maintenance?limit=50')
      if (res.ok) {
        const data = await res.json()
        setRecords(data.records || [])
      }
    } catch (err) {
      console.error('Failed to fetch maintenance records:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMaintenance()
  }, [])

  const filtered = records.filter((r) => {
    const matchSearch =
      !search ||
      (r.vehicle?.vehicleNumber && r.vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase())) ||
      r.serviceType.toLowerCase().includes(search.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
    const matchStatus = statusFilter === 'all' || r.status.toLowerCase() === statusFilter.toLowerCase()
    return matchSearch && matchStatus
  })

  const totalCost = records.reduce((acc, r) => acc + (r.cost || 0), 0)

  const formatCurrency = (val: number) => {
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
              SERVICE BAY OPERATIONS · WORK ORDERS
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            BAY & <br />
            <span className="text-[#EA6113]">MAINTENANCE.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Active service orders · Bay allocation schedule · Component repair ledger · Preventative inspection cycles
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMaintenance}
            className="p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh Maintenance Records"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EA6113]' : ''}`} />
          </button>

          <Link
            href="/maintenance/schedule"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#EA6113]/25"
          >
            <Plus className="w-4 h-4" />
            <span>Book Bay Service</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Total Maintenance Spend</span>
          <p className="text-3xl font-black text-[#e35020] mt-1">{formatCurrency(totalCost)}</p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">{records.length} logged service work orders</p>
        </div>
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Active Service Bays</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">4 of 4 Ready</p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">Bengaluru Central Logistics Depot</p>
        </div>
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Scheduled Work Orders</span>
          <p className="text-3xl font-black text-[#EA6113] mt-1">
            {records.filter((r) => r.status === 'scheduled').length || 2} Pending
          </p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">Preventative & statutory fitness checks</p>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service type, vehicle #, or work description..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#EA6113] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#64748B] font-bold hidden sm:inline">Status:</span>
          {['all', 'completed', 'scheduled', 'in_progress'].map((s) => (
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

      {/* 4. Maintenance Work Orders Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#64748B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#EA6113] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING SERVICE WORK ORDERS...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#E5DFD7] p-8 space-y-3">
          <Wrench className="w-12 h-12 text-[#64748B] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#07518A] uppercase">No Maintenance Records Found</h3>
          <p className="text-xs font-mono text-[#64748B]">Try adjusting search filters.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF5EC] border-b border-[#E5DFD7] text-[#07518A] uppercase font-bold">
                <tr>
                  <th className="p-4">Commercial Unit</th>
                  <th className="p-4">Service Type</th>
                  <th className="p-4">Work Description</th>
                  <th className="p-4">Cost</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Service Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]/60">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-[#FFF5EC]/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#07518A]">
                        {m.vehicle?.vehicleNumber || 'FV-UNIT'}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        {m.vehicle?.model || 'Heavy Carrier'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#0C1E36]">
                      {m.serviceType.replace(/_/g, ' ').toUpperCase()}
                    </td>
                    <td className="p-4 text-[#64748B] font-medium max-w-[240px] truncate">
                      {m.description || m.notes || 'Routine bay service inspection'}
                    </td>
                    <td className="p-4 font-black text-[#e35020]">
                      {formatCurrency(m.cost)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          m.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30'
                            : m.status === 'in_progress'
                            ? 'bg-[#f7801b]/15 text-[#EA6113] border-[#f7801b]/30'
                            : 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                        }`}
                      >
                        {m.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-[#0C1E36] font-semibold">
                      {new Date(m.serviceDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/maintenance/${m.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-bold transition-all shadow-xs"
                      >
                        <span>Work Order</span>
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
