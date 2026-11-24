/**
 * FLEETVISION AI — ANALYTICS & PREDICTIVE METRICS TYPES
 */

export interface IRouteOptimizationMetrics {
  routeId: string
  origin: string
  destination: string
  currentDistanceKm: number
  optimizedDistanceKm: number
  distanceSavingsKm: number
  estimatedTimeMinutes: number
  trafficDelayMinutes: number
  fuelSavingsEstimatedLiters?: number
  energySavingsEstimatedKwh?: number
  suggestedWaypoints: Array<{ name: string; lat: number; lng: number }>
}

export interface IDriverSafetyRadarMetrics {
  driverId: string
  driverName: string
  safetyScore: number
  speedCompliance: number // 0-100
  smoothAcceleration: number // 0-100
  brakingPrecision: number // 0-100
  restAdherence: number // 0-100
  corneringStability: number // 0-100
}

export interface ITripProfitLossMetrics {
  tripId: string
  tripNumber: string
  grossRevenue: number
  fuelCost: number
  tollCost: number
  driverAllowance: number
  maintenanceDepreciation: number
  totalOperatingCost: number
  netProfit: number
  profitMarginPercent: number
  status: 'profitable' | 'break_even' | 'unprofitable'
}
