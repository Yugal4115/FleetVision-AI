export type UserRole =
  | 'owner'
  | 'admin'
  | 'fleet_manager'
  | 'dispatcher'
  | 'analyst'
  | 'driver'
  | 'viewer'

export interface RoleDefinition {
  title: string
  description: string
  level: number
  permissions: string[]
}

export const ROLE_DEFINITIONS: Record<UserRole, RoleDefinition> = {
  owner: {
    title: 'Organisation Owner',
    description: 'Full strategic, billing, fleet and organizational authority',
    level: 100,
    permissions: ['*'],
  },
  admin: {
    title: 'Administrator',
    description: 'Complete operational, security and user management access',
    level: 90,
    permissions: [
      'fleet:*',
      'vehicles:*',
      'drivers:*',
      'trips:*',
      'maintenance:*',
      'fuel:*',
      'expenses:*',
      'reports:*',
      'users:*',
      'settings:*',
      'ai:*',
    ],
  },
  fleet_manager: {
    title: 'Fleet Manager',
    description: 'Full commercial vehicle operations, maintenance and dispatches',
    level: 70,
    permissions: [
      'fleet:view',
      'vehicles:view',
      'vehicles:edit',
      'vehicles:create',
      'drivers:view',
      'drivers:edit',
      'trips:*',
      'maintenance:*',
      'fuel:*',
      'expenses:view',
      'reports:view',
      'ai:*',
    ],
  },
  dispatcher: {
    title: 'Dispatcher',
    description: 'Live trip assignments, mission logs and driver routing',
    level: 50,
    permissions: [
      'fleet:view',
      'vehicles:view',
      'drivers:view',
      'trips:create',
      'trips:edit',
      'trips:view',
      'tracking:view',
    ],
  },
  analyst: {
    title: 'Analyst',
    description: 'Predictive intelligence, telematics metrics and reporting',
    level: 40,
    permissions: [
      'fleet:view',
      'vehicles:view',
      'reports:view',
      'reports:export',
      'expenses:view',
      'ai:view',
    ],
  },
  driver: {
    title: 'Fleet Driver',
    description: 'Assigned unit telemetry, logs and duty schedules',
    level: 20,
    permissions: ['trips:view_assigned', 'vehicles:view_assigned', 'profile:edit'],
  },
  viewer: {
    title: 'Viewer',
    description: 'Read-only visibility for executive observers',
    level: 10,
    permissions: ['fleet:view', 'vehicles:view', 'reports:view'],
  },
}

export function getRoleDisplayName(role: string): string {
  const normalized = role.toLowerCase() as UserRole
  return ROLE_DEFINITIONS[normalized]?.title || role.toUpperCase()
}

export function hasPermission(userRole: string, requiredPermission: string): boolean {
  const normalized = userRole.toLowerCase() as UserRole
  const def = ROLE_DEFINITIONS[normalized]
  if (!def) return false
  if (def.permissions.includes('*')) return true
  if (def.permissions.includes(requiredPermission)) return true

  // Check wildcard category, e.g. 'vehicles:*' matches 'vehicles:edit'
  const [category] = requiredPermission.split(':')
  if (def.permissions.includes(`${category}:*`)) return true

  return false
}
