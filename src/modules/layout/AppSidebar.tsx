'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Truck,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  LogOut,
} from 'lucide-react'
import {
  FLEET_NAVIGATION,
  INavItem,
  INavSection,
  INavGroup,
  INavSubItem,
} from './navigationConfig'
import { IAuthUser } from '@/modules/authentication/hooks/useAuth'

interface AppSidebarProps {
  user: IAuthUser | null
  collapsed: boolean
  mobileOpen: boolean
  onToggleCollapse: () => void
  onCloseMobile: () => void
  onLogout: () => void
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  user,
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
  onLogout,
}) => {
  const pathname = usePathname()

  const isLinkActive = useCallback(
    (href?: string) => {
      if (!href) return false
      const basePath = href.split('#')[0]
      if (basePath === '/dashboard') return pathname === '/dashboard' || pathname === '/'
      return pathname === basePath || pathname.startsWith(basePath + '/')
    },
    [pathname]
  )

  const isItemActive = useCallback(
    (item: INavItem) => {
      if (item.href && isLinkActive(item.href)) return true
      if (item.subItems) {
        return item.subItems.some((sub) => isLinkActive(sub.href))
      }
      return false
    },
    [isLinkActive]
  )

  const isGroupActive = useCallback(
    (group: INavGroup) => {
      return group.items.some((item) => isItemActive(item))
    },
    [isItemActive]
  )

  // Track expanded groups and modules
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>(() => ({
    'fleet-assets': true,
    vehicles: true,
    'safety-predictions': false,
    'ai-assistant-group': false,
    'reports-alerts': false,
    administration: false,
    'ai-center': false,
  }))

  useEffect(() => {
    FLEET_NAVIGATION.forEach((section) => {
      section.groups?.forEach((group) => {
        if (group.items.some((item) => isItemActive(item))) {
          setExpandedKeys((prev) => ({ ...prev, [group.id]: true }))
        }
        group.items.forEach((item) => {
          if (item.subItems?.some((sub) => isLinkActive(sub.href))) {
            setExpandedKeys((prev) => ({ ...prev, [item.id]: true }))
          }
        })
      })
      section.items?.forEach((item) => {
        if (item.subItems?.some((sub) => isLinkActive(sub.href))) {
          setExpandedKeys((prev) => ({ ...prev, [item.id]: true }))
        }
      })
    })
  }, [pathname, isLinkActive, isItemActive])

  const toggleKey = (key: string) => {
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Render Submenu Link (Clean pill when active, inspired by Agenciex reference)
  const renderSubItem = (sub: INavSubItem) => {
    const active = isLinkActive(sub.href)
    return (
      <Link
        key={sub.id}
        href={sub.href}
        onClick={onCloseMobile}
        className={`nav-link group flex items-center justify-between px-3 py-2 rounded-full text-xs font-manrope font-semibold transition-all duration-200 ${
          active
            ? 'bg-gradient-to-r from-[#f7801b] to-[#d33e1b] text-white shadow-md shadow-[#f7801b]/30'
            : 'text-[#0C1E36] hover:text-[#EA6113] hover:bg-[#FFF5EC] font-medium'
        }`}
      >
        <span className="truncate">{sub.title}</span>
        {sub.badge && (
          <span
            className={`label-meta text-[9px] font-manrope font-medium px-2 py-0.5 rounded-full uppercase ml-1 shrink-0 ${
              active
                ? 'bg-white/25 text-white'
                : 'bg-[#f7801b]/15 text-[#EA6113] border border-[#f7801b]/30'
            }`}
          >
            {sub.badge}
          </span>
        )}
      </Link>
    )
  }

  // Render Module or Direct Link (Simple, clean, non-boxy)
  const renderItem = (item: INavItem) => {
    const Icon = item.icon
    const hasSubItems = Boolean(item.subItems && item.subItems.length > 0)
    const isExpanded = Boolean(expandedKeys[item.id])
    const active = item.href ? isLinkActive(item.href) : false
    const childActive = item.subItems?.some((sub) => isLinkActive(sub.href))

    if (!hasSubItems) {
      return (
        <Link
          key={item.id}
          href={item.href || '#'}
          onClick={onCloseMobile}
          className={`nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-manrope font-semibold transition-all duration-200 group ${
            active
              ? 'bg-gradient-to-r from-[#f7801b] to-[#d33e1b] text-white shadow-md shadow-[#f7801b]/35'
              : 'text-[#0C1E36] hover:bg-[#FFF5EC] hover:text-[#EA6113] font-medium'
          }`}
          title={collapsed ? item.title : undefined}
        >
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              active ? 'text-white' : 'text-[#64748B] group-hover:text-[#EA6113]'
            }`}
          />
          {!collapsed && <span className="truncate flex-1">{item.title}</span>}
          {!collapsed && item.badge && (
            <span
              className={`label-meta text-[9px] font-medium px-2 py-0.5 rounded-full uppercase font-manrope ${
                active
                  ? 'bg-white/25 text-white'
                  : 'bg-[#f7801b]/15 text-[#EA6113] border border-[#f7801b]/30'
              }`}
            >
              {item.badge}
            </span>
          )}
        </Link>
      )
    }

    return (
      <div key={item.id} className="space-y-0.5">
        <button
          type="button"
          onClick={() => toggleKey(item.id)}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-all duration-200 group ${
            childActive
              ? 'text-[#07518A] font-bold bg-[#FFF5EC]'
              : 'text-[#0C1E36] hover:bg-[#FFF5EC] hover:text-[#EA6113] font-medium'
          }`}
          title={collapsed ? item.title : undefined}
        >
          <Icon
            className={`w-4 h-4 shrink-0 transition-colors ${
              childActive ? 'text-[#EA6113]' : 'text-[#64748B] group-hover:text-[#EA6113]'
            }`}
          />
          {!collapsed && (
            <>
              <span className="truncate flex-1 text-left">{item.title}</span>
              {item.badge && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase font-mono bg-[#EA6113]/15 text-[#EA6113] mr-1">
                  {item.badge}
                </span>
              )}
              <span className="text-[#64748B] group-hover:text-[#0C1E36] transition-transform duration-200">
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-[#EA6113]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </span>
            </>
          )}
        </button>

        {!collapsed && isExpanded && item.subItems && (
          <div className="pl-4 pr-1 py-1 space-y-0.5 border-l border-[#E5DFD7] ml-5 my-1 animate-in fade-in-50 duration-200">
            {item.subItems.map((sub) => renderSubItem(sub))}
          </div>
        )}
      </div>
    )
  }

  // Render Secondary Group (Clean, flat, simple heading)
  const renderGroup = (group: INavGroup) => {
    const isExpanded = Boolean(expandedKeys[group.id])
    const active = isGroupActive(group)
    const GroupIcon = group.icon

    if (collapsed) {
      return (
        <div key={group.id} className="space-y-1 pt-1">
          <div className="w-6 h-px bg-[#E5DFD7] mx-auto my-1.5" />
          {group.items.map((item) => renderItem(item))}
        </div>
      )
    }

    return (
      <div key={group.id} className="space-y-1 mb-3">
        {/* Simple Clean Group Header */}
        <button
          type="button"
          onClick={() => toggleKey(group.id)}
          className={`section-heading w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[11px] font-inter font-semibold tracking-wider uppercase transition-colors ${
            active
              ? 'text-[#07518A]'
              : 'text-[#64748B] hover:text-[#0C1E36]'
          }`}
        >
          <div className="flex items-center gap-2 truncate">
            {GroupIcon && (
              <GroupIcon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#EA6113]' : 'text-[#64748B]'}`} />
            )}
            <span className="truncate">{group.title}</span>
          </div>
          <span className="text-[#64748B]">
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5 text-[#EA6113]" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {/* Group Items */}
        {isExpanded && (
          <div className="space-y-0.5 pl-1">
            {group.items.map((item) => renderItem(item))}
          </div>
        )}
      </div>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white/95 backdrop-blur-2xl border-r border-[#E5DFD7] text-[#0C1E36] select-none shadow-2xl">
      {/* 1. Clean Simple Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#E5DFD7] bg-[#FFF5EC]/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group min-w-0"
          onClick={onCloseMobile}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2D3139] via-[#1E2128] to-[#101216] border border-[#3E4452] flex items-center justify-center text-[#F3F4F6] shadow-md shrink-0">
            <Truck className="w-5 h-5 text-[#E5E7EB]" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-sans text-sm font-black tracking-tight text-[#07518A]">
                  FLEETVISION
                </span>
                <span className="text-[10px] font-mono font-bold text-[#EA6113] bg-[#EA6113]/15 px-1 py-0.2 rounded border border-[#EA6113]/30">
                  AI
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-wider text-[#64748B] uppercase truncate">
                Fleet Platform
              </p>
            </div>
          )}
        </Link>

        {/* Toggle Collapse (Desktop) */}
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="hidden md:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#0C1E36] hover:bg-slate-100 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Close Button (Mobile) */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close mobile menu"
          className="md:hidden p-1.5 rounded-lg text-[#64748B] hover:text-[#0C1E36] hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Scrollable Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
        {FLEET_NAVIGATION.map((section: INavSection) => (
          <div key={section.id} className="space-y-1">
            {!collapsed ? (
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-[#64748B]">
                  {section.sectionTitle}
                </span>
                <div className="h-px flex-1 ml-3 bg-[#E5DFD7]" />
              </div>
            ) : (
              <div className="w-full h-px bg-[#E5DFD7] my-2" />
            )}

            {/* Render Groups */}
            {section.groups && section.groups.map((group) => renderGroup(group))}

            {/* Render Direct Items */}
            {section.items && (
              <div className="space-y-0.5">
                {section.items.map((item) => renderItem(item))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 3. Operator Snapshot & Logout */}
      <div className="p-3 border-t border-[#E5DFD7] bg-white">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#FFF5EC] border border-[#E5DFD7]">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-[#07518A] flex items-center justify-center font-sans text-xs font-bold text-white shrink-0">
                {user?.name ? user.name[0].toUpperCase() : 'O'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#0C1E36] truncate font-sans">
                  {user?.name || 'Fleet Operator'}
                </p>
                <p className="text-[10px] text-[#EA6113] font-mono truncate uppercase">
                  {user?.role || 'fleet_manager'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              className="p-2 rounded-lg text-[#64748B] hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Vertical Sidebar Removed per Horizontal Magnetic Pill Nav Redesign */}

      {/* Mobile Slide-Out Drawer (Touch Devices) */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <aside className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
