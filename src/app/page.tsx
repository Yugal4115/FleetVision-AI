'use client'

import React from 'react'
import { Navbar } from '@/modules/public-site/components/Navbar'
import { HeroScene } from '@/modules/public-site/components/HeroScene'
import { AboutSection } from '@/modules/public-site/sections/AboutSection'
import { ContactSection } from '@/modules/public-site/sections/ContactSection'
import { Footer } from '@/modules/public-site/components/Footer'
import { OptimusAssistantWidget } from '@/modules/ai/OptimusAssistantWidget'

export default function PublicLandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0C1E36] flex flex-col font-sans selection:bg-[#FFE3B3] selection:text-[#07518A] scroll-smooth">
      {/* 1. Global Public Navbar (Frosted White & Sunset) */}
      <Navbar />

      {/* 2. Main Page Sections */}
      <main className="flex-1">
        <HeroScene />
        <AboutSection />
        <ContactSection />
      </main>

      {/* 3. Refined Sunset & White Footer */}
      <Footer />

      {/* 4. Autonomous Optimus AI Assistant Floating Widget */}
      <OptimusAssistantWidget />
    </div>
  )
}
