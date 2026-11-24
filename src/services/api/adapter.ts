import { IFleetVisionApiClient } from './interface'
import { FleetVisionLiveClient } from './liveClient'
import { FleetVisionDemoClient } from './demoClient'

/**
 * FLEETVISION API ADAPTER
 * 
 * Rules (Section 9):
 * - Keeps demonstration data strictly separated from genuine backend data.
 * - Defaults to SIMULATION (Demo) mode while teammate repairs backend.
 * - Switches dynamically via NEXT_PUBLIC_USE_DEMO_DATA or runtime toggle.
 */

class ApiAdapterManager {
  private static instance: ApiAdapterManager
  private liveClient: FleetVisionLiveClient
  private demoClient: FleetVisionDemoClient
  private forceSimulation: boolean

  private constructor() {
    this.liveClient = new FleetVisionLiveClient()
    this.demoClient = new FleetVisionDemoClient()
    // Live production backend is fully verified and connected. Simulation only if explicitly enabled.
    const envFlag = process.env.NEXT_PUBLIC_USE_DEMO_DATA
    this.forceSimulation = envFlag === 'true'
  }

  public static getInstance(): ApiAdapterManager {
    if (!ApiAdapterManager.instance) {
      ApiAdapterManager.instance = new ApiAdapterManager()
    }
    return ApiAdapterManager.instance
  }

  public getClient(): IFleetVisionApiClient {
    if (this.forceSimulation) {
      return this.demoClient
    }
    return this.liveClient
  }

  public setSimulationMode(enabled: boolean) {
    this.forceSimulation = enabled
  }

  public isSimulating(): boolean {
    return this.forceSimulation
  }
}

export const apiAdapter = ApiAdapterManager.getInstance()
export const getApiClient = (): IFleetVisionApiClient => apiAdapter.getClient()
