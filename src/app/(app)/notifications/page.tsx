'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Bell,
  Search,
  RotateCw,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Filter,
  Check,
  Trash2,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface INotification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState('all')

  const fetchNotifs = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/notifications?limit=50')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [])

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  const filtered = notifications.filter((n) => {
    return filterType === 'all' || n.type.toLowerCase() === filterType.toLowerCase()
  })

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              ALERT COMMAND CENTER · LIVE EVENT LOG
            </span>
            <DemoBadge label="DATABASE VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            NOTIFICATIONS & <br />
            <span className="text-[#f7801b]">ALERTS.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Real-time telemetry alerts · Collision warnings · Preventative bay notices · Driver safety infractions
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchNotifs}
            className="p-3 rounded-2xl bg-white border border-[#bf7e4d]/30 text-[#84492d] hover:bg-[#FFF1E6] transition-colors shadow-xs"
            title="Refresh Notifications"
          >
            <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#f7801b]' : ''}`} />
          </button>

          <button
            onClick={markAllRead}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#bf7e4d]/40 hover:bg-[#FFF1E6] text-[#2d140d] font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-xs"
          >
            <Check className="w-4 h-4 text-[#f7801b]" />
            <span>Mark All as Read</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Filter Pills */}
      <div className="p-4 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#84492d] font-bold hidden sm:inline">Filter Severity:</span>
          {['all', 'warning', 'error', 'info'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-xl uppercase transition-all font-bold ${
                filterType === t
                  ? 'bg-[#84492d] text-white shadow-xs'
                  : 'bg-[#FFF5EC] text-[#4d2e2a] hover:bg-[#FFF1E6]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-[#5c3a35] font-medium">
          Showing {filtered.length} of {notifications.length} logged incidents
        </span>
      </div>

      {/* 3. Notifications List */}
      {loading ? (
        <div className="py-24 text-center space-y-3 font-mono text-xs text-[#84492d]">
          <div className="w-8 h-8 rounded-full border-2 border-[#f7801b] border-t-transparent animate-spin mx-auto" />
          <p className="font-bold uppercase tracking-wider">RETRIEVING FLEET ALERTS...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center rounded-3xl bg-white border border-[#bf7e4d]/25 p-8 space-y-3">
          <Bell className="w-12 h-12 text-[#bf7e4d] mx-auto opacity-50" />
          <h3 className="text-lg font-bold font-sans text-[#2d140d] uppercase">No Notifications Found</h3>
          <p className="text-xs font-mono text-[#5c3a35]">All systems operating normally within threshold tolerances.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-3xl border transition-all flex items-start gap-4 ${
                !n.isRead
                  ? 'bg-[#FFF5EC] border-[#f7801b]/50 shadow-md shadow-[#f7801b]/10'
                  : 'bg-white border-[#bf7e4d]/25'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {n.type === 'error' ? (
                  <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-300 text-[#a02515] flex items-center justify-center">
                    <XCircle className="w-5 h-5" />
                  </div>
                ) : n.type === 'warning' ? (
                  <div className="w-10 h-10 rounded-2xl bg-orange-100 border border-orange-300 text-[#e35020] flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold font-sans text-[#2d140d] uppercase truncate">
                    {n.title}
                  </h3>
                  <span className="text-[10px] font-mono font-medium text-[#84492d] shrink-0">
                    {new Date(n.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs font-mono text-[#5c3a35] font-medium leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
