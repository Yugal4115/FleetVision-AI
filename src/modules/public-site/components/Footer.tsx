'use client'

import React from 'react'
import Link from 'next/link'
import { Truck, ArrowUpRight } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#E5DFD7] text-[#0C1E36]">
      {/* Top Banner Band */}
      <div className="bg-[#FFF1E6] border-b border-[#FFE3B3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-widest text-[#EA6113] mb-3">
              Fleet Operations & Intelligence
            </p>
            <h2 className="text-4xl sm:text-5xl font-black font-sans uppercase text-[#07518A] leading-tight">
              COMMERCIAL TELEMETRY <br />
              <span className="text-[#EA6113]">ACCELERATED.</span>
            </h2>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#07518A] hover:bg-[#0C1E36] text-white font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            <span>OPERATOR PORTAL</span>
            <ArrowUpRight className="w-4 h-4 text-[#FBB931]" />
          </Link>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#07518A] flex items-center justify-center text-white">
                <Truck className="w-4 h-4 text-[#FFE3B3]" />
              </div>
              <span className="font-mono font-black text-sm tracking-tight text-[#07518A]">
                FLEETVISION AI
              </span>
            </div>
            <p className="text-xs text-[#0C1E36]/70 leading-relaxed font-sans max-w-xs">
              Intelligent Fleet Management & Predictive Analytics Platform. Connecting vehicles, drivers, trips and maintenance.
            </p>
          </div>

          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A] mb-4">
              Platform
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#0C1E36]/75">
              <li><Link href="/" className="hover:text-[#EA6113] transition-colors">Public Overview</Link></li>
              <li><a href="#about" className="hover:text-[#EA6113] transition-colors">Core Capabilities</a></li>
              <li><a href="#contact" className="hover:text-[#EA6113] transition-colors">Onboarding</a></li>
              <li><Link href="/login" className="hover:text-[#EA6113] transition-colors">Login Portal</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A] mb-4">
              Operations
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[#0C1E36]/75">
              <li><span className="text-[#0C1E36]/80">Vehicle Registry</span></li>
              <li><span className="text-[#0C1E36]/80">Driver Profiles</span></li>
              <li><span className="text-[#0C1E36]/80">Route Dispatch</span></li>
              <li><span className="text-[#0C1E36]/80">Maintenance Radar</span></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#07518A] mb-4">
              Security
            </p>
            <p className="text-xs text-[#0C1E36]/70 leading-relaxed font-mono">
              Tier-1 Enterprise Telematics Encrypted · SOC2 Compliant Cloud Architecture.
            </p>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#E5DFD7] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#0C1E36]/60">
          <p>© 2026 FleetVision AI. All rights reserved.</p>
          <p>Bengaluru Central Logistics Hub</p>
        </div>
      </div>
    </footer>
  )
}
