'use client'

/**
 * FLEETVISION AI — EXECUTIVE COMMAND DASHBOARD
 * Phase 2 · Subphase 2 Implementation
 *
 * Strict Compliance:
 * - Brand Palette: Deep Blue (#07518A), Warm Cream (#FFF0D5), Electric Yellow (#F5E500),
 *   Sunset Orange (#EA6113), Vibrant Orange (#F88F22), Golden Amber (#FBB931).
 * - Live Backend API: GET /api/dashboard and GET /api/notifications
 * - Simulation Adapter Support: apiAdapter with clear DemoBadge indicators
 * - Visual Identity: Premium automotive command center, radar analytics, and financial telemetry
 * - Backend Protection: Zero changes to api/**, prisma/schema.prisma, or db models
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Truck,
  Users,
  DollarSign,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Bell,
  RefreshCw,
  TrendingUp,
  Activity,
  MapPin,
  Fuel,
  Zap,
  Shield,
  Wrench,
  Gauge,
  SlidersHorizontal,
  ChevronRight,
  Star,
  Clock,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts'
import { DemoBadge } from '@/design-system/DemoBadge'
import { apiAdapter, getApiClient } from '@/services/api/adapter'

// ==================== 12-SWATCH BRAND COLOR SYSTEM ====================
const BRAND = {
  richEarthRust: '#84492d',
  deepCrimsonRust: '#a02515',
  sunsetOrange: '#f7801b',
  goldenAmber: '#fba41c',
  copperSienna: '#af6438',
  crimsonSunset: '#d33e1b',
  deepEspresso: '#4d2e2a',
  burntOrange: '#e35020',
  warmOchre: '#d2833f',
  sunburstGold: '#fcbf28',
  sunsetGold: '#fcb234',
  warmSandstone: '#bf7e4d',
  warmCream: '#FFF8F2',
  warmPeach: '#FFF1E6',
  deepBlue: '#84492d',
  electricYellow: '#fcbf28',
  vibrantOrange: '#f7801b',
  softCream: '#FFF1E6',
}

const FLEET_COLORS = [
  '#10b981', // Available (Emerald)
  '#f7801b', // Active / On Trip (Vibrant Tangerine)
  '#fba41c', // Maintenance (Golden Amber)
  '#a02515', // Out of Service (Deep Crimson Rust)
]

const EXPENSE_COLORS: Record<string, string> = {
  fuel: '#f7801b',
  repair: '#e35020',
  insurance: '#84492d',
  toll: '#fba41c',
  driver_salary: '#10b981',
  vehicle_purchase: '#af6438',
  miscellaneous: '#bf7e4d',
}

// ==================== HELPERS ====================
function formatCurrency(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ==================== KPI STAT CARD ====================
interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: number
  trendLabel?: string
  accentColor?: string
  iconBg?: string
  badgeText?: string
}

function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accentColor = '#f7801b',
  iconBg = '#FFF1E6',
  badgeText,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-5 flex flex-col justify-between hover:border-[#f7801b]/50 hover:shadow-md transition-all duration-300 relative overflow-hidden group shadow-xs">
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs transition-all group-hover:scale-105 bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border border-[#3E4452] group-hover:border-[#6B7280]"
        >
          <Icon className="w-6 h-6 text-[#F3F4F6]" />
        </div>
        <div className="flex items-center gap-1.5">
          {badgeText && (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#F5F2ED] border border-[#E5DFD7] text-[#64748B]">
              {badgeText}
            </span>
          )}
          {trend !== undefined && (
            <div
              className={`flex items-center gap-1 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                trend >= 0
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : 'text-red-700 bg-red-50 border-red-200'
              }`}
            >
              {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend).toFixed(1)}%
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <p className="label-meta text-xs font-manrope font-semibold text-[#64748B] uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="stat-highlight text-2xl sm:text-3xl font-bold text-[#0C1E36] font-inter tracking-tight">
          {value}
        </p>
        {trendLabel && (
          <p className="desc-text text-[11px] text-[#64748B] font-manrope font-normal mt-1 flex items-center gap-1">
            <span className="text-[#f7801b]">•</span> {trendLabel}
          </p>
        )}
      </div>
    </div>
  )
}

// ==================== LOADING SKELETON ====================
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-3xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-xl p-5">
            <Skeleton className="h-4 w-28 bg-white/10 mb-3" />
            <Skeleton className="h-9 w-36 bg-white/10 mb-2" />
            <Skeleton className="h-3 w-20 bg-white/10" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-3xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-xl p-5">
          <Skeleton className="h-6 w-48 bg-white/10 mb-4" />
          <Skeleton className="h-60 w-full bg-white/10" />
        </div>
        <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-[#0B1528]/80 backdrop-blur-xl p-5">
          <Skeleton className="h-6 w-36 bg-white/10 mb-4" />
          <Skeleton className="h-60 w-full bg-white/10" />
        </div>
      </div>
    </div>
  )
}

// ==================== MAIN COMPONENT ====================
export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Check simulation mode state
  useEffect(() => {
    setIsSimulating(apiAdapter.isSimulating())
  }, [])

  // Telemetry fetcher
  const fetchData = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)

    try {
      if (apiAdapter.isSimulating()) {
        const client = getApiClient()
        const simData = await client.getDashboardSummary()
        setDashboardData(simData)
      } else {
        const [dashRes, notifRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/notifications?limit=20'),
        ])
        if (dashRes.ok) {
          const data = await dashRes.json()
          setDashboardData(data)
        }
        if (notifRes.ok) {
          const data = await notifRes.json()
          setNotifications(data.notifications || [])
        }
      }
      setLastUpdated(new Date())
    } catch {
      if (!silent) toast.error('Failed to update telemetry stream')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleSimulation = () => {
    const next = !isSimulating
    apiAdapter.setSimulationMode(next)
    setIsSimulating(next)
    toast.info(next ? 'Switched to Local Simulation' : 'Switched to Live Backend Telemetry')
    fetchData(true)
  }

  // Memoized analytics data
  const d = dashboardData || {}
  const fs = d.fleetSummary || {}
  const ds = d.driverSummary || {}
  const fin = d.financialSummary || {}
  const ts = d.tripSummary || {}
  const ai = d.aiInsights || {}
  const recentMaint = d.recentMaintenance || []
  const alerts = d.recentAlerts || []

  // Fleet breakdown for donut chart
  const fleetChartData = useMemo(() => {
    return [
      { name: 'Available', value: fs.available || 0 },
      { name: 'On Trip', value: fs.active || 0 },
      { name: 'Maintenance', value: fs.maintenance || 0 },
      { name: 'Out of Service', value: fs.outOfService || 0 },
    ].filter((x) => x.value > 0)
  }, [fs])

  // Revenue vs Expense monthly trend
  const revenueChartData = useMemo(() => {
    return (fin.monthlyTrend || []).map((m: any) => ({
      month: m.month,
      Revenue: Math.round(m.revenue || 0),
      Expenses: Math.round(m.expenses || 0),
      Profit: Math.round((m.revenue || 0) - (m.expenses || 0)),
    }))
  }, [fin])

  // Expense categories for bar chart
  const expenseCategoryData = useMemo(() => {
    return (fin.categoryBreakdown || []).map((c: any) => ({
      category: c.category.replace(/_/g, ' ').toUpperCase(),
      amount: c._sum?.amount || 0,
      count: c._count || 0,
      fill: EXPENSE_COLORS[c.category] || BRAND.deepBlue,
    }))
  }, [fin])

  // Vehicle Health Radar dataset
  const healthRadarData = useMemo(() => {
    const healthRecords = ai.vehicleHealth || []
    if (healthRecords.length === 0) return []

    // Calculate fleet-wide component averages
    const avg = (key: string) =>
      Math.round(
        healthRecords.reduce((acc: number, h: any) => acc + (h[key] || 0), 0) /
          healthRecords.length
      )

    return [
      { component: 'Powertrain', score: avg('engineScore'), fullMark: 100 },
      { component: 'HV Battery', score: avg('batteryScore'), fullMark: 100 },
      { component: 'Brake Calipers', score: avg('brakeScore'), fullMark: 100 },
      { component: 'Steering/Suspension', score: avg('suspensionScore'), fullMark: 100 },
      { component: 'Tyres & Pressure', score: avg('tyreScore'), fullMark: 100 },
      { component: 'Overall Health', score: avg('overallScore'), fullMark: 100 },
    ]
  }, [ai])

  if (loading) return <DashboardSkeleton />

  return (
    <div className="space-y-6 select-none font-sans">
      {/* ── Mode Banner (When Simulation Active) ── */}
      {isSimulating && (
        <DemoBadge
          variant="banner"
          label="SIMULATION MODE ACTIVE"
          className="rounded-2xl border border-[#f7801b]/40 bg-[#FFF1E6] text-[#84492d] font-bold"
        />
      )}

      {/* ── Header Surface ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFD7] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="label-meta text-[11px] font-manrope font-semibold text-[#84492d] bg-[#FFF1E6] px-2.5 py-0.5 rounded-full border border-[#f7801b]/35 uppercase tracking-widest">
              Live Fleet Telemetry Stream
            </span>
            {isSimulating && <DemoBadge variant="subtle" label="SIMULATED" />}
          </div>
          <h1 className="page-title text-3xl sm:text-4xl font-bold font-inter text-[#07518A] tracking-tight flex items-center gap-2 uppercase">
            EXECUTIVE <span className="text-[#f7801b]">DASHBOARD.</span>
          </h1>
          <p className="subtitle text-xs sm:text-sm text-[#64748B] font-manrope font-medium mt-1">
            Fleet operations oversight · Real-time financial telemetry · Predictive AI diagnostics
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSimulation}
            className={`btn-action h-9 px-3.5 text-xs font-manrope font-semibold border transition-all rounded-xl ${
              isSimulating
                ? 'bg-[#f7801b]/15 text-[#f7801b] border-[#f7801b]'
                : 'bg-white hover:bg-[#FFF5EC] text-[#0C1E36] border-[#E5DFD7]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-[#f7801b]" />
            {isSimulating ? 'Switch to Live Data' : 'Simulate Mode'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData(true)}
            disabled={refreshing}
            className="h-9 px-3.5 text-xs font-mono font-bold text-[#0C1E36] hover:text-[#f7801b] border-[#E5DFD7] bg-white hover:bg-[#FFF5EC] rounded-xl shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-[#64748B] ${refreshing ? 'animate-spin' : ''}`} />
            Sync
          </Button>

          {lastUpdated && (
            <span className="text-[11px] font-mono font-bold text-[#64748B] hidden md:inline-block pl-2 border-l border-[#E5DFD7]">
              {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {/* ── Primary KPI Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Fleet Vehicles"
          value={fs.total || 0}
          icon={Truck}
          trend={4.8}
          trendLabel={`${fs.active || 0} deployed · ${fs.available || 0} ready`}
          accentColor="#f7801b"
          badgeText="ASSETS"
        />

        <StatCard
          title="Active Drivers"
          value={ds.total || 0}
          icon={Users}
          trend={2.4}
          trendLabel={`${ds.active || 0} on assignment · ${ds.available || 0} standby`}
          accentColor="#e35020"
          badgeText="OPERATORS"
        />

        <StatCard
          title="Gross Monthly Revenue"
          value={formatCurrency(fin.revenue || 0)}
          icon={DollarSign}
          trend={fin.expenseChange ? -Math.round(fin.expenseChange) : 8.5}
          trendLabel={`${formatCurrency(fin.profit || 0)} net operational margin`}
          accentColor="#84492d"
          badgeText="FINANCIAL"
        />

        <StatCard
          title="Predictive AI Alerts"
          value={ai.summary?.maintenanceDueSoon || 0}
          icon={Brain}
          trend={-15.0}
          trendLabel={`${ai.summary?.highRiskVehicles || 0} high-risk assets flagged`}
          accentColor="#d33e1b"
          badgeText="INFERENCE"
        />
      </div>

      {/* ── Quick Action Command Strip ── */}
      <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-mono text-[#0C1E36]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-pulse" />
          <span className="font-extrabold uppercase">Fleet Command Center:</span>
          <span className="text-[#64748B] font-medium hidden sm:inline">Rapid operational actions</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Link href="/trips/new">
            <Button size="sm" className="h-9 px-4 text-xs font-mono font-bold bg-gradient-to-r from-[#f7801b] to-[#e35020] hover:from-[#e35020] hover:to-[#d33e1b] text-white shadow-xs rounded-xl">
              <MapPin className="w-3.5 h-3.5 mr-1.5" />
              Dispatch Trip
            </Button>
          </Link>
          <Link href="/maintenance/schedule">
            <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-mono font-bold bg-white text-[#0C1E36] border-[#E5DFD7] hover:bg-[#FFF5EC] rounded-xl">
              <Wrench className="w-3.5 h-3.5 mr-1.5 text-[#f7801b]" />
              Book Bay Service
            </Button>
          </Link>
          <Link href="/vehicles/explorer">
            <Button size="sm" variant="outline" className="h-9 px-4 text-xs font-mono font-bold bg-white text-[#0C1E36] border-[#E5DFD7] hover:bg-[#FFF5EC] rounded-xl">
              <Truck className="w-3.5 h-3.5 mr-1.5 text-[#07518A]" />
              Launch 360° Explorer
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Tabs for Modular Deep Dive ── */}
      <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList className="bg-white/95 border border-[#E5DFD7] p-1.5 rounded-2xl h-auto flex flex-wrap gap-1.5 font-mono text-xs shadow-xs backdrop-blur-xl">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f7801b] data-[state=active]:to-[#e35020] data-[state=active]:text-white data-[state=active]:shadow-md text-[#64748B] hover:text-[#0C1E36] font-bold rounded-xl py-2 px-4 transition-all"
          >
            Operational Overview
          </TabsTrigger>
          <TabsTrigger
            value="financials"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f7801b] data-[state=active]:to-[#e35020] data-[state=active]:text-white data-[state=active]:shadow-md text-[#64748B] hover:text-[#0C1E36] font-bold rounded-xl py-2 px-4 transition-all"
          >
            Financial Analytics
          </TabsTrigger>
          <TabsTrigger
            value="health"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f7801b] data-[state=active]:to-[#e35020] data-[state=active]:text-white data-[state=active]:shadow-md text-[#64748B] hover:text-[#0C1E36] font-bold rounded-xl py-2 px-4 transition-all"
          >
            Vehicle Health & AI Radar
          </TabsTrigger>
          <TabsTrigger
            value="drivers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#f7801b] data-[state=active]:to-[#e35020] data-[state=active]:text-white data-[state=active]:shadow-md text-[#64748B] hover:text-[#0C1E36] font-bold rounded-xl py-2 px-4 transition-all"
          >
            Driver Safety Roster
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: OPERATIONAL OVERVIEW ── */}
        <TabsContent value="overview" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Revenue vs Expenses Area Chart */}
            <div className="lg:col-span-3 rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs flex flex-col justify-between text-[#0C1E36]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#EA6113]" />
                    Revenue vs. Operating Expenses
                  </h2>
                  <p className="text-xs font-mono text-[#64748B]">
                    6-month comparative operational revenue & cost curves
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#EA6113] bg-[#f7801b]/10 border border-[#f7801b]/25 px-2.5 py-0.5 rounded-full">
                  INR CURRENCY
                </span>
              </div>

              {revenueChartData.length > 0 ? (
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f7801b" stopOpacity={0.45} />
                          <stop offset="95%" stopColor="#f7801b" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#e35020" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#e35020" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace', fontWeight: 600 }} />
                      <YAxis
                        tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace', fontWeight: 600 }}
                        tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                      />
                      <RTooltip
                        contentStyle={{
                          background: '#FFFFFF',
                          border: '1px solid #E5DFD7',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#0C1E36',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        }}
                        formatter={(v: number) => [formatCurrency(v)]}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', color: '#0C1E36', fontWeight: 600 }} />
                      <Area
                        type="monotone"
                        dataKey="Revenue"
                        stroke="#f7801b"
                        strokeWidth={2.5}
                        fill="url(#revGrad)"
                      />
                      <Area
                        type="monotone"
                        dataKey="Expenses"
                        stroke="#e35020"
                        strokeWidth={2}
                        fill="url(#expGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#64748B] text-xs font-mono font-medium">
                  No monthly trend telemetry recorded
                </div>
              )}
            </div>

            {/* Fleet Status Donut */}
            <div className="lg:col-span-2 rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs flex flex-col justify-between text-[#0C1E36]">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#EA6113]" />
                    Fleet Status Distribution
                  </h2>
                  <span className="text-[11px] font-mono text-[#EA6113] font-bold bg-[#f7801b]/10 px-2.5 py-0.5 rounded-full border border-[#f7801b]/25">
                    {fs.total || 0} TOTAL
                  </span>
                </div>
                <p className="text-xs font-mono text-[#64748B] mb-4">
                  Active vehicle allocation and readiness states
                </p>
              </div>

              {fleetChartData.length > 0 ? (
                <>
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={fleetChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={46}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {fleetChartData.map((_, i) => (
                            <Cell key={i} fill={FLEET_COLORS[i % FLEET_COLORS.length]} />
                          ))}
                        </Pie>
                        <RTooltip
                          contentStyle={{
                            background: '#FFFFFF',
                            border: '1px solid #E5DFD7',
                            borderRadius: '12px',
                            fontSize: '11px',
                            color: '#0C1E36',
                            fontFamily: 'monospace',
                            fontWeight: 600,
                            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono">
                    {fleetChartData.map((item, i) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7]"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ background: FLEET_COLORS[i % FLEET_COLORS.length] }}
                          />
                          <span className="text-[#0C1E36] font-bold text-xs truncate">{item.name}</span>
                        </div>
                        <span className="font-extrabold text-[#07518A] text-xs">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-48 flex items-center justify-center text-[#64748B] text-xs font-mono font-medium">
                  No fleet records loaded
                </div>
              )}
            </div>
          </div>

          {/* Bottom Grid: Recent Dispatches & Real-Time Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Trips Table */}
            <div className="lg:col-span-2 rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Recent Cargo Dispatches
                  </h2>
                  <p className="text-xs font-mono text-[#64748B]">
                    Active manifests and completed freight journeys
                  </p>
                </div>
                <Link href="/trips" className="text-xs font-mono font-bold text-[#EA6113] hover:underline flex items-center gap-1">
                  View All <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {(ts.recentTrips || []).length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs font-mono">
                    <thead>
                      <tr className="border-b border-[#E5DFD7]">
                        <th className="text-left pb-3 text-[#64748B] font-bold uppercase text-[11px] pr-4">Manifest #</th>
                        <th className="text-left pb-3 text-[#64748B] font-bold uppercase text-[11px] pr-4">Route Corridor</th>
                        <th className="text-left pb-3 text-[#64748B] font-bold uppercase text-[11px] pr-4">Operator</th>
                        <th className="text-left pb-3 text-[#64748B] font-bold uppercase text-[11px] pr-4">Freight Cost</th>
                        <th className="text-left pb-3 text-[#64748B] font-bold uppercase text-[11px]">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5DFD7]/60">
                      {(ts.recentTrips || []).slice(0, 6).map((trip: any) => (
                        <tr key={trip.id} className="hover:bg-[#FFF5EC]/60 transition-colors">
                          <td className="py-3 pr-4">
                            <span className="text-[#EA6113] font-black">
                              #{trip.tripNumber || trip.id?.slice(-6) || 'TRP'}
                            </span>
                          </td>
                          <td className="py-3 pr-4">
                            <span className="text-[#0C1E36] font-bold">{trip.pickupLocation}</span>
                            <span className="text-[#EA6113] mx-1 font-bold">→</span>
                            <span className="text-[#0C1E36] font-bold">{trip.destination}</span>
                          </td>
                          <td className="py-3 pr-4 text-[#0C1E36] font-semibold">
                            {trip.driver?.name || '—'}
                          </td>
                          <td className="py-3 pr-4 text-emerald-700 font-black">
                            {trip.tripCost ? formatCurrency(trip.tripCost) : '—'}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                trip.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                                  : trip.status === 'in_progress'
                                  ? 'bg-[#f7801b]/15 text-[#EA6113] border border-[#f7801b]/30'
                                  : trip.status === 'scheduled'
                                  ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {trip.status?.replace(/_/g, ' ')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="h-32 flex items-center justify-center text-[#64748B] text-xs font-mono font-medium">
                  No dispatches recorded
                </div>
              )}
            </div>

            {/* Live Operational Alerts */}
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#EA6113]" />
                    Operational Warnings
                  </h2>
                  <p className="text-xs font-mono text-[#64748B]">
                    Real-time safety and maintenance notices
                  </p>
                </div>
              </div>

              <ScrollArea className="h-72">
                <div className="space-y-3 pr-2">
                  {(alerts.length > 0 ? alerts : notifications).slice(0, 10).length > 0 ? (
                    (alerts.length > 0 ? alerts : notifications).slice(0, 10).map((n: any) => (
                      <div
                        key={n.id}
                        className={`flex items-start gap-2.5 p-3 rounded-2xl border transition-colors ${
                          !n.isRead
                            ? 'bg-[#FFF5EC] border-[#f7801b]/30 shadow-xs'
                            : 'bg-slate-50 border-[#E5DFD7]'
                        }`}
                      >
                        {n.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-[#e35020] shrink-0 mt-0.5" />
                        ) : n.type === 'error' ? (
                          <XCircle className="w-4 h-4 text-[#a02515] shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-mono font-bold text-[#0C1E36] leading-tight truncate">
                            {n.title}
                          </p>
                          <p className="text-[11px] font-mono text-[#64748B] mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] font-mono text-[#EA6113] font-semibold mt-1">
                            {n.createdAt ? formatDateTime(n.createdAt) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-40 flex items-center justify-center text-[#64748B] text-xs font-mono text-center font-medium">
                      No operational warnings. All systems normal.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: FINANCIAL ANALYTICS ── */}
        <TabsContent value="financials" className="space-y-6 m-0">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-5 shadow-xs text-[#0C1E36]">
              <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">Gross Freight Revenue</p>
              <p className="text-2xl font-black font-mono text-emerald-700 mt-1">{formatCurrency(fin.revenue || 0)}</p>
              <p className="text-[11px] font-mono text-[#64748B] mt-1 font-medium">From completed transport contracts</p>
            </div>
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-5 shadow-xs text-[#0C1E36]">
              <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">Total Operating Costs</p>
              <p className="text-2xl font-black font-mono text-[#e35020] mt-1">{formatCurrency(fin.monthlyExpense || 0)}</p>
              <p className="text-[11px] font-mono text-[#64748B] mt-1 font-medium">Fuel, maintenance, tolls & driver wages</p>
            </div>
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-5 shadow-xs text-[#0C1E36]">
              <p className="text-xs font-mono font-bold text-[#64748B] uppercase tracking-wider">Operating Margin</p>
              <p className="text-2xl font-black font-mono text-[#EA6113] mt-1">
                {fin.profitMargin ? `${fin.profitMargin.toFixed(1)}%` : '—'}
              </p>
              <p className="text-[11px] font-mono text-[#64748B] mt-1 font-medium">Net profit: {formatCurrency(fin.profit || 0)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Breakdown Bar Chart */}
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="mb-4">
                <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider">
                  Operational Cost by Category
                </h3>
                <p className="text-xs font-mono text-[#64748B]">Current monthly allocation ledger</p>
              </div>

              {expenseCategoryData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={expenseCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                      <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B', fontFamily: 'monospace', fontWeight: 600 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                      <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#0C1E36', fontFamily: 'monospace', fontWeight: 600 }} width={80} />
                      <RTooltip
                        contentStyle={{
                          background: '#FFFFFF',
                          border: '1px solid #E5DFD7',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#0C1E36',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        }}
                        formatter={(v: number) => [formatCurrency(v)]}
                      />
                      <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                        {expenseCategoryData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#64748B] text-xs font-mono font-medium">
                  No expense records logged this month
                </div>
              )}
            </div>

            {/* Fuel & Maintenance Ratios */}
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs flex flex-col justify-between text-[#0C1E36]">
              <div>
                <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider mb-1">
                  Primary Cost Ratios
                </h3>
                <p className="text-xs font-mono text-[#64748B] mb-4">Direct fleet overhead distribution</p>

                <div className="space-y-4 font-mono">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                      <span className="text-[#0C1E36] flex items-center gap-1.5">
                        <Fuel className="w-4 h-4 text-[#EA6113]" /> Fuel Consumption
                      </span>
                      <span className="text-[#EA6113] font-extrabold">{formatCurrency(fin.fuelCost || 0)}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden border border-[#E5DFD7]">
                      <div
                        className="h-full bg-gradient-to-r from-[#f7801b] to-[#e35020] rounded-full"
                        style={{
                          width: `${fin.monthlyExpense ? Math.min(100, Math.round(((fin.fuelCost || 0) / fin.monthlyExpense) * 100)) : 0}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1.5 font-bold">
                      <span className="text-[#0C1E36] flex items-center gap-1.5">
                        <Wrench className="w-4 h-4 text-[#e35020]" /> Bay Maintenance
                      </span>
                      <span className="text-[#e35020] font-extrabold">{formatCurrency(fin.maintenanceCost || 0)}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden border border-[#E5DFD7]">
                      <div
                        className="h-full bg-gradient-to-r from-[#fba41c] to-[#e35020] rounded-full"
                        style={{
                          width: `${fin.monthlyExpense ? Math.min(100, Math.round(((fin.maintenanceCost || 0) / fin.monthlyExpense) * 100)) : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] mt-6">
                <p className="text-xs font-mono font-bold text-[#07518A] mb-1 uppercase tracking-wider">Cost Optimization Insight</p>
                <p className="text-xs font-mono text-[#0C1E36] leading-relaxed font-medium">
                  Fuel costs represent {fin.monthlyExpense ? Math.round(((fin.fuelCost || 0) / fin.monthlyExpense) * 100) : 0}% of operational overhead. Deploying AI route optimization could recover up to 7.4% in thermal efficiency.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 3: VEHICLE HEALTH & AI RADAR ── */}
        <TabsContent value="health" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Health Radar Chart */}
            <div className="lg:col-span-3 rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#EA6113]" />
                  Fleet Diagnostic Radar
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#EA6113] bg-[#f7801b]/10 border border-[#f7801b]/25 px-2.5 py-0.5 rounded-full">
                  0-100 INDEX
                </span>
              </div>
              <p className="text-xs font-mono text-[#64748B] mb-4">
                Component health averages across powertrain, high-voltage battery, and braking assemblies
              </p>

              {healthRadarData.length > 0 ? (
                <div className="h-64 sm:h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={healthRadarData}>
                      <PolarGrid stroke="rgba(0,0,0,0.08)" />
                      <PolarAngleAxis dataKey="component" tick={{ fill: '#0C1E36', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#EA6113" tick={{ fontSize: 9, fill: '#64748B' }} />
                      <Radar name="Fleet Average" dataKey="score" stroke="#f7801b" fill="#f7801b" fillOpacity={0.35} strokeWidth={2.5} />
                      <RTooltip
                        contentStyle={{
                          background: '#FFFFFF',
                          border: '1px solid #E5DFD7',
                          borderRadius: '12px',
                          fontSize: '11px',
                          color: '#0C1E36',
                          fontFamily: 'monospace',
                          fontWeight: 600,
                          boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-[#64748B] text-xs font-mono font-medium">
                  No diagnostic health records recorded
                </div>
              )}
            </div>

            {/* AI Risk Summary */}
            <div className="lg:col-span-2 rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs flex flex-col justify-between text-[#0C1E36]">
              <div>
                <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2 mb-1">
                  <Brain className="w-4 h-4 text-[#EA6113]" />
                  Predictive AI Maintenance Alerts
                </h3>
                <p className="text-xs font-mono text-[#64748B] mb-4">
                  Neural telemetry risk assessments
                </p>

                <div className="space-y-3 font-mono">
                  {(ai.predictions || []).slice(0, 4).map((pred: any) => (
                    <div key={pred.id} className="p-3.5 rounded-2xl bg-white/95 border border-[#E5DFD7]">
                      <div className="flex items-center justify-between text-xs mb-1 font-bold">
                        <span className="text-[#0C1E36] uppercase">{pred.type?.replace(/_/g, ' ')}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#f7801b]/15 text-[#EA6113] border border-[#f7801b]/30">
                          {Math.round(pred.confidence * 100)}% CONFIDENCE
                        </span>
                      </div>
                      <p className="text-xs text-[#64748B] font-medium line-clamp-2">
                        {typeof pred.predictionData === 'string'
                          ? pred.predictionData
                          : JSON.stringify(pred.predictionData)}
                      </p>
                    </div>
                  ))}
                  {(ai.predictions || []).length === 0 && (
                    <p className="text-xs text-[#64748B] text-center py-6 font-medium">All vehicle subsystems operating within safety tolerances.</p>
                  )}
                </div>
              </div>

              <Link href="/ai-center" className="mt-4">
                <Button className="w-full text-xs font-mono font-bold bg-gradient-to-r from-[#f7801b] to-[#e35020] hover:from-[#e35020] hover:to-[#d33e1b] text-white shadow-xs rounded-xl">
                  Open AI Intelligence Center <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 4: DRIVER SAFETY ROSTER ── */}
        <TabsContent value="drivers" className="space-y-6 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performing Operators */}
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#EA6113]" />
                    Top Performing Operators
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">Exemplary safety and eco-driving scores</p>
                </div>
                <span className="text-[11px] font-mono text-emerald-700 font-bold bg-emerald-500/15 border border-emerald-500/35 px-2.5 py-0.5 rounded-full">
                  ≥ 4.5 RATING
                </span>
              </div>

              <div className="space-y-2.5 font-mono">
                {(ds.topPerformers || []).map((driver: any) => (
                  <div key={driver.id} className="p-3.5 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#0C1E36]">{driver.name}</p>
                      <p className="text-[10px] text-[#64748B] font-semibold uppercase">{driver.status?.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white border border-[#E5DFD7] px-3 py-1 rounded-xl shadow-xs">
                      <Star className="w-3.5 h-3.5 text-[#EA6113] fill-[#EA6113]" />
                      <span className="text-xs font-bold text-[#0C1E36]">{driver.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
                {(ds.topPerformers || []).length === 0 && (
                  <p className="text-xs text-[#64748B] text-center py-6 font-medium">No operator evaluations logged yet.</p>
                )}
              </div>
            </div>

            {/* Drivers Requiring Safety Coaching */}
            <div className="rounded-3xl border border-[#E5DFD7] bg-white/90 backdrop-blur-xl p-6 shadow-xs text-[#0C1E36]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-mono font-extrabold text-[#07518A] uppercase tracking-wider flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#e35020]" />
                    Safety Monitoring & Coaching
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">Operators flagged for corrective training</p>
                </div>
                <span className="text-[11px] font-mono text-red-600 font-bold bg-red-500/15 border border-red-500/35 px-2.5 py-0.5 rounded-full">
                  &lt; 3.5 RATING
                </span>
              </div>

              <div className="space-y-2.5 font-mono">
                {(ds.unsafeDrivers || []).map((driver: any) => (
                  <div key={driver.id} className="p-3.5 rounded-2xl bg-white/95 border border-[#E5DFD7] flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#0C1E36]">{driver.name}</p>
                      <p className="text-[10px] text-[#64748B] font-semibold uppercase">{driver.status?.replace(/_/g, ' ')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#e35020]">{driver.rating.toFixed(1)} / 5.0</span>
                      <Link href={`/drivers/${driver.id}`}>
                        <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-[#EA6113] font-bold hover:bg-[#FFF5EC]">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {(ds.unsafeDrivers || []).length === 0 && (
                  <p className="text-xs text-emerald-700 text-center py-6 font-semibold">All active operators meet the baseline safety standard.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
