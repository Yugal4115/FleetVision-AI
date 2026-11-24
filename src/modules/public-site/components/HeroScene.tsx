'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Activity, Truck, ShieldCheck } from 'lucide-react'

const LIVE_TICKER_ITEMS = [
  'HEAVY TRANSPORT TELEMETRY',
  'PREDICTIVE COMPONENT LIFECYCLE',
  'AUTONOMOUS DISPATCH INTELLIGENCE',
  'ROUTE EFFICIENCY MODELING',
  'DRIVER SAFETY TELEMATICS',
  'FLEET RADAR VERIFICATION',
]

export const HeroScene: React.FC = () => {
  const [revealed, setRevealed] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 150)
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#FFF1E6]/40 via-white to-[#FAFAF9] pt-24"
    >
      {/* Top Editorial Anchor */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10 pb-6 relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#EA6113]" />
          <span className="text-xs font-manrope font-medium tracking-widest text-[#07518A] uppercase">
            FLEET OPERATIONS PLATFORM · 2026 EDITION
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8">
            <h1 className="hero-headline text-5xl sm:text-7xl lg:text-8xl font-extrabold font-inter tracking-tight text-[#07518A] uppercase leading-[0.98]">
              INTELLIGENCE <br />
              <span className="text-[#EA6113]">MOVING EVERY FLEET.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <p className="body-content text-sm sm:text-base text-[#0C1E36]/80 leading-relaxed font-manrope font-normal">
              An intelligent fleet management platform connecting vehicles, drivers, trips and
              predictive insights. Engineered for demanding commercial logistics corridors.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/login"
                className="btn-action group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#f7801b] via-[#e35020] to-[#d33e1b] hover:from-[#fba41c] hover:to-[#e35020] text-white font-manrope text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(247,128,27,0.4)] hover:shadow-[0_4px_28px_rgba(247,128,27,0.6)] active:scale-95"
              >
                <span>ENTER PLATFORM</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </Link>
              <a
                href="#about"
                className="btn-action inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-[#FFF1E6] text-[#07518A] border border-[#E5DFD7] font-manrope text-xs font-semibold transition-all hover:border-[#f7801b]/40 shadow-xs"
              >
                <span>SPECIFICATIONS</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Flagship Truck Photographic Showcase: Dark Volvo FH16 on Mountain Highway */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 my-4">
        <div className="relative aspect-[21/9] sm:aspect-[21/8] w-full rounded-3xl overflow-hidden shadow-2xl border border-[#FFE3B3]/60 bg-slate-900 group">
          <img
            src="/assets/login/volvo-fh16-login-reference.png"
            alt="Dark Volvo FH16 750 Heavy Commercial Flagship on Mountain Route"
            className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-[1.02] transition-transform duration-700"
          />

          {/* Warm Ambient Sunset Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C1E36]/80 via-transparent to-transparent pointer-events-none" />

          {/* Bottom Telemetry Overlay Tag */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs font-mono">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-[#07518A]/90 text-white font-bold backdrop-blur-md">
                FLAGSHIP ASSET
              </span>
              <span className="text-[#FFE3B3] font-semibold hidden sm:inline">
                Volvo FH16 750 · Inter-State Heavy Haulage
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#FFE3B3]">
              <ShieldCheck className="w-4 h-4 text-[#FBB931]" />
              <span>VERIFIED COMMERCIAL TELEMETRY</span>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Ticker: Live Operational Capabilities */}
      <div className="w-full bg-[#FFF1E6] border-y border-[#FFE3B3] py-3.5 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8">
          {[...LIVE_TICKER_ITEMS, ...LIVE_TICKER_ITEMS].map((item, idx) => (
            <div key={idx} className="flex items-center gap-8 text-xs font-mono font-bold text-[#07518A] tracking-wider uppercase">
              <span>{item}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#EA6113]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
