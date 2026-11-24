import {
  IFleetVisionApiClient,
  IPaginatedResult,
  IVehicleFilter,
  IDriverFilter,
  ITripFilter,
  IAIPredictionResponse,
  IAuthResult,
} from './interface'
import {
  IDashboardData,
  IVehicle,
  IDriver,
  ITrip,
  IMaintenanceRecord,
  IFuelLog,
  IExpense,
} from '@/types/fleet'

/**
 * Live Production Client
 * Strictly calls existing teammate backend endpoints without modifying them.
 */
export class FleetVisionLiveClient implements IFleetVisionApiClient {
  private baseUrl: string

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  isSimulationMode(): boolean {
    return false
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `HTTP ${res.status}: Failed to fetch ${path}`)
    }
    return res.json()
  }

  async getDashboardSummary(): Promise<IDashboardData> {
    const raw = await this.request<any>('/api/dashboard')
    return {
      fleetSummary: raw.fleetSummary,
      driverSummary: raw.driverSummary,
      financialSummary: raw.financialSummary,
      recentAlerts: raw.recentAlerts || [],
      isDemoData: false,
    }
  }

  async getVehicles(filters?: IVehicleFilter): Promise<IPaginatedResult<IVehicle>> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const res = await this.request<any>(`/api/vehicles?${params.toString()}`)
    return {
      data: res.vehicles || [],
      pagination: res.pagination || { page: 1, limit: 50, total: 0, pages: 1 },
      isDemoSource: false,
    }
  }

  async getVehicleById(id: string): Promise<IVehicle | null> {
    const res = await this.request<any>(`/api/vehicles/${id}`)
    return res.vehicle || null
  }

  async getDrivers(filters?: IDriverFilter): Promise<IPaginatedResult<IDriver>> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.search) params.append('search', filters.search)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const res = await this.request<any>(`/api/drivers?${params.toString()}`)
    return {
      data: res.drivers || [],
      pagination: res.pagination || { page: 1, limit: 50, total: 0, pages: 1 },
      isDemoSource: false,
    }
  }

  async getTrips(filters?: ITripFilter): Promise<IPaginatedResult<ITrip>> {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.driverId) params.append('driverId', filters.driverId)
    if (filters?.vehicleId) params.append('vehicleId', filters.vehicleId)
    if (filters?.page) params.append('page', filters.page.toString())
    if (filters?.limit) params.append('limit', filters.limit.toString())

    const res = await this.request<any>(`/api/trips?${params.toString()}`)
    return {
      data: res.trips || [],
      pagination: res.pagination || { page: 1, limit: 50, total: 0, pages: 1 },
      isDemoSource: false,
    }
  }

  async getMaintenanceRecords(vehicleId?: string): Promise<IMaintenanceRecord[]> {
    const q = vehicleId ? `?vehicleId=${vehicleId}` : ''
    const res = await this.request<any>(`/api/maintenance${q}`)
    return res.records || []
  }

  async getFuelLogs(vehicleId?: string): Promise<IFuelLog[]> {
    const q = vehicleId ? `?vehicleId=${vehicleId}` : ''
    const res = await this.request<any>(`/api/fuel${q}`)
    return res.fuelLogs || []
  }

  async getExpenses(vehicleId?: string): Promise<IExpense[]> {
    const q = vehicleId ? `?vehicleId=${vehicleId}` : ''
    const res = await this.request<any>(`/api/expenses${q}`)
    return res.expenses || []
  }

  async getAIPredictions(type: string, targetId?: string): Promise<IAIPredictionResponse> {
    const q = targetId ? `?targetId=${targetId}` : ''
    const res = await this.request<any>(`/api/ai/${type}${q}`)
    return {
      type: res.type || type,
      predictions: res.predictions || [],
      generatedAt: res.generatedAt || new Date().toISOString(),
      isDemoSource: false,
    }
  }

  async authenticate(email: string, password: string): Promise<IAuthResult> {
    const res = await this.request<IAuthResult>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return res
  }
}
