/**
 * FLEETVISION AI — 3D AUTOMOTIVE SCENE & EXPLORER CONTRACTS
 * 
 * Target Vehicle: Volvo FH Aero Electric
 * Reference: https://www.volvotrucks.com/en-en/trucks/electric/volvo-fh-aero-electric.html
 */

export type CinematicExperiencePhase =
  | 'STANDBY'
  | 'TRUCK_ARRIVAL'
  | 'CABLE_CONNECTING'
  | 'CHARGING_ACTIVE'
  | 'PORT_CAMERA_ENTRY'
  | 'BATTERY_VISUALIZATION'
  | 'MECHANICAL_TRANSFORMATION'
  | 'COCKPIT_LOGIN_READY'
  | 'AUTHENTICATING'
  | 'AUTHENTICATION_SUCCESS'
  | 'DASHBOARD_FLYTHROUGH'

export interface ICameraKeyframe {
  position: [number, number, number]
  target: [number, number, number]
  fov: number
  durationMs: number
}

export interface IInteractiveHotspot {
  id: string
  name: string
  nodeName: string // Target node in GLTF hierarchy (e.g. "Wheel_Front_Left", "Battery_Pack_B")
  worldPosition: [number, number, number]
  category: 'powertrain' | 'battery' | 'cabin' | 'aerodynamics' | 'chassis'
  title: string
  description: string
  healthScore?: number
  temperatureC?: number
  isInteractive: boolean
}

export interface IVehicleExplorerState {
  viewMode: 'exterior' | 'interior_cabin' | 'xray_battery' | 'aerodynamics'
  doorOpen: boolean
  chargingPortOpen: boolean
  activeHotspotId: string | null
  cameraRotationLocked: boolean
  zoomLevel: number
  modelLoaded: boolean
  assetUrl?: string
}
