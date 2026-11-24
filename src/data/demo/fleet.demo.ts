import {
  IVehicle,
  IDriver,
  ITrip,
  IMaintenanceRecord,
  IFuelLog,
  IExpense,
  IDashboardData,
} from '@/types/fleet'

/**
 * STRICT REQUIREMENT (Section 9):
 * "Rules: Keep demonstration data separate from real API data.
 * Display a DEMO or SAMPLE label. Never mix mock records with genuine records."
 */

export const DEMO_VEHICLES: IVehicle[] = [
  {
    id: 'demo-veh-01',
    vehicleNumber: 'FV-E-01',
    model: 'FH Aero Electric (4x2 Tractor)',
    manufacturer: 'Volvo Trucks',
    registrationNumber: 'KA-01-EV-9021',
    fuelType: 'electric',
    engineDetails: '660 kW (880 hp) Quad-Motor Powertrain, 540 kWh Battery Pack',
    odometer: 14250,
    status: 'active',
    insuranceExpiry: '2027-05-12T00:00:00.000Z',
    isDemoRecord: true,
  },
  {
    id: 'demo-veh-02',
    vehicleNumber: 'FV-E-02',
    model: 'FH Aero Electric (6x2 Rigid)',
    manufacturer: 'Volvo Trucks',
    registrationNumber: 'KA-01-EV-9022',
    fuelType: 'electric',
    engineDetails: '490 kW Dual-Motor Powertrain, 360 kWh Battery Pack',
    odometer: 28900,
    status: 'available',
    insuranceExpiry: '2027-06-20T00:00:00.000Z',
    isDemoRecord: true,
  },
  {
    id: 'demo-veh-03',
    vehicleNumber: 'FV-D-03',
    model: 'Actros 2653',
    manufacturer: 'Mercedes-Benz',
    registrationNumber: 'MH-12-TR-4411',
    fuelType: 'diesel',
    engineDetails: '12.8L OM471 Inline-6 Turbo Diesel (390 kW / 530 hp)',
    odometer: 84320,
    status: 'maintenance',
    insuranceExpiry: '2026-12-01T00:00:00.000Z',
    isDemoRecord: true,
  },
  {
    id: 'demo-veh-04',
    vehicleNumber: 'FV-E-04',
    model: 'FH Aero Electric Flagship',
    manufacturer: 'Volvo Trucks',
    registrationNumber: 'DL-01-EV-1004',
    fuelType: 'electric',
    engineDetails: '660 kW Continuous Power, 6-Pack Volumetric Battery 540 kWh',
    odometer: 6120,
    status: 'active',
    insuranceExpiry: '2027-09-15T00:00:00.000Z',
    isDemoRecord: true,
  },
]

export const DEMO_DRIVERS: IDriver[] = [
  {
    id: 'demo-drv-01',
    name: 'Rajesh Sharma',
    licenseNumber: 'DL-1420110098231',
    phone: '+91 98765 43210',
    email: 'rajesh.sharma@demo-fleetvision.com',
    status: 'on_trip',
    rating: 4.85,
    experienceYears: 12,
    safetyScore: 94,
    isDemoRecord: true,
  },
  {
    id: 'demo-drv-02',
    name: 'Amit Patel',
    licenseNumber: 'GJ-0120150044812',
    phone: '+91 98234 56789',
    email: 'amit.patel@demo-fleetvision.com',
    status: 'available',
    rating: 4.6,
    experienceYears: 8,
    safetyScore: 88,
    isDemoRecord: true,
  },
  {
    id: 'demo-drv-03',
    name: 'Vikram Singh',
    licenseNumber: 'HR-2620180099142',
    phone: '+91 91234 98765',
    email: 'vikram.singh@demo-fleetvision.com',
    status: 'off_duty',
    rating: 3.2,
    experienceYears: 4,
    safetyScore: 61,
    isDemoRecord: true,
  },
]

export const DEMO_TRIPS: ITrip[] = [
  {
    id: 'demo-trip-01',
    tripNumber: 'TRIP-2026-8801',
    pickupLocation: 'Bengaluru Logistics Hub (Electronics City)',
    pickupLat: 12.8452,
    pickupLng: 77.6602,
    destination: 'Chennai Port Container Terminal',
    destLat: 13.0827,
    destLng: 80.2707,
    driverId: 'demo-drv-01',
    vehicleId: 'demo-veh-01',
    driver: DEMO_DRIVERS[0],
    vehicle: DEMO_VEHICLES[0],
    estimatedDistance: 345,
    estimatedTime: 360,
    tripCost: 18400,
    revenue: 34000,
    profit: 15600,
    status: 'in_progress',
    startDate: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    notes: 'Volvo FH Aero Electric inaugural intercity cargo haul. Charging checkpoint at Vellore Plaza.',
    isDemoRecord: true,
  },
]

export const DEMO_DASHBOARD: IDashboardData = {
  fleetSummary: {
    total: 34,
    active: 22,
    available: 8,
    maintenance: 3,
    outOfService: 1,
  },
  driverSummary: {
    total: 40,
    active: 22,
    available: 12,
    offDuty: 4,
    inactive: 2,
    topPerformers: [
      { id: 'demo-drv-01', name: 'Rajesh Sharma', rating: 4.9, status: 'on_trip' },
      { id: 'demo-drv-02', name: 'Amit Patel', rating: 4.7, status: 'available' },
    ],
    unsafeDrivers: [
      { id: 'demo-drv-03', name: 'Vikram Singh', rating: 3.2, status: 'off_duty' },
    ],
  },
  financialSummary: {
    totalMonthlyExpense: 420000,
    totalMonthlyFuel: 210000,
    totalMonthlyMaintenance: 95000,
    totalMonthlyRevenue: 890000,
    netProfit: 470000,
    profitMarginPercent: 52.8,
  },
  recentAlerts: [
    {
      id: 'alert-01',
      title: 'High-Voltage Battery Pre-Heat Active',
      message: 'Volvo FH Aero (FV-E-01) battery conditioned to 24°C for fast-charging at Vellore Depot.',
      type: 'info',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'alert-02',
      title: 'Scheduled Brake Rotor Inspection Due',
      message: 'Vehicle FV-D-03 is approaching 85,000 km threshold. Telemetry advises pad change.',
      type: 'warning',
      timestamp: new Date(Date.now() - 1200000).toISOString(),
    },
  ],
  isDemoData: true,
}
