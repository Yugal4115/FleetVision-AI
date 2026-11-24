'use client'

import React, { useState } from 'react'
import { toast } from 'sonner'
import {
  Settings,
  Building2,
  Bell,
  Gauge,
  Radio,
  Save,
  Check,
  Shield,
  Clock,
  RotateCw,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

export default function PlatformSettingsPage() {
  const [telemetryInterval, setTelemetryInterval] = useState('15')
  const [speedThreshold, setSpeedThreshold] = useState('80')
  const [defaultDepot, setDefaultDepot] = useState('bengaluru')
  const [currency, setCurrency] = useState('INR')
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(true)
  const [aiPredictiveAlerts, setAiPredictiveAlerts] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      toast.success('Platform operational settings saved successfully!')
    }, 600)
  }

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              PLATFORM CONFIGURATION · SYSTEM PARAMETERS
            </span>
            <DemoBadge label="SYSTEM CONTROL PANEL" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#07518A] uppercase leading-[0.98]">
            PLATFORM <br />
            <span className="text-[#EA6113]">SETTINGS.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#64748B] mt-3 font-sans font-medium">
            Depot operating hub · CAN-bus telemetry broadcast interval · High-risk speed alerts · Notification channels
          </p>
        </div>
      </div>

      {/* 2. Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Telematics & Telemetry Streaming */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
            <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
              <Radio className="w-5 h-5 text-[#EA6113]" />
              Telemetry Broadcast & Ingestion
            </h3>
            <p className="text-xs font-mono text-[#64748B]">
              Real-time vehicle heartbeat ping frequency over cellular and satellite gateways
            </p>

            <div className="space-y-4 pt-2 font-mono text-xs">
              <div>
                <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                  Telemetry Ping Interval
                </label>
                <select
                  value={telemetryInterval}
                  onChange={(e) => setTelemetryInterval(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
                >
                  <option value="5">5 Seconds (High-frequency express corridor tracking)</option>
                  <option value="15">15 Seconds (Standard commercial fleet balance - Recommended)</option>
                  <option value="60">60 Seconds (Low-bandwidth conservation mode)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                  High-Risk Over-Speed Threshold
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={speedThreshold}
                    onChange={(e) => setSpeedThreshold(e.target.value)}
                    className="w-32 h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
                  />
                  <span className="text-xs font-bold text-[#64748B]">km/h (Automatic Safety Infraction Flag)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Regional Operations & Currency */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
            <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#EA6113]" />
              Depot Operations & Locale
            </h3>
            <p className="text-xs font-mono text-[#64748B]">
              Default commercial terminal hub, local currency, and regulatory standards
            </p>

            <div className="space-y-4 pt-2 font-mono text-xs">
              <div>
                <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                  Default Operational Hub
                </label>
                <select
                  value={defaultDepot}
                  onChange={(e) => setDefaultDepot(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
                >
                  <option value="bengaluru">Bengaluru Central Logistics Depot (BLR-01)</option>
                  <option value="chennai">Chennai Port Container Hub (MAA-02)</option>
                  <option value="mumbai">Mumbai Express Logistics Corridor (BOM-03)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#07518A] block mb-1.5 uppercase">
                  Accounting Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7] text-[#0C1E36] font-bold focus:outline-none focus:border-[#EA6113]"
                >
                  <option value="INR">Indian Rupee (INR ₹) - Primary Legal Tender</option>
                  <option value="USD">US Dollar (USD $) - Export Invoicing</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notification Broadcast Channels */}
        <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs space-y-4">
          <h3 className="text-base font-mono font-extrabold text-[#07518A] uppercase flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#EA6113]" />
            Notification Subscriptions & Alert Dispatch
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#EA6113]"
              />
              <div>
                <span className="font-bold text-[#0C1E36] block">Email Summary</span>
                <span className="text-[10px] text-[#64748B]">Daily executive digest</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#EA6113]"
              />
              <div>
                <span className="font-bold text-[#0C1E36] block">Emergency SMS</span>
                <span className="text-[10px] text-[#64748B]">Severe collision alerts</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#FFF5EC] border border-[#E5DFD7] cursor-pointer">
              <input
                type="checkbox"
                checked={aiPredictiveAlerts}
                onChange={(e) => setAiPredictiveAlerts(e.target.checked)}
                className="w-4 h-4 accent-[#EA6113]"
              />
              <div>
                <span className="font-bold text-[#0C1E36] block">AI Early Warnings</span>
                <span className="text-[10px] text-[#64748B]">Predictive bay notices</span>
              </div>
            </label>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saved}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-[#EA6113]/25 transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{saved ? 'Saving Configuration...' : 'Save System Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
