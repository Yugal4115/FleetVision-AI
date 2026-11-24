'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { OptimusAssistantWidget } from '@/modules/ai/OptimusAssistantWidget'
import { CinematicLiveBackground } from './CinematicLiveBackground'
import { useAuth } from '@/modules/authentication/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface AppLayoutProps {
  children: React.ReactNode
}

/**
 * FLEETVISION AI — CINEMATIC LIVE COMMAND CENTER LAYOUT
 * 
 * - Full-immersion dark cinematic glassmorphism architecture.
 * - Hardware-accelerated CinematicLiveBackground with horizon telemetry grid.
 * - Translucent obsidian & titanium command decks.
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout, loading } = useAuth()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Check authentication status once session resolution is complete
  useEffect(() => {
    if (mounted && !loading) {
      if (!user) {
        router.push('/login')
      }
    }
  }, [mounted, loading, user, router])

  // While checking session on client hydration
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center font-mono text-xs text-[#0C1E36]">
        <div className="flex items-center gap-3 p-6 rounded-2xl bg-white/95 border border-[#E5DFD7] shadow-2xl backdrop-blur-xl">
          <Loader2 className="w-5 h-5 animate-spin text-[#f7801b]" />
          <span className="font-bold tracking-widest uppercase text-[#07518A]">INITIALIZING FLEET COMMAND...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#0C1E36] flex flex-col font-sans selection:bg-[#FFE3B3] selection:text-[#07518A] relative">
      {/* Universal 4K Cinematic Live Background Canvas */}
      <CinematicLiveBackground />

      <div className="flex flex-1 min-w-0 relative z-10">
        {/* Responsive Left Sidebar */}
        <AppSidebar
          user={user}
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapse={() => setCollapsed(!collapsed)}
          onCloseMobile={() => setMobileOpen(false)}
          onLogout={logout}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Navigation Bar */}
          <AppHeader
            user={user}
            currentPath={pathname}
            onToggleMobileMenu={() => setMobileOpen(true)}
            onLogout={logout}
          />

          {/* Dynamic Page Viewport with Live Cinematic Environment */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-transparent overflow-x-hidden relative">
            <div className="max-w-[1440px] mx-auto space-y-6 relative z-10 w-full">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Persistent Floating Intelligent Copilot (Optimus Transformer Icon) */}
      <OptimusAssistantWidget />
    </div>
  )
}
