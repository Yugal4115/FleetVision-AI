'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  User,
  LogOut,
  Settings,
  Menu,
  Truck,
  X,
  Globe,
} from 'lucide-react'
import { IAuthUser } from '@/modules/authentication/hooks/useAuth'
import { MagneticPillNav } from './MagneticPillNav'

interface AppHeaderProps {
  user: IAuthUser | null
  currentPath: string
  onToggleMobileMenu: () => void
  onLogout: () => void
}

const BRANCHES = [
  { id: 'bengaluru', name: 'Bengaluru Central Depot', code: 'BLR-01' },
  { id: 'chennai', name: 'Chennai Port Container Hub', code: 'MAA-02' },
  { id: 'mumbai', name: 'Mumbai Express Logistics Corridor', code: 'BOM-03' },
]

export const AppHeader: React.FC<AppHeaderProps> = ({
  user,
  currentPath,
  onToggleMobileMenu,
  onLogout,
}) => {
  const router = useRouter()
  const [selectedBranch, setSelectedBranch] = useState(BRANCHES[0])
  const [branchOpen, setBranchOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/vehicles?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <header className="h-18 px-4 sm:px-6 lg:px-8 bg-white/90 backdrop-blur-xl border-b border-[#E5DFD7] flex items-center justify-between sticky top-0 z-40 shadow-xs text-[#0C1E36]">
      {/* ============================================================== */}
      {/* 1. LEFT: Brand & Logo */}
      {/* ============================================================== */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#0C1E36] hover:bg-[#F5F2ED] transition-colors"
          aria-label="Toggle Mobile Navigation Drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden group"
          title="FleetVision AI Executive Dashboard"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border border-[#3E4452] flex items-center justify-center text-[#F3F4F6] shadow-sm group-hover:scale-105 group-hover:border-[#6B7280] transition-all shrink-0">
            <Truck className="w-5 h-5 text-[#E5E7EB]" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <div className="flex items-center gap-1.5">
              <span className="font-inter text-sm font-bold tracking-tight text-[#07518A]">
                FLEETVISION
              </span>
              <span className="text-[10px] font-manrope font-semibold text-[#f7801b] bg-[#f7801b]/15 px-1.5 py-0.2 rounded border border-[#f7801b]/35">
                AI
              </span>
            </div>
            <p className="text-[8px] font-manrope font-semibold tracking-wider text-[#64748B] uppercase truncate">
              Intelligent Fleet Platform
            </p>
          </div>
        </Link>
      </div>

      {/* ============================================================== */}
      {/* 2. CENTER: Horizontal Magnetic Pill-Shaped Navigation Bar */}
      {/* ============================================================== */}
      <div className="hidden lg:flex items-center justify-center flex-1 px-4">
        <MagneticPillNav />
      </div>

      {/* ============================================================== */}
      {/* 3. RIGHT: Global Search, Depot Selector, Notifications, User */}
      {/* ============================================================== */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Bar (Desktop) */}
        <div className="relative hidden xl:block w-48">
          <form onSubmit={handleSearch} className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fleet..."
              className="w-full h-8 pl-8 pr-3 rounded-full bg-[#F5F2ED] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] placeholder-[#64748B] focus:outline-none focus:border-[#f7801b] focus:bg-white transition-all"
            />
          </form>
        </div>

        {/* Global Search Button (Mobile/Tablet Icon Toggle) */}
        <div className="xl:hidden relative">
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0C1E36] hover:bg-[#F5F2ED] transition-colors"
            title="Search Fleet"
          >
            <Search className="w-4 h-4" />
          </button>

          {searchOpen && (
            <div className="absolute right-0 mt-2 w-72 p-2 bg-white rounded-2xl border border-[#E5DFD7] shadow-xl z-50">
              <form onSubmit={handleSearch} className="flex items-center gap-1.5">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicles, plates..."
                  className="w-full h-9 px-3 rounded-xl bg-[#F5F2ED] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] focus:outline-none focus:border-[#f7801b]"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="p-1.5 text-[#64748B] hover:text-[#0C1E36]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Operational Hub / Branch Selector */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setBranchOpen(!branchOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#FFF5EC] border border-[#E5DFD7] text-xs font-mono text-[#0C1E36] transition-colors shadow-xs"
            title="Operating Depot"
          >
            <Building2 className="w-3.5 h-3.5 text-[#07518A]" />
            <span className="font-bold truncate max-w-[110px]">{selectedBranch.name.split(' ')[0]}</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {branchOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E5DFD7] shadow-2xl p-1.5 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#E5DFD7] text-[10px] font-mono font-bold text-[#64748B] uppercase">
                Switch Operational Hub
              </div>
              {BRANCHES.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b)
                    setBranchOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center justify-between ${
                    selectedBranch.id === b.id
                      ? 'bg-[#f7801b]/15 text-[#f7801b] font-bold border border-[#f7801b]/30'
                      : 'text-[#0C1E36] hover:bg-[#FFF5EC]'
                  }`}
                >
                  <span className="truncate">{b.name}</span>
                  <span className="text-[10px] text-[#64748B]">{b.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon with Live Pulse Indicator */}
        <Link
          href="/notifications"
          className="p-2 rounded-xl text-[#64748B] hover:text-[#0C1E36] hover:bg-[#F5F2ED] transition-colors relative"
          title="Fleet Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f7801b] ring-2 ring-white animate-pulse" />
        </Link>

        {/* Operator Profile Avatar & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full hover:bg-[#F5F2ED] border border-transparent hover:border-[#E5DFD7] transition-all"
            aria-label="User Account Menu"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#2D3139] to-[#111317] border border-[#3E4452] text-[#F3F4F6] flex items-center justify-center font-mono font-bold text-xs shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="text-xs font-mono font-bold text-[#0C1E36] hidden sm:inline truncate max-w-[90px]">
              {user?.name?.split(' ')[0] || 'Operator'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#64748B] hidden sm:inline" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E5DFD7] shadow-2xl p-2 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
              <div className="px-3 py-2.5 border-b border-[#E5DFD7] mb-1">
                <p className="text-xs font-bold font-sans text-[#0C1E36] truncate">
                  {user?.name || 'Fleet Operator'}
                </p>
                <p className="text-[10px] font-mono text-[#64748B] truncate">
                  {user?.email || 'operator@fleetvision.ai'}
                </p>
                <span className="inline-block mt-1 text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#f7801b]/15 text-[#f7801b] border border-[#f7801b]/30">
                  {user?.role || 'FLEET COMMANDER'}
                </span>
              </div>

              <Link
                href="/profile"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors"
              >
                <User className="w-3.5 h-3.5 text-[#64748B]" />
                <span>My Profile</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Settings</span>
              </Link>

              <Link
                href="/"
                onClick={() => setProfileOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-[#0C1E36] hover:bg-[#FFF5EC] transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Public Portal</span>
              </Link>

              <div className="border-t border-[#E5DFD7] my-1" />

              <button
                onClick={() => {
                  setProfileOpen(false)
                  onLogout()
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-mono text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
