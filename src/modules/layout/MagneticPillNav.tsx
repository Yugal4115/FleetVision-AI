'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown,
  LayoutDashboard,
  Truck,
  Users,
  MapPin,
  Fuel,
  Wrench,
  DollarSign,
  Brain,
  MessageSquareCode,
  BarChart3,
  Bell,
  UserCheck,
  Settings,
  User,
  ShieldAlert,
  Boxes,
  RotateCw,
  ExternalLink,
} from 'lucide-react'
import { TransformerOptimusIcon } from '@/modules/ai/OptimusAssistantWidget'

export interface INavItemDef {
  id: string
  label: string
  href?: string
  hasDropdown: boolean
  dropdownGroups?: Array<{
    title: string
    items: Array<{
      label: string
      href: string
      icon: React.ElementType
      badge?: string
      desc?: string
    }>
  }>
}

export const NAV_ITEMS: INavItemDef[] = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    hasDropdown: false,
  },
  {
    id: 'fleet-operations',
    label: 'Fleet Operations',
    hasDropdown: true,
    dropdownGroups: [
      {
        title: 'FLEET ASSETS',
        items: [
          {
            label: 'All Vehicles',
            href: '/vehicles',
            icon: Truck,
            desc: 'Asset inventory & telemetry console',
          },
          {
            label: 'Add Vehicle',
            href: '/vehicles/new',
            icon: Boxes,
            desc: 'Register new commercial unit',
          },
          {
            label: 'Vehicle Documents',
            href: '/vehicles/documents',
            icon: ShieldAlert,
            desc: 'Insurance, PUCC & RC fitness',
          },
          {
            label: 'Vehicle Health',
            href: '/vehicles/health',
            icon: Wrench,
            desc: 'Diagnostic subsystem radar',
          },
          {
            label: '360° Vehicle Explorer',
            href: '/vehicles/explorer',
            icon: RotateCw,
            badge: '2D Tour',
            desc: 'Teal Volvo FH Aero multi-angle tour',
          },
        ],
      },
      {
        title: 'CREW & OPERATIONS',
        items: [
          {
            label: 'Driver Management',
            href: '/drivers',
            icon: Users,
            desc: 'Active driver roster & profiles',
          },
          {
            label: 'Trip Management',
            href: '/trips',
            icon: MapPin,
            desc: 'Logistics missions & corridors',
          },
          {
            label: 'Live Tracking',
            href: '/tracking',
            icon: MapPin,
            badge: 'GPS',
            desc: 'Real-time satellite fleet map',
          },
          {
            label: 'Fuel & Energy',
            href: '/fuel',
            icon: Fuel,
            desc: 'Fuel logs & EV charging analytics',
          },
          {
            label: 'Maintenance',
            href: '/maintenance',
            icon: Wrench,
            desc: 'Service orders & repair logs',
          },
          {
            label: 'Expense Ledger',
            href: '/expenses',
            icon: DollarSign,
            desc: 'Operating costs & financial ledger',
          },
        ],
      },
    ],
  },
  {
    id: 'intelligence',
    label: 'Intelligence',
    hasDropdown: true,
    dropdownGroups: [
      {
        title: 'SAFETY & PREDICTIONS',
        items: [
          {
            label: 'Driver Safety Radar',
            href: '/drivers/safety',
            icon: ShieldAlert,
            desc: 'Behavioral safety score analysis',
          },
          {
            label: 'Predictive Maintenance',
            href: '/ai-center#maintenance',
            icon: Brain,
            badge: 'ML',
            desc: 'Early warning component forecasting',
          },
          {
            label: 'Fuel Prediction',
            href: '/ai-center#fuel',
            icon: Fuel,
            badge: 'ML',
            desc: 'Consumption anomaly models',
          },
          {
            label: 'Accident Risk Estimation',
            href: '/ai-center#risk',
            icon: ShieldAlert,
            desc: 'Corridor risk & weather analysis',
          },
          {
            label: 'Vehicle Health Assessment',
            href: '/ai-center#health',
            icon: Wrench,
            desc: 'CAN bus algorithmic evaluation',
          },
        ],
      },
      {
        title: 'AI ASSISTANT & ANALYTICS',
        items: [
          {
            label: 'Fleet AI Assistant',
            href: '/ai-assistant',
            icon: MessageSquareCode,
            badge: 'LLM',
            desc: 'Autonomous fleet copilot with LLM reasoning',
          },
          {
            label: 'Fleet Analytics',
            href: '/ai-center#analytics',
            icon: BarChart3,
            desc: 'Strategic performance intelligence',
          },
        ],
      },
    ],
  },
  {
    id: 'management',
    label: 'Management',
    hasDropdown: true,
    dropdownGroups: [
      {
        title: 'REPORTS & ALERTS',
        items: [
          {
            label: 'Executive Reports',
            href: '/reports',
            icon: BarChart3,
            desc: 'Consolidated audits & exports',
          },
          {
            label: 'Notifications',
            href: '/notifications',
            icon: Bell,
            desc: 'Live telemetry alerts & events',
          },
        ],
      },
      {
        title: 'ADMINISTRATION',
        items: [
          {
            label: 'Users & Access',
            href: '/users',
            icon: UserCheck,
            desc: 'Role-based access & permissions',
          },
          {
            label: 'Platform Settings',
            href: '/settings',
            icon: Settings,
            desc: 'Depot parameters & system configs',
          },
          {
            label: 'My Profile',
            href: '/profile',
            icon: User,
            desc: 'Personal preferences & credentials',
          },
        ],
      },
    ],
  },
]

export function MagneticPillNav() {
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Map<string, HTMLButtonElement | HTMLAnchorElement>>(new Map())
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 1. Determine active group from current route
  const getActiveGroupId = useCallback((): string => {
    if (!pathname || pathname === '/' || pathname.startsWith('/dashboard')) {
      return 'overview'
    }
    if (
      pathname.startsWith('/vehicles') ||
      pathname.startsWith('/drivers') ||
      pathname.startsWith('/trips') ||
      pathname.startsWith('/tracking') ||
      pathname.startsWith('/fuel') ||
      pathname.startsWith('/maintenance') ||
      pathname.startsWith('/expenses')
    ) {
      return 'fleet-operations'
    }
    if (pathname.startsWith('/ai-center') || pathname.startsWith('/ai-assistant')) {
      return 'intelligence'
    }
    if (
      pathname.startsWith('/reports') ||
      pathname.startsWith('/notifications') ||
      pathname.startsWith('/users') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/profile')
    ) {
      return 'management'
    }
    return 'overview'
  }, [pathname])

  const activeGroupId = getActiveGroupId()
  const [hoveredGroupId, setHoveredGroupId] = useState<string | null>(null)
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // 2. Physical Magnetic Pill Dimensions & Position
  const [pillRect, setPillRect] = useState<{ x: number; width: number; height: number; opacity: number }>({
    x: 0,
    width: 0,
    height: 0,
    opacity: 0,
  })

  // 3. Subtle Magnetic Cursor Position near capsule
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number; visible: boolean }>({
    x: 0,
    y: 0,
    visible: false,
  })

  const updatePillToItem = useCallback((itemId: string | null) => {
    if (!navRef.current) return
    const targetId = itemId || activeGroupId
    if (targetId === 'intelligence') {
      setPillRect((prev) => ({ ...prev, opacity: 0 }))
      return
    }
    const targetEl = itemRefs.current.get(targetId)

    if (targetEl) {
      const navBox = navRef.current.getBoundingClientRect()
      const targetBox = targetEl.getBoundingClientRect()
      setPillRect({
        x: targetBox.left - navBox.left,
        width: targetBox.width,
        height: targetBox.height,
        opacity: 1,
      })
    }
  }, [activeGroupId])

  // Reposition on mount, route change, and window resize
  useEffect(() => {
    updatePillToItem(hoveredGroupId || activeGroupId)
    const handleResize = () => updatePillToItem(hoveredGroupId || activeGroupId)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [pathname, activeGroupId, hoveredGroupId, updatePillToItem])

  // Close dropdown on route change
  useEffect(() => {
    setOpenDropdownId(null)
    setHoveredGroupId(null)
  }, [pathname])

  // Mouse move inside capsule for magnetic cursor follower
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!navRef.current) return
    const navBox = navRef.current.getBoundingClientRect()
    setCursorPos({
      x: e.clientX - navBox.left,
      y: e.clientY - navBox.top,
      visible: true,
    })
  }

  const handleMouseEnterNav = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
  }

  const handleMouseLeaveNav = () => {
    setCursorPos((prev) => ({ ...prev, visible: false }))
    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredGroupId(null)
      setOpenDropdownId(null)
      updatePillToItem(activeGroupId)
    }, 240)
  }

  const handleItemHover = (id: string, hasDropdown: boolean) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    setHoveredGroupId(id)
    updatePillToItem(id)
    if (hasDropdown) {
      setOpenDropdownId(id)
    } else {
      setOpenDropdownId(null)
    }
  }

  const handleItemClick = (item: INavItemDef) => {
    if (item.hasDropdown) {
      setOpenDropdownId((prev) => (prev === item.id ? null : item.id))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, item: INavItemDef) => {
    if (e.key === 'Escape') {
      setOpenDropdownId(null)
    }
    if (e.key === 'Enter' || e.key === ' ') {
      if (item.hasDropdown) {
        e.preventDefault()
        setOpenDropdownId((prev) => (prev === item.id ? null : item.id))
      }
    }
  }

  return (
    <div
      ref={navRef}
      onMouseEnter={handleMouseEnterNav}
      onMouseLeave={handleMouseLeaveNav}
      onMouseMove={handleMouseMove}
      className="relative flex items-center select-none"
    >
      {/* 4. Magnetic Capsule Container — Frosted Pearl Glass (Public Portal Style) */}
      <nav
        aria-label="Main Navigation"
        className="relative flex items-center gap-1 p-1.5 rounded-full bg-white/95 backdrop-blur-xl border border-[#E5DFD7] shadow-md z-30"
      >
        {/* PHYSICAL SPRING-ANIMATED MAGNETIC PILL INDICATOR */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-[#f7801b] to-[#d33e1b] shadow-md shadow-[#f7801b]/35 pointer-events-none z-0"
          initial={false}
          animate={{
            x: pillRect.x,
            width: pillRect.width,
            height: pillRect.height,
            opacity: pillRect.opacity,
          }}
          transition={{
            type: 'spring',
            stiffness: 450,
            damping: 35,
            mass: 0.8,
          }}
        />

        {/* SUBTLE MAGNETIC CURSOR FOLLOWER DOT */}
        {cursorPos.visible && (
          <motion.div
            className="pointer-events-none absolute w-5 h-5 rounded-full border border-[#f7801b]/50 bg-[#f7801b]/10 z-10 hidden md:block"
            animate={{
              x: cursorPos.x - 10,
              y: cursorPos.y - 10,
            }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 28,
              mass: 0.2,
            }}
          />
        )}

        {/* 4 Primary Navigation Items */}
        {NAV_ITEMS.map((item) => {
          const isItemActive = activeGroupId === item.id
          const isItemHovered = hoveredGroupId === item.id
          const isTargeted = isItemHovered || (!hoveredGroupId && isItemActive)
          const isOpen = openDropdownId === item.id

          if (item.id === 'intelligence') {
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el)
                }}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onMouseEnter={() => handleItemHover(item.id, true)}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                title="Fleet Intelligence & Optimus AI Copilot"
                className="relative z-20 flex items-center justify-center p-1 rounded-full transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer mx-1.5 focus:outline-none"
              >
                <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border-2 border-[#EA6113] flex items-center justify-center shadow-[0_0_14px_rgba(234,97,19,0.55)]">
                  <TransformerOptimusIcon className="w-5 h-5" variant="graphite" opticGlow opticColor="#EA6113" />
                  <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA6113] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EA6113] border border-white" />
                  </span>
                </div>
              </button>
            )
          }

          if (item.hasDropdown) {
            return (
              <button
                key={item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el)
                }}
                type="button"
                aria-expanded={isOpen}
                aria-haspopup="menu"
                onMouseEnter={() => handleItemHover(item.id, true)}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => handleKeyDown(e, item)}
                className={`nav-link relative z-20 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-manrope font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7801b] ${isTargeted ? 'text-white' : 'text-[#0C1E36] hover:text-[#EA6113]'
                  }`}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                    } ${isTargeted ? 'text-white' : 'text-[#64748B]'}`}
                />
              </button>
            )
          }

          return (
            <Link
              key={item.id}
              href={item.href || '/dashboard'}
              ref={(el) => {
                if (el) itemRefs.current.set(item.id, el)
              }}
              onMouseEnter={() => handleItemHover(item.id, false)}
              onKeyDown={(e) => handleKeyDown(e, item)}
              className={`nav-link relative z-20 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-manrope font-semibold transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7801b] ${isTargeted ? 'text-white' : 'text-[#0C1E36] hover:text-[#EA6113]'
                }`}
            >
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* 5. Smooth Spring Dropdown Content Menus */}
      <AnimatePresence>
        {openDropdownId && (
          <motion.div
            key={openDropdownId}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={handleMouseEnterNav}
            onMouseLeave={handleMouseLeaveNav}
            className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 w-[540px] max-w-[95vw] rounded-3xl bg-white/95 backdrop-blur-2xl border border-[#E5DFD7] shadow-[0_16px_48px_rgba(0,0,0,0.12)] p-5 z-40 text-[#0C1E36]"
          >
            {/* Visual Arrow Pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-[#E5DFD7]" />

            {/* Dropdown Groups Grid */}
            {NAV_ITEMS.find((n) => n.id === openDropdownId)?.dropdownGroups && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                {NAV_ITEMS.find((n) => n.id === openDropdownId)!.dropdownGroups!.map((grp, gIdx) => (
                  <div key={gIdx} className="space-y-2">
                    <span className="subsection-title text-[11px] font-inter font-semibold tracking-wider uppercase text-[#f7801b] block px-2">
                      {grp.title}
                    </span>
                    <div className="space-y-1">
                      {grp.items.map((sub, sIdx) => {
                        const Icon = sub.icon
                        const isSubActive = pathname === sub.href
                        return (
                          <Link
                            key={sIdx}
                            href={sub.href}
                            onClick={() => setOpenDropdownId(null)}
                            className={`group flex items-start gap-3 p-2.5 rounded-2xl transition-all duration-150 ${isSubActive
                              ? 'bg-gradient-to-r from-[#f7801b] via-[#e35020] to-[#d33e1b] text-white shadow-md shadow-[#f7801b]/30'
                              : 'hover:bg-[#FFF5EC] border border-transparent'
                              }`}
                          >
                            <div
                              className={`p-2 rounded-xl shrink-0 transition-all duration-150 ${isSubActive
                                ? 'bg-[#111827] text-white border border-[#4B5563] shadow-sm'
                                : 'bg-gradient-to-br from-[#2D3139] to-[#181A20] text-[#E5E7EB] border border-[#3E4452] shadow-xs group-hover:from-[#1E2128] group-hover:to-[#0F1115] group-hover:text-white group-hover:border-[#6B7280]'
                                }`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1 pt-0.5">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`card-heading text-xs font-manrope font-semibold truncate ${isSubActive
                                    ? 'text-white'
                                    : 'text-[#0C1E36] group-hover:text-[#f7801b]'
                                    }`}
                                >
                                  {sub.label}
                                </span>
                                {sub.badge && (
                                  <span
                                    className={`label-meta text-[8px] font-manrope font-medium px-1.5 py-0.2 rounded uppercase ${isSubActive
                                      ? 'bg-white/25 text-white border border-white/30'
                                      : 'bg-[#f7801b]/20 text-[#f7801b] border border-[#f7801b]/40'
                                      }`}
                                  >
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.desc && (
                                <p
                                  className={`desc-text text-[10px] font-manrope font-normal line-clamp-1 mt-0.5 ${isSubActive ? 'text-white/80' : 'text-[#64748B]'
                                    }`}
                                >
                                  {sub.desc}
                                </p>
                              )}
                            </div>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
