import {
  IDashboardData,
  IVehicle,
  IDriver,
  ITrip,
  IMaintenanceRecord,
  IFuelLog,
  IExpense,
} from '@/types/fleet'

export interface IPaginatedResult<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  isDemoSource: boolean
}

export interface IVehicleFilter {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface IDriverFilter {
  status?: string
  search?: string
  page?: number
  limit?: number
}

export interface ITripFilter {
  status?: string
  driverId?: string
  vehicleId?: string
  from?: string
  to?: string
  page?: number
  limit?: number
}

export interface IAIPredictionResponse {
  type: string
  predictions: any[]
  generatedAt: string
  isDemoSource: boolean
}

export interface IAuthResult {
  user: {
    id: string
    email: string
    name: string
    role: string
    avatar?: string | null
  }
  token: string
}

/**
 * Clean Interface Contract separating Frontend UI from Backend implementation.
 * Allows instant live/mock swapping without altering any frontend UI components.
 */
export interface IFleetVisionApiClient {
  getDashboardSummary(): Promise<IDashboardData>
  getVehicles(filters?: IVehicleFilter): Promise<IPaginatedResult<IVehicle>>
  getVehicleById(id: string): Promise<IVehicle | null>
  getDrivers(filters?: IDriverFilter): Promise<IPaginatedResult<IDriver>>
  getTrips(filters?: ITripFilter): Promise<IPaginatedResult<ITrip>>
  getMaintenanceRecords(vehicleId?: string): Promise<IMaintenanceRecord[]>
  getFuelLogs(vehicleId?: string): Promise<IFuelLog[]>
  getExpenses(vehicleId?: string): Promise<IExpense[]>
  getAIPredictions(type: string, targetId?: string): Promise<IAIPredictionResponse>
  authenticate(email: string, password: string): Promise<IAuthResult>
  isSimulationMode(): boolean
}
