'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  CheckCircle,
  TrendingUp,
  ShieldCheck,
  Fuel,
  ArrowRight,
  Printer,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

export default function ExecutiveReportsPage() {
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = (reportName: string) => {
    setDownloading(reportName)
    setTimeout(() => {
      setDownloading(null)
      toast.success(`${reportName} generated and exported successfully!`)
    }, 600)
  }

  const reports = [
    {
      id: 'rep-1',
      title: 'Consolidated Fleet P&L Audit Statement',
      category: 'Financial',
      period: 'Current Month (Nov 2026)',
      size: '2.4 MB',
      format: 'PDF / XLSX',
      desc: 'Freight contract revenues, fuel consumption costs, toll receipts, maintenance overhead, and net operating profit margin.',
    },
    {
      id: 'rep-2',
      title: 'Statutory PUC & Insurance Compliance Audit',
      category: 'Regulatory',
      period: 'Annual Review 2026',
      size: '1.8 MB',
      format: 'PDF',
      desc: 'Commercial vehicle RC fitness, national permit endorsements, PUCC emissions clearance, and carrier liability coverage.',
    },
    {
      id: 'rep-3',
      title: 'Fuel & EV Energy Efficiency Evaluation',
      category: 'Energy',
      period: 'Last 30 Days',
      size: '3.1 MB',
      format: 'PDF / CSV',
      desc: 'Comparative km/L diesel vs kWh/km EV performance, station dispensing discrepancies, and thermal efficiency curve audits.',
    },
    {
      id: 'rep-4',
      title: 'Driver Safety & Telematics Incident Roster',
      category: 'Safety',
      period: 'Q4 2026 Audit',
      size: '1.5 MB',
      format: 'PDF',
      desc: 'Speed violation logs, night corridor risk indices, harsh acceleration/braking telemetry, and safety bonus tier calculations.',
    },
  ]

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#E5DFD7] pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EA6113] animate-ping" />
            <span className="label-meta text-xs font-manrope font-semibold tracking-widest text-[#EA6113] uppercase bg-[#FFF5EC] px-3 py-1 rounded-full border border-[#f7801b]/30">
              EXECUTIVE COMPLIANCE · AUDIT EXPORTS
            </span>
            <DemoBadge label="CERTIFIED AUDIT REPORTS" />
          </div>

          <h1 className="page-title text-4xl sm:text-6xl font-bold font-inter tracking-tight text-[#07518A] uppercase leading-[0.98]">
            EXECUTIVE <br />
            <span className="text-[#EA6113]">REPORTS.</span>
          </h1>

          <p className="subtitle text-sm sm:text-base text-[#64748B] mt-3 font-manrope font-medium">
            Financial P&L statements · Vehicle regulatory filings · Telematics energy evaluations · Safety certification audits
          </p>
        </div>
      </div>

      {/* 2. Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="p-6 rounded-3xl bg-white/90 backdrop-blur-xl border border-[#E5DFD7] shadow-xs hover:shadow-xl hover:border-[#EA6113]/60 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="label-meta text-[10px] font-manrope font-bold px-2.5 py-0.5 rounded-full uppercase bg-[#FFF5EC] text-[#07518A] border border-[#E5DFD7]">
                  {rep.category}
                </span>
                <span className="stat-highlight text-xs font-inter font-bold text-[#EA6113]">{rep.format}</span>
              </div>

              <h3 className="card-heading text-lg font-bold font-inter text-[#07518A] uppercase leading-tight mb-2">
                {rep.title}
              </h3>

              <p className="body-content text-xs font-manrope font-normal text-[#64748B] leading-relaxed mb-4">
                {rep.desc}
              </p>

              <div className="flex items-center justify-between py-3 border-t border-[#E5DFD7]/70 text-xs font-manrope font-medium">
                <span className="text-[#0C1E36] font-semibold">Period: {rep.period}</span>
                <span className="text-[#64748B]">File Size: {rep.size}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5DFD7]/70">
              <button
                onClick={() => handleDownload(rep.title)}
                disabled={downloading === rep.title}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Download className={`w-4 h-4 ${downloading === rep.title ? 'animate-bounce' : ''}`} />
                <span>{downloading === rep.title ? 'Compiling Audit Export...' : 'Download Certified Statement'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
