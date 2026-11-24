/**
 * FLEETVISION AI — VEHICLE VIEWER & INSPECTION TYPES
 */

export type VehicleViewAngle = 'front' | 'driver-side' | 'rear' | 'passenger-side'

export type ComponentCategory =
  | 'battery'
  | 'powertrain'
  | 'cabin'
  | 'aerodynamics'
  | 'chassis'
  | 'braking'
  | 'safety'

export type OperatingCondition = 'optimal' | 'good' | 'attention_required' | 'critical'

export interface IComponentSpecItem {
  label: string
  value: string | number
  unit?: string
  status?: 'nominal' | 'warning' | 'alert'
}

export interface IComponentHotspot {
  id: string
  name: string
  category: ComponentCategory
  viewAngle: VehicleViewAngle
  x: number // X position in percentage (0 - 100)
  y: number // Y position in percentage (0 - 100)
  pulseColor: 'yellow' | 'orange' | 'blue' | 'amber'
  healthScore: number // 0 - 100%
  condition: OperatingCondition
  headline: string
  description: string
  specs: IComponentSpecItem[]
  lastInspectionDate: string
  nextServiceDueKm: number
  isDemoRecord: boolean
}

export interface IVehicleInspectionProfile {
  vehicleId: string
  model: string
  manufacturer: string
  registrationNumber: string
  batterySoC: number
  totalOdometer: number
  powertrainType: string
  hotspots: Record<VehicleViewAngle, IComponentHotspot[]>
  isSimulationMode: boolean
}
