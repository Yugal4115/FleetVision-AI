const fs = require('fs');
const path = require('path');

const routes = [
  { dir: 'vehicles', title: 'Vehicle Fleet Registry', subtitle: 'Global asset tracking, technical specifications, and status', section: 'Fleet Operations', icon: 'Truck', badge: 'Subphase 3 Target', extra: 'AllVehicles' },
  { dir: 'vehicles/new', title: 'Register New Vehicle', subtitle: 'Commission new commercial tractor or trailer into the digital registry', section: 'Fleet Operations', icon: 'Truck', badge: 'Subphase 3 Target', extra: 'AddVehicle' },
  { dir: 'vehicles/documents', title: 'Vehicle Regulatory Documents', subtitle: 'Fitness certificates, PUC, permits, and commercial insurance policies', section: 'Fleet Operations', icon: 'FileText', badge: 'Subphase 3 Target', extra: 'Compliance' },
  { dir: 'vehicles/health', title: 'Fleet Health & Diagnostics', subtitle: 'OBD-II telemetry, DTC error codes, and real-time powertrain telemetry', section: 'Fleet Operations', icon: 'Activity', badge: 'Subphase 3 Target', extra: 'Health' },

  { dir: 'drivers', title: 'Operator & Driver Registry', subtitle: 'Verified commercial driver profiles, duty statuses, and roster', section: 'Fleet Operations', icon: 'Users', badge: 'Subphase 4 Target', extra: 'AllDrivers' },
  { dir: 'drivers/new', title: 'Onboard New Driver', subtitle: 'Enroll commercial operator with HGV license and biometric verification', section: 'Fleet Operations', icon: 'UserPlus', badge: 'Subphase 4 Target', extra: 'AddDriver' },
  { dir: 'drivers/profiles', title: 'Driver Personnel Profiles', subtitle: 'Detailed driving records, assignment history, and medical clearances', section: 'Fleet Operations', icon: 'UserCheck', badge: 'Subphase 4 Target', extra: 'Profiles' },
  { dir: 'drivers/safety', title: 'Driver Safety & Telematics', subtitle: 'Harsh braking, cornering G-forces, speeding events, and fatigue monitoring', section: 'Fleet Operations', icon: 'Shield', badge: 'Subphase 4 Target', extra: 'Safety' },
  { dir: 'drivers/performance', title: 'Driver Scorecard & Efficiency', subtitle: 'Fuel efficiency indices, eco-driving metrics, and incentive bonuses', section: 'Fleet Operations', icon: 'TrendingUp', badge: 'Subphase 4 Target', extra: 'Performance' },
  { dir: 'drivers/documents', title: 'Driver Regulatory Credentials', subtitle: 'Commercial licenses, hazmat endorsements, and medical fitness records', section: 'Fleet Operations', icon: 'FileText', badge: 'Subphase 4 Target', extra: 'Documents' },

  { dir: 'trips', title: 'Active Dispatch & Trip Registry', subtitle: 'Consignment routing, multi-depot dispatches, and schedule compliance', section: 'Fleet Operations', icon: 'MapPin', badge: 'Subphase 5 Target', extra: 'AllTrips' },
  { dir: 'trips/new', title: 'Create & Dispatch Trip', subtitle: 'Assign tractor-trailer combinations, drivers, and cargo manifests', section: 'Fleet Operations', icon: 'PlusCircle', badge: 'Subphase 5 Target', extra: 'CreateTrip' },
  { dir: 'trips/history', title: 'Archived Trip Logs', subtitle: 'Historical delivery performance, turnaround time, and demurrage logs', section: 'Fleet Operations', icon: 'Clock', badge: 'Subphase 5 Target', extra: 'History' },
  { dir: 'trips/routes', title: 'Freight Corridor Route Optimization', subtitle: 'Dynamic toll avoidance, weather hazard rerouting, and waypoint analysis', section: 'Fleet Operations', icon: 'Navigation', badge: 'Subphase 5 Target', extra: 'Routes' },
  { dir: 'trips/pnl', title: 'Trip Profit & Loss Analysis', subtitle: 'Per-kilometer operating expenses, gross freight revenue, and operating margin', section: 'Fleet Operations', icon: 'DollarSign', badge: 'Subphase 5 Target', extra: 'PnL' },

  { dir: 'tracking', title: 'Live Fleet Tracking & Telemetry', subtitle: 'Sub-second GPS coordinates, geofence corridors, and real-time moving map', section: 'Fleet Operations', icon: 'Navigation', badge: 'Subphase 6 Target', extra: 'RealTimeGPS' },

  { dir: 'fuel', title: 'Fuel Consumption & Dispensing Logs', subtitle: 'Electronic fuel card integrations, fuel dips, and tank telemetry logs', section: 'Fleet Operations', icon: 'Fuel', badge: 'Subphase 7 Target', extra: 'FuelLogs' },
  { dir: 'fuel/analytics', title: 'Fuel Economy & Thermal Analytics', subtitle: 'BS-VI / EV equivalent consumption metrics, thermal loss, and theft alerts', section: 'Fleet Operations', icon: 'Zap', badge: 'Subphase 7 Target', extra: 'FuelAnalytics' },

  { dir: 'maintenance', title: 'Preventive Maintenance Overview', subtitle: 'Active work orders, bay scheduling, and predictive component lifespans', section: 'Fleet Operations', icon: 'Wrench', badge: 'Subphase 7 Target', extra: 'MaintenanceOverview' },
  { dir: 'maintenance/schedule', title: 'Scheduled Service Interval Calendar', subtitle: 'OEM maintenance intervals, transmission fluid, and brake caliper schedules', section: 'Fleet Operations', icon: 'Calendar', badge: 'Subphase 7 Target', extra: 'ServiceSchedule' },
  { dir: 'maintenance/repairs', title: 'Depot Repairs & Major Overhauls', subtitle: 'Unscheduled breakdowns, engine overhauls, and warranty claims tracking', section: 'Fleet Operations', icon: 'Wrench', badge: 'Subphase 7 Target', extra: 'Repairs' },
  { dir: 'maintenance/history', title: 'Vehicle Service Audit Ledger', subtitle: 'Complete lifecycle maintenance ledger with technician sign-offs', section: 'Fleet Operations', icon: 'CheckCircle', badge: 'Subphase 7 Target', extra: 'MaintenanceHistory' },

  { dir: 'expenses', title: 'Fleet Expense Management', subtitle: 'Tolls, spares, driver per-diem allowances, and operating overheads', section: 'Fleet Operations', icon: 'DollarSign', badge: 'Subphase 7 Target', extra: 'Expenses' },

  { dir: 'ai-center', title: 'AI Intelligence Center', subtitle: 'Predictive neural models for component wear, fuel theft, and accident risk', section: 'Intelligence', icon: 'Brain', badge: 'Subphase 8 Target', extra: 'AICenter' },
  { dir: 'ai-assistant', title: 'Fleet AI Assistant', subtitle: 'Natural language fleet operations copilot powered by live telemetry tools', section: 'Intelligence', icon: 'MessageSquareCode', badge: 'Subphase 9 Target', extra: 'AIAssistant' },

  { dir: 'reports', title: 'Executive Reports & Analytics', subtitle: 'Consolidated fleet utilization, asset depreciation, and ESG metrics', section: 'Management', icon: 'BarChart3', badge: 'Subphase 10 Target', extra: 'Reports' },
  { dir: 'notifications', title: 'Operations Alerts & Notifications', subtitle: 'Urgent telemetry warnings, maintenance reminders, and security pings', section: 'Management', icon: 'Bell', badge: 'Subphase 10 Target', extra: 'Notifications' },
  { dir: 'users', title: 'User Access & Operator Roster', subtitle: 'Role-based access control (RBAC), API credentials, and audit logs', section: 'Management', icon: 'UserCheck', badge: 'Subphase 10 Target', extra: 'Users' },
  { dir: 'settings', title: 'System & Branch Settings', subtitle: 'Depot configurations, unit systems, alert thresholds, and webhooks', section: 'Management', icon: 'Settings', badge: 'Subphase 10 Target', extra: 'Settings' },
  { dir: 'profile', title: 'Operator Profile & Credentials', subtitle: 'Authenticated session security, multi-factor auth, and preferences', section: 'Management', icon: 'User', badge: 'Subphase 10 Target', extra: 'Profile' }
];

const basePath = path.join(process.cwd(), 'src', 'app', '(app)');

let createdCount = 0;
for (const r of routes) {
  const targetDir = path.join(basePath, ...r.dir.split('/'));
  fs.mkdirSync(targetDir, { recursive: true });
  const targetFile = path.join(targetDir, 'page.tsx');
  const safeFuncName = r.extra.replace(/[^a-zA-Z0-9]/g, '') + 'Page';

  const content = `'use client'

import React from 'react'
import { ModulePlaceholder } from '@/modules/layout/ModulePlaceholder'
import { ${r.icon} } from 'lucide-react'

export default function ${safeFuncName}() {
  return (
    <ModulePlaceholder
      title="${r.title}"
      subtitle="${r.subtitle}"
      section="${r.section}"
      icon={${r.icon}}
      subphaseBadge="${r.badge}"
      statusNote="${r.title} interface initialized. Connected to FleetVision AI telemetry services."
      highlights={[
        { label: 'Sub-Module', value: '${r.extra}', detail: 'Route ready' },
        { label: 'Security Context', value: 'Operator Tier-1', detail: 'Token verified' },
        { label: 'API Gateway', value: 'REST / Telemetry', detail: 'Backend linked' },
      ]}
    />
  )
}
`;

  fs.writeFileSync(targetFile, content, 'utf8');
  createdCount++;
}

console.log('Successfully created ' + createdCount + ' module pages in src/app/(app)/');
