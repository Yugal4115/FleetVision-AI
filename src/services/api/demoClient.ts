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
import {
  DEMO_VEHICLES,
  DEMO_DRIVERS,
  DEMO_TRIPS,
  DEMO_DASHBOARD,
} from '@/data/demo/fleet.demo'

/**
 * Isolated Demonstration Client
 * Returns strictly labeled simulation data when backend is under teammate repair.
 */
export class FleetVisionDemoClient implements IFleetVisionApiClient {
  isSimulationMode(): boolean {
    return true
  }

  async getDashboardSummary(): Promise<IDashboardData> {
    return DEMO_DASHBOARD
  }

  async getVehicles(filters?: IVehicleFilter): Promise<IPaginatedResult<IVehicle>> {
    let list = [...DEMO_VEHICLES]
    if (filters?.status) {
      list = list.filter((v) => v.status === filters.status)
    }
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(
        (v) =>
          v.vehicleNumber.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.registrationNumber.toLowerCase().includes(q)
      )
    }
    return {
      data: list,
      pagination: {
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        total: list.length,
        pages: 1,
      },
      isDemoSource: true,
    }
  }

  async getVehicleById(id: string): Promise<IVehicle | null> {
    const v = DEMO_VEHICLES.find((item) => item.id === id) || null
    return v
  }

  async getDrivers(filters?: IDriverFilter): Promise<IPaginatedResult<IDriver>> {
    return {
      data: DEMO_DRIVERS,
      pagination: {
        page: 1,
        limit: 20,
        total: DEMO_DRIVERS.length,
        pages: 1,
      },
      isDemoSource: true,
    }
  }

  async getTrips(filters?: ITripFilter): Promise<IPaginatedResult<ITrip>> {
    return {
      data: DEMO_TRIPS,
      pagination: {
        page: 1,
        limit: 20,
        total: DEMO_TRIPS.length,
        pages: 1,
      },
      isDemoSource: true,
    }
  }

  async getMaintenanceRecords(vehicleId?: string): Promise<IMaintenanceRecord[]> {
    return [
      {
        id: 'demo-maint-01',
        vehicleId: vehicleId || 'demo-veh-01',
        serviceType: 'High-Voltage Bus & Inverter Diagnostic',
        priority: 'medium',
        status: 'completed',
        scheduledDate: '2026-11-10T10:00:00.000Z',
        completedDate: '2026-11-10T14:30:00.000Z',
        cost: 14500,
        odometerAtService: 12000,
        description: 'Certified Volvo FH Electric thermal loop flush and cell balance verification.',
        serviceCenter: 'Volvo Tech Hub Bengaluru',
        isDemoRecord: true,
      },
    ]
  }

  async getFuelLogs(vehicleId?: string): Promise<IFuelLog[]> {
    return [
      {
        id: 'demo-fuel-01',
        vehicleId: vehicleId || 'demo-veh-01',
        fuelDate: '2026-11-20T08:00:00.000Z',
        quantity: 380, // kWh
        cost: 6840,
        odometer: 14200,
        fuelStation: 'Delta 350kW CCS2 DC Fast Charger',
        fuelEconomy: 1.15, // kWh/km
        isDemoRecord: true,
      },
    ]
  }

  async getExpenses(vehicleId?: string): Promise<IExpense[]> {
    return [
      {
        id: 'demo-exp-01',
        category: 'fuel',
        amount: 6840,
        date: '2026-11-20T08:00:00.000Z',
        vehicleId: vehicleId || 'demo-veh-01',
        description: '350kW Fast Charging Session',
        isDemoRecord: true,
      },
    ]
  }

  async getAIPredictions(type: string, targetId?: string): Promise<IAIPredictionResponse> {
    return {
      type,
      predictions: [
        {
          subject: 'Volvo FH Aero Electric (FV-E-01)',
          prediction: 'Battery Cell Health 98.4% — Zero thermal degradation detected',
          confidence: 0.96,
          risk: 'low',
          suggestedAction: 'Maintain current 250kW rapid charging profile.',
          isDemo: true,
        },
      ],
      generatedAt: new Date().toISOString(),
      isDemoSource: true,
    }
  }

  async authenticate(email: string, password: string): Promise<IAuthResult> {
    // Demonstration mock authentication for offline UI layout validation
    return {
      user: {
        id: 'demo-user-admin',
        email,
        name: 'Fleet Director (Simulation)',
        role: 'fleet_manager',
        avatar: null,
      },
      token: 'demo-simulated-jwt-token-not-valid-for-real-backend',
    }
  }
}
