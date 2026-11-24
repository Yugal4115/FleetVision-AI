/**
 * FLEETVISION AI — DOMAIN TYPE DEFINITIONS
 * High-precision types aligned with existing Prisma database schema,
 * prepared for modular frontend consumption.
 */

export type VehicleStatus = 'available' | 'active' | 'maintenance' | 'out_of_service'
export type FuelType = 'diesel' | 'petrol' | 'electric' | 'cng'
export type DriverStatus = 'available' | 'on_trip' | 'off_duty' | 'inactive'
export type TripStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'delayed'
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
export type MaintenancePriority = 'low' | 'medium' | 'high' | 'critical'

export interface IVehicle {
  id: string
  vehicleNumber: string
  model: string
  manufacturer: string
  registrationNumber: string
  fuelType: FuelType
  engineDetails?: string | null
  odometer: number
  status: VehicleStatus
  insuranceExpiry?: string | null
  pollutionCertExpiry?: string | null
  rcBookExpiry?: string | null
  companyId?: string | null
  createdAt?: string
  updatedAt?: string
  isDemoRecord?: boolean
}

export interface IDriver {
  id: string
  name: string
  licenseNumber: string
  phone: string
  email?: string | null
  status: DriverStatus
  rating: number
  experienceYears?: number
  safetyScore?: number
  companyId?: string | null
  isDemoRecord?: boolean
}

export interface ITrip {
  id: string
  tripNumber: string
  pickupLocation: string
  pickupLat?: number | null
  pickupLng?: number | null
  destination: string
  destLat?: number | null
  destLng?: number | null
  driverId?: string | null
  vehicleId?: string | null
  driver?: IDriver | null
  vehicle?: IVehicle | null
  estimatedDistance?: number | null
  estimatedTime?: number | null
  tripCost?: number | null
  revenue?: number | null
  profit?: number | null
  status: TripStatus
  startDate?: string | null
  endDate?: string | null
  notes?: string | null
  isDemoRecord?: boolean
}

export interface IMaintenanceRecord {
  id: string
  vehicleId: string
  vehicle?: IVehicle | null
  serviceType: string
  priority: MaintenancePriority
  status: MaintenanceStatus
  scheduledDate: string
  completedDate?: string | null
  cost: number
  odometerAtService?: number | null
  description?: string | null
  serviceCenter?: string | null
  isDemoRecord?: boolean
}

export interface IFuelLog {
  id: string
  vehicleId: string
  driverId?: string | null
  fuelDate: string
  quantity: number
  cost: number
  odometer: number
  fuelStation?: string | null
  fuelEconomy?: number | null
  isDemoRecord?: boolean
}

export interface IExpense {
  id: string
  category: 'fuel' | 'maintenance' | 'toll' | 'driver_allowance' | 'insurance' | 'tax' | 'other'
  amount: number
  date: string
  vehicleId?: string | null
  driverId?: string | null
  description?: string | null
  isDemoRecord?: boolean
}

export interface IFleetSummary {
  total: number
  active: number
  available: number
  maintenance: number
  outOfService: number
}

export interface IDriverSummary {
  total: number
  active: number
  available: number
  offDuty: number
  inactive: number
  topPerformers: Array<{ id: string; name: string; rating: number; status: string }>
  unsafeDrivers: Array<{ id: string; name: string; rating: number; status: string }>
}

export interface IFinancialSummary {
  totalMonthlyExpense: number
  totalMonthlyFuel: number
  totalMonthlyMaintenance: number
  totalMonthlyRevenue: number
  netProfit: number
  profitMarginPercent: number
}

export interface IDashboardData {
  fleetSummary: IFleetSummary
  driverSummary: IDriverSummary
  financialSummary: IFinancialSummary
  recentAlerts: Array<{
    id: string
    title: string
    message: string
    type: 'critical' | 'warning' | 'info'
    timestamp: string
  }>
  isDemoData: boolean
}
