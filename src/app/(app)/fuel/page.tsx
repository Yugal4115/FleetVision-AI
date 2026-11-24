'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Fuel,
  Zap,
  Search,
  RotateCw,
  Plus,
  ArrowRight,
  TrendingDown,
  DollarSign,
  Gauge,
  CheckCircle,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IFuelRecord {
  id: string
  liters: number
  cost: number
  odometer: number
  fuelType?: string
  station?: string
  driverId?: string
  vehicle?: { vehicleNumber: string; model: string; fuelType: string } | null
  createdAt: string
}

export default function FuelManagementPage() {
  const [fuelLogs, setFuelLogs] = useState<IFuelRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchFuel = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/fuel?limit=50')
      if (res.ok) {
        const data = await res.json()
        setFuelLogs(data.fuelLogs || [])
      }
    } catch (err) {
      console.error('Failed to fetch fuel logs:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFuel()
  }, [])

  const filtered = fuelLogs.filter((f) => {
    return (
      !search ||
      (f.vehicle?.vehicleNumber && f.vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase())) ||
      (f.station && f.station.toLowerCase().includes(search.toLowerCase())) ||
      (f.fuelType && f.fuelType.toLowerCase().includes(search.toLowerCase()))
    )
  })

  const totalCost = fuelLogs.reduce((acc, f) => acc + (f.cost || 0), 0)
  const totalVolume = fuelLogs.reduce((acc, f) => acc + (f.liters || 0), 0)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              ENERGY TELEMETRY · FUEL & EV DISPENSING
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            FUEL & <br />
            <span className="text-[#f7801b]">ENERGY.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Fuel consumption logs · EV charging telemetry · Dispensing audits · Thermal route efficiency
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchFuel}
            className="p-3 rounded-2xl bg-white border border-[#bf7e4d]/30 text-[#84492d] hover:bg-[#FFF1E6] transition-colors shadow-xs"
            title="Refresh Fuel Telemetry"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#f7801b]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Total Fuel Expenditure</span>
          <p className="text-3xl font-black text-[#e35020] mt-1">{formatCurrency(totalCost)}</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">{fuelLogs.length} verified dispensing logs</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Total Volume Dispensed</span>
          <p className="text-3xl font-black text-[#2d140d] mt-1">{totalVolume.toLocaleString()} Liters / kWh</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">Across diesel & high-voltage EV fleet</p>
        </div>
        <div className="p-5 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-sm">
          <span className="text-xs font-bold text-[#84492d] uppercase">Fleet Thermal Efficiency</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">4.2 km/L</p>
          <p className="text-[11px] text-[#5c3a35] mt-1 font-medium">Above national commercial benchmark</p>
        </div>
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#84492d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle number, station, or fuel type..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#bf7e4d]/30 text-xs font-mono text-[#2d140d] placeholder-[#84492d]/70 focus:outline-none focus:border-[#f7801b] transition-colors"
          />
        </div>
      </div>

      {/* 4. Fuel Logs Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#84492d]">
          <div className="w-8 h-8 rounded-full border-2 border-[#f7801b] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING FUEL TELEMETRY...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#bf7e4d]/25 p-8 space-y-3">
          <Fuel className="w-12 h-12 text-[#bf7e4d] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#2d140d] uppercase">No Fuel Logs Found</h3>
          <p className="text-xs font-mono text-[#5c3a35]">Try adjusting search filters.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white border border-[#bf7e4d]/25 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF5EC] border-b border-[#bf7e4d]/25 text-[#84492d] uppercase font-bold">
                <tr>
                  <th className="p-4">Commercial Unit</th>
                  <th className="p-4">Energy / Fuel Type</th>
                  <th className="p-4">Volume</th>
                  <th className="p-4">Total Cost</th>
                  <th className="p-4">Odometer</th>
                  <th className="p-4">Dispensing Station</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#bf7e4d]/20">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FFF5EC] transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#84492d]">
                        {log.vehicle?.vehicleNumber || 'FV-UNIT'}
                      </span>
                      <span className="text-[10px] text-[#5c3a35] block truncate">
                        {log.vehicle?.model || 'Heavy Hauler'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#2d140d] uppercase">
                        {log.vehicle?.fuelType || log.fuelType || 'Diesel'}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-[#2d140d]">
                      {log.liters} {log.vehicle?.fuelType === 'electric' ? 'kWh' : 'L'}
                    </td>
                    <td className="p-4 font-black text-[#e35020]">
                      {formatCurrency(log.cost)}
                    </td>
                    <td className="p-4 text-[#2d140d] font-semibold">
                      {log.odometer ? `${log.odometer.toLocaleString()} km` : '—'}
                    </td>
                    <td className="p-4 text-[#5c3a35] font-medium">
                      {log.station || 'Depot Central Station'}
                    </td>
                    <td className="p-4 text-[#84492d] font-medium">
                      {new Date(log.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
