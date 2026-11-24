'use client'

import React from 'react'
import { Cpu, ShieldCheck, Zap, TrendingUp, Gauge, Navigation, ArrowUpRight } from 'lucide-react'

const PILLARS = [
  {
    num: '01',
    title: 'Heavy Commercial Telemetry',
    subtitle: 'CAN 2.0B Hardware Synchronization',
    description:
      'Synchronize operational metrics across heavy commercial vehicle fleets with sub-second register updates. Track engine temperatures, fluid reserves, and brake pressure cycles across inter-state corridors.',
    metric: 'Real-time telemetry',
    color: '#07518A',
  },
  {
    num: '02',
    title: 'Predictive Lifecycle Modeling',
    subtitle: 'Automated Wear Early-Warning',
    description:
      'Identify critical mechanical degradation before component breakdown occurs. AI-driven predictive algorithms schedule garage services at optimal intervals, eliminating highway immobilizations.',
    metric: 'Pre-failure alert radar',
    color: '#EA6113',
  },
  {
    num: '03',
    title: 'Dispatch & Route Analytics',
    subtitle: 'Trip Margin & Corridor Modeling',
    description:
      'Connect drivers, dynamic waypoints, and automated load allocation into one coherent dispatch matrix. Calculate real-time trip profit & loss with accurate fuel consumption tracking.',
    metric: 'Trip margin tracking',
    color: '#FBB931',
  },
]

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 sm:py-32 bg-white text-[#0C1E36] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-[#E5DFD7] pb-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FFF1E6] border border-[#FFE3B3]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA6113]" />
              <span className="label-meta text-xs font-manrope font-medium text-[#07518A] uppercase tracking-wider">
                About FleetVision AI
              </span>
            </div>
            <h2 className="section-heading text-4xl sm:text-6xl font-bold font-inter tracking-tight text-[#07518A] uppercase leading-[1.02]">
              ENGINEERED FOR <br />
              <span className="text-[#EA6113]">PRECISION LOGISTICS</span>
            </h2>
          </div>

          <p className="body-content max-w-md text-sm sm:text-base text-[#0C1E36]/75 leading-relaxed font-manrope font-normal">
            FleetVision AI bridges heavy-duty commercial transport engineering with predictive
            intelligence. Designed for fleet operators managing multi-unit fleets across freight
            and commercial routes.
          </p>
        </div>

        {/* 3 Numbered Editorial Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PILLARS.map((p) => (
            <div
              key={p.num}
              className="p-8 rounded-3xl bg-[#FAFAF9] border border-[#E5DFD7] hover:border-[#EA6113]/40 hover:bg-[#FFF1E6]/30 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <span className="stat-highlight text-3xl font-bold font-inter text-[#07518A] group-hover:text-[#EA6113] transition-colors">
                    {p.num}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-white border border-[#E5DFD7] flex items-center justify-center text-[#07518A] group-hover:bg-[#EA6113] group-hover:text-white transition-all">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="card-heading text-xl font-semibold font-manrope text-[#07518A] uppercase tracking-tight mb-2">
                  {p.title}
                </h3>
                <p className="subtitle text-xs font-manrope font-medium text-[#EA6113] uppercase tracking-wider mb-4">
                  {p.subtitle}
                </p>
                <p className="body-content text-sm text-[#0C1E36]/80 leading-relaxed font-manrope font-normal">
                  {p.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E5DFD7] flex items-center justify-between text-xs font-mono">
                <span className="text-[#0C1E36]/60 uppercase">Capability</span>
                <span className="font-bold text-[#07518A]">{p.metric}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
