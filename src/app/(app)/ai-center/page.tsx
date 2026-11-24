'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Brain,
  ShieldAlert,
  Fuel,
  Wrench,
  Activity,
  BarChart3,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Truck,
  RotateCw,
  ChevronRight,
  ArrowRight,
  Zap,
  Gauge,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
} from 'recharts'
import { DemoBadge } from '@/design-system/DemoBadge'

export default function AICenterPage() {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'fuel' | 'risk' | 'health' | 'analytics'>('maintenance')
  const [loading, setLoading] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  // Check window hash on mount to activate linked tab
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (['maintenance', 'fuel', 'risk', 'health', 'analytics'].includes(hash)) {
        setActiveTab(hash as any)
      }
    }
  }, [])

  const handleTabChange = (tab: 'maintenance' | 'fuel' | 'risk' | 'health' | 'analytics') => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      window.location.hash = tab
    }
  }

  // Predictive Maintenance degradation data
  const maintenancePredictions = [
    { vehicle: 'FV-001 (Volvo FH)', component: 'Brake Calipers & Liners', rul: '3,200 km', risk: 'Medium', confidence: '94%', action: 'Schedule bay pad replacement' },
    { vehicle: 'FV-003 (Tata Prima)', component: 'High-Pressure Fuel Injector', rul: '1,800 km', risk: 'High', confidence: '91%', action: 'Clean injector nozzle & filter' },
    { vehicle: 'FV-007 (Ashok Leyland)', component: 'Auxiliary Coolant Pump', rul: '5,500 km', risk: 'Low', confidence: '88%', action: 'Inspect fluid levels during B-service' },
    { vehicle: 'FV-014 (Bajaj E-Tec)', component: 'Traction Battery SoH Cell-4', rul: '14,000 km', risk: 'Low', confidence: '96%', action: 'Nominal cell balancing active' },
  ]

  // Fuel telemetry anomaly data
  const fuelAnomalies = [
    { corridor: 'Bengaluru → Chennai (NH-48)', vehicle: 'FV-003', expected: '4.4 km/L', actual: '3.6 km/L', variance: '-18.2%', status: 'Thermal Inefficiency Flagged' },
    { corridor: 'Mumbai → Pune Expressway', vehicle: 'FV-002', expected: '4.1 km/L', actual: '4.2 km/L', variance: '+2.4%', status: 'Optimal Eco-Driving' },
    { corridor: 'Chennai Port Container Hub', vehicle: 'FV-009', expected: '3.9 km/L', actual: '3.1 km/L', variance: '-20.5%', status: 'Excessive Idle Loss (3.4 hrs)' },
  ]

  // Accident risk estimation datasets
  const corridorRisks = [
    { corridor: 'Western Ghats Incline (NH-66)', severity: 'High', hazard: 'Monsoon wet tarmac & steep descent', advisory: 'Enforce 40 km/h engine retarder limiter' },
    { corridor: 'Bengaluru Outer Ring Road', severity: 'Moderate', hazard: 'Urban merge congestion & pedestrian zones', advisory: 'Activate forward radar collision alerts' },
    { corridor: 'Mumbai Logistics Gateway (NH-48)', severity: 'Low', hazard: 'Clear expressway 4-lane section', advisory: 'Nominal cruising protocol active' },
  ]

  // Multi-unit diagnostic radar
  const healthRadar = [
    { component: 'Powertrain', score: 94, fullMark: 100 },
    { component: 'HV Battery SoH', score: 91, fullMark: 100 },
    { component: 'Pneumatics & Brakes', score: 86, fullMark: 100 },
    { component: 'Steering & Chassis', score: 95, fullMark: 100 },
    { component: 'Tyres & Pressure', score: 89, fullMark: 100 },
    { component: 'Thermal Cooling', score: 92, fullMark: 100 },
  ]

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="label-meta text-xs font-manrope font-medium tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              PREDICTIVE AI & TELEMATICS INTELLIGENCE
            </span>
            <DemoBadge label="NEURAL MODELS VERIFIED" />
          </div>

          <h1 className="page-title text-4xl sm:text-6xl font-bold font-inter tracking-tight text-[#07518A] uppercase leading-[0.98]">
            AI INTELLIGENCE <br />
            <span className="text-[#EA6113]">CENTER.</span>
          </h1>

          <p className="subtitle text-sm sm:text-base text-[#64748B] mt-3 font-manrope font-medium">
            Autonomous fleet intelligence · Predictive failure models · Energy anomaly detection · Corridor risk radar
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLoading(true)
              setTimeout(() => {
                setLoading(false)
                setLastRefreshed(new Date())
              }, 400)
            }}
            className="btn-action p-3 rounded-2xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors shadow-xs"
            title="Refresh AI Models"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#EA6113]' : ''}`} />
          </button>

          <Link
            href="/ai-assistant"
            className="btn-action inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-manrope text-xs font-semibold uppercase tracking-wider transition-all shadow-md shadow-[#EA6113]/25"
          >
            <Sparkles className="w-4 h-4" />
            <span>Optimus AI Copilot</span>
          </Link>
        </div>
      </div>

      {/* 2. Intelligence Navigation Capsules */}
      <div className="p-2 rounded-2xl bg-white/95 backdrop-blur-xl border border-[#E5DFD7] flex flex-wrap gap-2 shadow-xs">
        {[
          { key: 'maintenance', label: 'Predictive Maintenance', icon: Brain, badge: 'ML' },
          { key: 'fuel', label: 'Fuel & Energy Anomalies', icon: Fuel, badge: 'TELEMETRY' },
          { key: 'risk', label: 'Accident Risk Estimation', icon: ShieldAlert, badge: 'SAFETY' },
          { key: 'health', label: 'Vehicle Health Assessment', icon: Wrench, badge: 'CAN BUS' },
          { key: 'analytics', label: 'Fleet Analytics', icon: BarChart3, badge: 'METRICS' },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as any)}
              className={`nav-link flex items-center gap-2 px-4 py-2.5 rounded-xl font-manrope text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#EA6113] to-[#F7801B] text-white shadow-md shadow-[#EA6113]/25'
                  : 'bg-[#FFF5EC] text-[#0C1E36] hover:bg-[#FFE3B3] hover:text-[#EA6113] border border-[#E5DFD7]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`label-meta text-[8px] font-manrope font-medium px-1.5 py-0.2 rounded uppercase ${
                  isActive ? 'bg-white/25 text-white' : 'bg-[#f7801b]/15 text-[#EA6113]'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          )
        })}
      </div>

      {/* 3. Dynamic Sub-Module Viewports */}
      {/* ── TAB 1: PREDICTIVE MAINTENANCE ── */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
                    <Brain className="w-5 h-5 text-[#EA6113]" />
                    Component Degradation Forecasting (RUL)
                  </h3>
                  <p className="text-xs font-mono text-[#64748B]">
                    Neural vibration and CAN-bus telemetry remaining useful life forecasts
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-[#EA6113] bg-[#FFF5EC] px-2.5 py-0.5 rounded-full border border-[#E5DFD7]">
                  4 ASSETS FLAGGED
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#FFF5EC] border-b border-[#E5DFD7] text-[#07518A] uppercase font-bold">
                    <tr>
                      <th className="p-3">Vehicle</th>
                      <th className="p-3">Subsystem</th>
                      <th className="p-3">Remaining Useful Life</th>
                      <th className="p-3">Risk Level</th>
                      <th className="p-3">Model Confidence</th>
                      <th className="p-3 text-right">Recommended Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD7]/60">
                    {maintenancePredictions.map((pred, i) => (
                      <tr key={i} className="hover:bg-[#FFF5EC]/60 transition-colors">
                        <td className="p-3 font-bold text-[#0C1E36]">{pred.vehicle}</td>
                        <td className="p-3 text-[#0C1E36] font-semibold">{pred.component}</td>
                        <td className="p-3 font-black text-[#EA6113]">{pred.rul}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              pred.risk === 'High'
                                ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                                : pred.risk === 'Medium'
                                ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                                : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                            }`}
                          >
                            {pred.risk}
                          </span>
                        </td>
                        <td className="p-3 text-[#07518A] font-bold">{pred.confidence}</td>
                        <td className="p-3 text-right text-[#64748B] font-medium">{pred.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase mb-1">
                  Predictive Savings Index
                </h3>
                <p className="text-xs font-mono text-[#64748B] mb-4">
                  Financial overhead prevented through early intervention
                </p>

                <div className="space-y-3 font-mono">
                  <div className="p-3.5 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7]">
                    <span className="text-[10px] uppercase text-[#64748B] font-bold block">Prevented Breakdown Costs</span>
                    <span className="text-2xl font-black text-emerald-700">₹1,45,000</span>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7]">
                    <span className="text-[10px] uppercase text-[#64748B] font-bold block">Unscheduled Downtime Averted</span>
                    <span className="text-2xl font-black text-[#EA6113]">48.5 Hours</span>
                  </div>
                </div>
              </div>

              <Link href="/maintenance">
                <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#EA6113]/25 cursor-pointer">
                  <span>Open Maintenance Bay Schedule</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: FUEL ANOMALIES ── */}
      {activeTab === 'fuel' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
            <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
              <Fuel className="w-5 h-5 text-[#EA6113]" />
              Corridor Fuel & EV Telematics Anomaly Detector
            </h3>
            <p className="text-xs font-mono text-[#64748B]">
              Real-time consumption drift versus expected terrain model benchmarks
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-mono">
              {fuelAnomalies.map((ano, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] space-y-2">
                  <span className="text-[10px] font-bold text-[#EA6113] uppercase block">{ano.vehicle}</span>
                  <p className="text-xs font-bold text-[#0C1E36] leading-tight">{ano.corridor}</p>
                  <div className="flex justify-between text-xs pt-1 border-t border-[#E5DFD7]">
                    <span className="text-[#64748B]">Expected: {ano.expected}</span>
                    <span className="font-extrabold text-[#0C1E36]">Actual: {ano.actual}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#e35020]">{ano.variance}</span>
                    <span className="text-[10px] font-bold text-[#07518A] bg-white px-2 py-0.5 rounded border border-[#E5DFD7]">
                      {ano.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: ACCIDENT RISK ESTIMATION ── */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
            <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#e35020]" />
              Active Route Corridor Safety & Weather Hazard Radar
            </h3>
            <p className="text-xs font-mono text-[#64748B]">
              Real-time integration of highway gradient, weather radar, and historical incident frequency
            </p>

            <div className="space-y-3 font-mono">
              {corridorRisks.map((r, i) => (
                <div key={i} className="p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[#0C1E36]">{r.corridor}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                          r.severity === 'High'
                            ? 'bg-red-500/15 text-red-700 border border-red-500/30'
                            : r.severity === 'Moderate'
                            ? 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                        }`}
                      >
                        {r.severity} Risk
                      </span>
                    </div>
                    <p className="text-xs text-[#64748B] font-medium">{r.hazard}</p>
                  </div>
                  <div className="text-xs sm:text-right">
                    <span className="text-[10px] text-[#07518A] font-bold block uppercase">Recommended AI Advisory</span>
                    <span className="font-bold text-[#0C1E36]">{r.advisory}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 4: VEHICLE HEALTH RADAR ── */}
      {activeTab === 'health' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
              <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
                <Gauge className="w-5 h-5 text-[#EA6113]" />
                Fleet-Wide Subsystem Diagnostic Radar
              </h3>
              <p className="text-xs font-mono text-[#64748B]">
                Algorithmic indices across all 14 commercial units
              </p>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={healthRadar}>
                    <PolarGrid stroke="#E5DFD7" />
                    <PolarAngleAxis dataKey="component" tick={{ fill: '#0C1E36', fontSize: 11, fontFamily: 'monospace', fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#EA6113" tick={{ fontSize: 9, fill: '#64748B' }} />
                    <Radar name="Fleet Subsystems" dataKey="score" stroke="#f7801b" fill="#f7801b" fillOpacity={0.35} strokeWidth={2.5} />
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
            </div>

            <div className="lg:col-span-2 p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase mb-1">
                  Subsystem Health Ledger
                </h3>
                <p className="text-xs font-mono text-[#64748B] mb-4">Live telemetry diagnostic score averages</p>

                <div className="space-y-2.5 font-mono">
                  {healthRadar.map((h, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0C1E36]">{h.component}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 rounded-full bg-white overflow-hidden border border-[#E5DFD7]">
                          <div className="h-full bg-gradient-to-r from-[#f7801b] to-[#e35020] rounded-full" style={{ width: `${h.score}%` }} />
                        </div>
                        <span className="text-xs font-black text-[#EA6113]">{h.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Link href="/vehicles">
                <button className="w-full py-3 rounded-xl bg-white border border-[#E5DFD7] text-[#0C1E36] hover:bg-[#FFF5EC] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <span>View Full Vehicle Telemetry Grid</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 5: FLEET ANALYTICS ── */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
            <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
              <span className="text-xs font-bold text-[#64748B] uppercase">Cost Per Kilometre</span>
              <p className="text-3xl font-black text-[#07518A] mt-1">₹14.20 / km</p>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium">Down 6.8% via AI corridor optimization</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
              <span className="text-xs font-bold text-[#64748B] uppercase">Fleet Availability Index</span>
              <p className="text-3xl font-black text-emerald-700 mt-1">94.8%</p>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium">13 of 14 commercial units ready</p>
            </div>
            <div className="p-5 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs text-[#0C1E36]">
              <span className="text-xs font-bold text-[#64748B] uppercase">Carbon Offset Metric</span>
              <p className="text-3xl font-black text-[#EA6113] mt-1">-18.4 tons</p>
              <p className="text-[11px] text-[#64748B] mt-1 font-medium">Electric fleet units EV impact</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
