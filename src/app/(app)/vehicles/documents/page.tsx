'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Download,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { DemoBadge } from '@/design-system/DemoBadge'

interface IDocumentRecord {
  id: string
  vehicleCode: string
  model: string
  docType: 'Insurance Policy' | 'PUCC Certificate' | 'RC Fitness' | 'National Goods Permit'
  docNumber: string
  issuer: string
  expiryDate: string
  status: 'valid' | 'expiring_soon' | 'expired'
}

const REGULATORY_DOCS: IDocumentRecord[] = [
  {
    id: '1',
    vehicleCode: 'FV-001',
    model: 'Volvo FH Aero Electric',
    docType: 'Insurance Policy',
    docNumber: 'HDFC-ERGO-COMM-99882',
    issuer: 'HDFC ERGO General Insurance',
    expiryDate: '2027-04-15',
    status: 'valid',
  },
  {
    id: '2',
    vehicleCode: 'FV-001',
    model: 'Volvo FH Aero Electric',
    docType: 'RC Fitness',
    docNumber: 'KA-01-E-2024-FIT',
    issuer: 'RTO Bengaluru Central',
    expiryDate: '2028-11-20',
    status: 'valid',
  },
  {
    id: '3',
    vehicleCode: 'FV-002',
    model: 'Volvo FH16 750 Globetrotter',
    docType: 'National Goods Permit',
    docNumber: 'NP-IND-KA-883921',
    issuer: 'Ministry of Road Transport (MoRTH)',
    expiryDate: '2026-12-05',
    status: 'expiring_soon',
  },
  {
    id: '4',
    vehicleCode: 'FV-003',
    model: 'Tata Prima 5530.S',
    docType: 'PUCC Certificate',
    docNumber: 'PUC-KA01-2026-9921',
    issuer: 'Govt Approved Emission Test Center',
    expiryDate: '2027-02-18',
    status: 'valid',
  },
  {
    id: '5',
    vehicleCode: 'FV-014',
    model: 'Bajaj RE E-Tec 9.0',
    docType: 'RC Fitness',
    docNumber: 'KA-05-EV-9941-FIT',
    issuer: 'RTO Bengaluru South',
    expiryDate: '2029-08-10',
    status: 'valid',
  },
]

export default function VehicleDocumentsPage() {
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filtered = REGULATORY_DOCS.filter((d) => {
    const matchSearch =
      !search ||
      d.vehicleCode.toLowerCase().includes(search.toLowerCase()) ||
      d.model.toLowerCase().includes(search.toLowerCase()) ||
      d.docNumber.toLowerCase().includes(search.toLowerCase())
    const matchType = filterType === 'all' || d.docType.toLowerCase().includes(filterType.toLowerCase())
    return matchSearch && matchType
  })

  return (
    <div className="space-y-8 select-none font-sans animate-in fade-in duration-300">
      {/* 1. Header Surface */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#bf7e4d]/25 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f7801b] animate-ping" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#84492d] uppercase bg-[#f7801b]/15 px-2.5 py-1 rounded-full border border-[#f7801b]/30">
              VEHICLE COMPLIANCE · STATUTORY FILINGS
            </span>
            <DemoBadge label="REGULATORY VERIFIED" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-[#2d140d] uppercase leading-[0.98]">
            VEHICLE <br />
            <span className="text-[#f7801b]">DOCUMENTS.</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5c3a35] mt-3 font-sans font-medium">
            Commercial RC fitness endorsements · PUCC emissions clearance · Carrier insurance policies · National permits
          </p>
        </div>
      </div>

      {/* 2. Controls & Filter Bar */}
      <div className="p-4 rounded-3xl bg-white border border-[#bf7e4d]/25 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#84492d] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vehicle ID, model, or document number..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#FFF5EC] border border-[#bf7e4d]/30 text-xs font-mono text-[#2d140d] placeholder-[#84492d]/70 focus:outline-none focus:border-[#f7801b] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-[#84492d] font-bold hidden sm:inline">Type:</span>
          {['all', 'Insurance', 'PUCC', 'Fitness', 'Permit'].map((t) => (
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
      </div>

      {/* 3. Documents Table */}
      <div className="rounded-3xl bg-white border border-[#bf7e4d]/25 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#FFF5EC] border-b border-[#bf7e4d]/25 text-[#84492d] uppercase font-bold">
              <tr>
                <th className="p-4">Commercial Unit</th>
                <th className="p-4">Document Category</th>
                <th className="p-4">Policy / Certificate #</th>
                <th className="p-4">Issuing Authority</th>
                <th className="p-4">Valid Until</th>
                <th className="p-4">Statutory Status</th>
                <th className="p-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#bf7e4d]/20">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-[#FFF5EC] transition-colors">
                  <td className="p-4">
                    <span className="font-bold text-[#84492d]">{doc.vehicleCode}</span>
                    <span className="text-[10px] text-[#5c3a35] block truncate">{doc.model}</span>
                  </td>
                  <td className="p-4 font-bold text-[#2d140d]">{doc.docType}</td>
                  <td className="p-4 font-black text-[#f7801b]">{doc.docNumber}</td>
                  <td className="p-4 text-[#5c3a35] font-medium">{doc.issuer}</td>
                  <td className="p-4 text-[#2d140d] font-semibold">{doc.expiryDate}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        doc.status === 'valid'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-[#d33e1b] border-amber-300'
                      }`}
                    >
                      {doc.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#bf7e4d]/30 text-[#84492d] hover:bg-[#FFF1E6] font-bold transition-all shadow-2xs">
                      <span>Verified</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
