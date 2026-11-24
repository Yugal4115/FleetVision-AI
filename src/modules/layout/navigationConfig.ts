import {
  type LucideIcon,
  LayoutDashboard,
  Truck,
  Brain,
  MessageSquareCode,
  BarChart3,
  Bell,
  UserCheck,
  Settings,
  User,
  ShieldAlert,
  Boxes,
} from 'lucide-react'

export interface INavSubItem {
  id: string
  title: string
  href: string
  badge?: string
}

export interface INavItem {
  id: string
  title: string
  href?: string
  icon: LucideIcon
  badge?: string
  subItems?: INavSubItem[]
}

export interface INavGroup {
  id: string
  title: string
  icon?: LucideIcon
  items: INavItem[]
}

export interface INavSection {
  id: string
  sectionTitle: string
  groups?: INavGroup[]
  items?: INavItem[]
}

/**
 * FLEETVISION AI — VEHICLE-CENTRIC APPLICATION NAVIGATION CONFIGURATION
 * Streamlined 4 primary sections focusing operations on vehicle assets.
 */
export const FLEET_NAVIGATION: INavSection[] = [
  // 1. OVERVIEW
  {
    id: 'overview',
    sectionTitle: 'OVERVIEW',
    items: [
      {
        id: 'dashboard',
        title: 'Executive Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },

  // 2. FLEET OPERATIONS (Vehicle-Centric Architecture)
  {
    id: 'fleet_operations',
    sectionTitle: 'FLEET OPERATIONS',
    groups: [
      {
        id: 'fleet-assets',
        title: 'FLEET ASSETS',
        icon: Boxes,
        items: [
          {
            id: 'vehicles',
            title: 'Vehicle Management',
            icon: Truck,
            subItems: [
              { id: 'all-vehicles', title: 'All Vehicles', href: '/vehicles' },
              { id: 'add-vehicle', title: 'Add Vehicle', href: '/vehicles/new' },
            ],
          },
        ],
      },
    ],
  },

  // 3. INTELLIGENCE
  {
    id: 'intelligence',
    sectionTitle: 'INTELLIGENCE',
    groups: [
      {
        id: 'safety-predictions',
        title: 'SAFETY & PREDICTIONS',
        icon: ShieldAlert,
        items: [
          {
            id: 'driver-safety',
            title: 'Driver Safety Radar',
            href: '/drivers/safety',
            icon: ShieldAlert,
          },
          {
            id: 'ai-center',
            title: 'AI Intelligence Center',
            href: '/ai-center',
            icon: Brain,
            badge: 'ML',
            subItems: [
              { id: 'ai-maint', title: 'Predictive Maintenance', href: '/ai-center#maintenance' },
              { id: 'ai-fuel', title: 'Fuel Prediction', href: '/ai-center#fuel' },
              { id: 'ai-behavior', title: 'Driver Behaviour Analysis', href: '/ai-center#driver' },
              { id: 'ai-risk', title: 'Accident Risk Estimation', href: '/ai-center#risk' },
              { id: 'ai-health', title: 'Vehicle Health Assessment', href: '/ai-center#health' },
            ],
          },
        ],
      },
      {
        id: 'ai-assistant-analytics',
        title: 'AI ASSISTANT & ANALYTICS',
        icon: MessageSquareCode,
        items: [
          {
            id: 'fleet-ai-assistant',
            title: 'Fleet AI Assistant',
            href: '/ai-assistant',
            icon: MessageSquareCode,
            badge: 'LLM',
          },
          {
            id: 'fleet-analytics',
            title: 'Fleet Analytics',
            href: '/ai-center#analytics',
            icon: BarChart3,
          },
        ],
      },
    ],
  },

  // 4. MANAGEMENT
  {
    id: 'management',
    sectionTitle: 'MANAGEMENT',
    groups: [
      {
        id: 'reports-alerts',
        title: 'REPORTS & ALERTS',
        icon: BarChart3,
        items: [
          {
            id: 'reports',
            title: 'Reports',
            href: '/reports',
            icon: BarChart3,
          },
          {
            id: 'notifications',
            title: 'Notifications',
            href: '/notifications',
            icon: Bell,
          },
        ],
      },
      {
        id: 'administration',
        title: 'ADMINISTRATION',
        icon: Settings,
        items: [
          {
            id: 'users',
            title: 'Users & Access',
            href: '/users',
            icon: UserCheck,
          },
          {
            id: 'settings',
            title: 'Settings',
            href: '/settings',
            icon: Settings,
          },
          {
            id: 'profile',
            title: 'My Profile',
            href: '/profile',
            icon: User,
          },
        ],
      },
    ],
  },
]
