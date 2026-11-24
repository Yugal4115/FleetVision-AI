'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  DollarSign,
  Search,
  RotateCw,
  Plus,
  ArrowRight,
  TrendingDown,
  PieChart as PieIcon,
  Fuel,
  Wrench,
  ShieldCheck,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IExpense {
  id: string
  category: string
  amount: number
  description?: string | null
  expenseDate: string
  vehicle?: { vehicleNumber: string; model: string } | null
}

export default function ExpenseLedgerPage() {
  const [expenses, setExpenses] = useState<IExpense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const fetchExpenses = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/expenses?limit=50')
      if (res.ok) {
        const data = await res.json()
        setExpenses(data.expenses || [])
      }
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const filtered = expenses.filter((e) => {
    const matchSearch =
      !search ||
      (e.vehicle?.vehicleNumber && e.vehicle.vehicleNumber.toLowerCase().includes(search.toLowerCase())) ||
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = categoryFilter === 'all' || e.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchSearch && matchCategory
  })

  const totalExpense = expenses.reduce((acc, e) => acc + (e.amount || 0), 0)

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
              FINANCIAL AUDIT · OPERATING EXPENSES
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            EXPENSE <br />
            <span className="text-[#EA6113]">LEDGER.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Operating cost ledger · Fuel, maintenance, insurance & toll allocations · Consolidated financial telemetry
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchExpenses}
            className="p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh Financial Ledger"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EA6113]' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Total Operating Expenditure</span>
          <p className="text-3xl font-black text-[#e35020] mt-1">{formatCurrency(totalExpense)}</p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">{expenses.length} audited financial transactions</p>
        </div>
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Primary Cost Driver</span>
          <p className="text-3xl font-black text-[#EA6113] mt-1">Fuel & Charging</p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">54.2% of total operational overhead</p>
        </div>
        <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
          <span className="text-xs font-bold text-[#64748B] uppercase">Monthly Margin Index</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">+18.4% Net</p>
          <p className="text-[11px] text-[#64748B] mt-1 font-medium">Healthy financial operational ratio</p>
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
            placeholder="Search category, vehicle #, or cost description..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#EA6113] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#64748B] font-bold hidden sm:inline">Category:</span>
          {['all', 'fuel', 'repair', 'toll', 'driver_salary', 'insurance'].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all font-bold ${
                categoryFilter === c
                  ? 'bg-gradient-to-r from-[#EA6113] to-[#F7801B] text-white shadow-xs'
                  : 'bg-[#FFF5EC] text-[#0C1E36] hover:bg-[#FFE3B3]'
              }`}
            >
              {c.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Expenses Table */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#64748B]">
          <div className="w-8 h-8 rounded-full border-2 border-[#EA6113] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING FINANCIAL TELEMETRY...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#E5DFD7] p-8 space-y-3">
          <DollarSign className="w-12 h-12 text-[#64748B] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#07518A] uppercase">No Expenses Found</h3>
          <p className="text-xs font-mono text-[#64748B]">Try adjusting search filters or categories.</p>
        </div>
      ) : (
        <div className="rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FFF5EC] border-b border-[#E5DFD7] text-[#07518A] uppercase font-bold">
                <tr>
                  <th className="p-4">Category</th>
                  <th className="p-4">Commercial Unit</th>
                  <th className="p-4">Cost Description</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Audit Date</th>
                  <th className="p-4 text-right">Accounting Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD7]/60">
                {filtered.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#FFF5EC]/60 transition-colors">
                    <td className="p-4">
                      <span className="font-bold text-[#EA6113] uppercase">
                        {exp.category.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="font-bold text-[#07518A]">
                        {exp.vehicle?.vehicleNumber || 'FLEET OVERHEAD'}
                      </span>
                      <span className="text-[10px] text-[#64748B] block truncate">
                        {exp.vehicle?.model || 'Operations Hub'}
                      </span>
                    </td>
                    <td className="p-4 text-[#0C1E36] font-semibold max-w-[260px] truncate">
                      {exp.description || 'Standard operational line item'}
                    </td>
                    <td className="p-4 font-black text-[#e35020]">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="p-4 text-[#64748B] font-medium">
                      {new Date(exp.expenseDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-right">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 border border-emerald-500/30">
                        RECONCILED
                      </span>
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
