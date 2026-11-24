'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Truck, Mail, ArrowRight, User } from 'lucide-react'

export const Navbar: React.FC = () => {
  const [hasToken, setHasToken] = useState(false)
  const [activeNav, setActiveNav] = useState('home')

  useEffect(() => {
    const token = localStorage.getItem('fleetvision_token')
    if (token) setHasToken(true)

    const handleScroll = () => {
      const scrollPos = window.scrollY
      if (scrollPos < 400) {
        setActiveNav('home')
      } else if (scrollPos < 1100) {
        setActiveNav('about')
      } else {
        setActiveNav('contact')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className="fixed top-5 inset-x-0 z-50 flex items-center justify-center px-4 pointer-events-none">
      <div className="max-w-6xl w-full flex items-center justify-between pointer-events-auto">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-full border border-[#E5DFD7] shadow-sm hover:border-[#EA6113]/30 transition-all">
          <div className="w-7 h-7 rounded-full bg-[#07518A] flex items-center justify-center text-white">
            <Truck className="w-3.5 h-3.5 text-[#FFE3B3]" />
          </div>
          <span className="text-xs font-bold font-inter tracking-tight text-[#07518A]">
            FLEETVISION <span className="text-[#EA6113]">AI</span>
          </span>
        </Link>

        {/* Floating Pill Navigation (Matching Image 2 Reference) */}
        <nav className="hidden md:flex items-center gap-1 bg-white/95 backdrop-blur-md border border-[#E5DFD7] p-1.5 rounded-full shadow-md">
          <Link
            href="/"
            onClick={() => setActiveNav('home')}
            className={`nav-link px-5 py-2 rounded-full text-xs font-manrope font-semibold transition-all ${
              activeNav === 'home'
                ? 'bg-[#EA6113] text-white shadow-sm'
                : 'text-[#0C1E36] hover:text-[#EA6113]'
            }`}
          >
            Home
          </Link>
          <a
            href="#about"
            onClick={() => setActiveNav('about')}
            className={`nav-link px-5 py-2 rounded-full text-xs font-manrope font-semibold transition-all ${
              activeNav === 'about'
                ? 'bg-[#EA6113] text-white shadow-sm'
                : 'text-[#0C1E36] hover:text-[#EA6113]'
            }`}
          >
            About
          </a>
          <Link
            href="/vehicles"
            className="nav-link px-5 py-2 rounded-full text-xs font-manrope font-semibold text-[#0C1E36] hover:text-[#EA6113] transition-all"
          >
            Fleet
          </Link>
          <a
            href="#contact"
            onClick={() => setActiveNav('contact')}
            className={`nav-link px-5 py-2 rounded-full text-xs font-manrope font-semibold transition-all ${
              activeNav === 'contact'
                ? 'bg-[#EA6113] text-white shadow-sm'
                : 'text-[#0C1E36] hover:text-[#EA6113]'
            }`}
          >
            Contact
          </a>
        </nav>

        {/* Right CTA Button Pill — Enter Platform / Sign In */}
        <div className="flex items-center gap-2.5">
          <a
            href="#contact"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#E5DFD7] hover:border-[#EA6113] text-[#0C1E36] hover:text-[#EA6113] font-manrope text-xs font-semibold transition-all shadow-xs"
          >
            <Mail className="w-3.5 h-3.5 text-[#EA6113]" />
            <span>Contact</span>
          </a>

          <Link
            href="/login"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#EA6113] to-[#F7801B] hover:from-[#F7801B] hover:to-[#FCB234] text-white font-manrope text-xs font-bold uppercase tracking-wider transition-all shadow-[0_2px_12px_rgba(234,97,19,0.35)] hover:shadow-[0_4px_18px_rgba(234,97,19,0.5)] active:scale-95"
            title="Sign in to FleetVision Platform"
          >
            <User className="w-3.5 h-3.5" />
            <span>Enter Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  )
}
