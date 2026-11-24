/**
 * FLEETVISION AI ASSISTANT — FUNCTION / TOOL CALLING DEFINITIONS
 * 
 * Secure Function Schemas aligned with Backend API contracts.
 * The model NEVER receives raw SQL/Prisma access.
 * It is restricted to typed, auditable tool executions.
 */

export interface IToolDefinition {
  name: string
  description: string
  parameters: {
    type: 'object'
    properties: Record<string, {
      type: string
      description: string
      enum?: string[]
    }>
    required: string[]
  }
}

export const FLEETVISION_ASSISTANT_TOOLS: IToolDefinition[] = [
  {
    name: 'get_vehicle_telemetry',
    description: 'Fetch live vehicle status, battery SoC, odometer, thermal loop state and location.',
    parameters: {
      type: 'object',
      properties: {
        vehicleId: {
          type: 'string',
          description: 'The vehicle unique ID or registration number (e.g., FV-E-01)',
        },
      },
      required: ['vehicleId'],
    },
  },
  {
    name: 'get_driver_safety_profile',
    description: 'Retrieve driver safety score, harsh braking events, overspeeding counts, and duty logs.',
    parameters: {
      type: 'object',
      properties: {
        driverId: {
          type: 'string',
          description: 'Driver unique ID or full name',
        },
      },
      required: ['driverId'],
    },
  },
  {
    name: 'get_trip_pnl_summary',
    description: 'Analyze trip profitability, revenue, cost, toll expenses, and fuel consumption.',
    parameters: {
      type: 'object',
      properties: {
        tripId: {
          type: 'string',
          description: 'Unique Trip identifier (e.g., TRIP-2026-8801)',
        },
      },
      required: ['tripId'],
    },
  },
  {
    name: 'get_fuel_efficiency_metrics',
    description: 'Calculate fleet-wide or vehicle-specific kWh/km or L/100km fuel economy trends.',
    parameters: {
      type: 'object',
      properties: {
        vehicleId: {
          type: 'string',
          description: 'Optional vehicle ID to filter. Omit for entire fleet.',
        },
        timeframeDays: {
          type: 'string',
          description: 'Lookback period in days: 7, 30, or 90',
          enum: ['7', '30', '90'],
        },
      },
      required: ['timeframeDays'],
    },
  },
  {
    name: 'get_predictive_maintenance_alerts',
    description: 'Fetch ML predictive maintenance warnings including brake rotor wear, cell balance, and oil degradation.',
    parameters: {
      type: 'object',
      properties: {
        urgencyThreshold: {
          type: 'string',
          description: 'Minimum urgency level to return',
          enum: ['critical', 'high', 'medium', 'all'],
        },
      },
      required: ['urgencyThreshold'],
    },
  },
  {
    name: 'explain_ml_prediction',
    description: 'Generate human-readable engineering explanations of machine learning predictive scores.',
    parameters: {
      type: 'object',
      properties: {
        modelType: {
          type: 'string',
          description: 'Type of prediction model',
          enum: ['maintenance', 'driver-behavior', 'accident-risk', 'fuel-prediction', 'route-optimization'],
        },
        targetId: {
          type: 'string',
          description: 'Vehicle or Driver ID associated with the prediction',
        },
      },
      required: ['modelType', 'targetId'],
    },
  },
]
