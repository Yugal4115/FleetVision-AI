import { db } from '@/lib/db'
import { hasPermission } from '@/lib/auth/rbac'

export interface IToolExecutionContext {
  userId: string
  companyId: string
  role: string
}

export interface IToolExecutionResult {
  toolName: string
  success: boolean
  data?: Record<string, unknown> | Array<unknown>
  error?: string
  executionTimeMs: number
}

const TOOL_TIMEOUT_MS = 3000

/**
 * Normalizes input identifiers for SQLite exact and LIKE comparisons
 * without triggering unsupported Prisma SQLite filter flags.
 */
function normalizeIdentifier(rawId: string) {
  const clean = rawId.trim()
  const upper = clean.toUpperCase()
  return { clean, upper }
}

/**
 * SECURE ALLOWLISTED TOOL DISPATCHER FOR OPTIMUS AI
 * Enforces authenticated tenant isolation, permission gates, query timeouts,
 * and SQLite-safe identifier lookups across all 6 original tools.
 */
export async function executeAssistantTool(
  toolName: string,
  args: Record<string, unknown>,
  context: IToolExecutionContext
): Promise<IToolExecutionResult> {
  const startTime = Date.now()

  if (!context?.companyId) {
    return {
      toolName,
      success: false,
      error: 'Authentication failed: Missing company organization context.',
      executionTimeMs: Date.now() - startTime,
    }
  }

  // Wrap execution in query timeout budget
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () => reject(new Error(`Tool execution timed out after ${TOOL_TIMEOUT_MS}ms`)),
      TOOL_TIMEOUT_MS
    )
  )

  try {
    const handler = getToolHandler(toolName)
    if (!handler) {
      return {
        toolName,
        success: false,
        error: `Tool "${toolName}" is not an allowlisted Optimus AI function.`,
        executionTimeMs: Date.now() - startTime,
      }
    }

    const data = await Promise.race([handler(args, context), timeoutPromise])

    return {
      toolName,
      success: true,
      data,
      executionTimeMs: Date.now() - startTime,
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return {
      toolName,
      success: false,
      error: message,
      executionTimeMs: Date.now() - startTime,
    }
  }
}

function getToolHandler(toolName: string) {
  switch (toolName) {
    case 'get_vehicle_telemetry':
      return handleVehicleTelemetry
    case 'get_driver_safety_profile':
      return handleDriverSafetyProfile
    case 'get_trip_pnl_summary':
      return handleTripPnlSummary
    case 'get_fuel_efficiency_metrics':
      return handleFuelEfficiencyMetrics
    case 'get_predictive_maintenance_alerts':
      return handlePredictiveMaintenanceAlerts
    case 'explain_ml_prediction':
      return handleExplainMlPrediction
    default:
      return null
  }
}

// ============================================================================
// TOOL 1: get_vehicle_telemetry
// ============================================================================
async function handleVehicleTelemetry(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'vehicles:view') && !hasPermission(context.role, 'fleet:view')) {
    throw new Error(`Role "${context.role}" lacks permission to view vehicle telemetry.`)
  }

  const rawVehicleId = typeof args.vehicleId === 'string' ? args.vehicleId : ''
  if (!rawVehicleId.trim()) {
    throw new Error('Missing required argument: vehicleId')
  }

  const { clean, upper } = normalizeIdentifier(rawVehicleId)

  // Enforce company isolation using mandatory AND array
  const vehicle = await db.vehicle.findFirst({
    where: {
      AND: [
        { companyId: context.companyId },
        {
          OR: [
            { id: clean },
            { vehicleNumber: upper },
            { registrationNumber: upper },
            { vehicleNumber: { contains: clean } },
          ],
        },
      ],
    },
    include: {
      healthRecords: {
        orderBy: { assessedDate: 'desc' },
        take: 1,
      },
      trips: {
        where: { status: 'in_progress' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          logs: {
            orderBy: { timestamp: 'desc' },
            take: 1,
          },
        },
      },
    },
  })

  if (!vehicle) {
    return {
      found: false,
      message: `No vehicle matching "${rawVehicleId}" was found in your organization.`,
    }
  }

  const latestHealth = vehicle.healthRecords[0]
  const activeTrip = vehicle.trips[0]
  const latestLog = activeTrip?.logs?.[0]

  // Check historical GPS if active trip has no log
  let lastKnownGps: {
    latitude: number | null
    longitude: number | null
    location: string | null
    timestamp: string | null
    status: 'recent_packet' | 'historical_stale_gps' | 'no_gps_recorded'
  } = {
    latitude: null,
    longitude: null,
    location: null,
    timestamp: null,
    status: 'no_gps_recorded',
  }

  if (latestLog?.lat && latestLog?.lng) {
    const elapsedMinutes = Math.floor((Date.now() - new Date(latestLog.timestamp).getTime()) / 60000)
    lastKnownGps = {
      latitude: latestLog.lat,
      longitude: latestLog.lng,
      location: latestLog.location,
      timestamp: latestLog.timestamp.toISOString(),
      status: elapsedMinutes > 60 ? 'historical_stale_gps' : 'recent_packet',
    }
  } else {
    // Check most recent historical trip log
    const historicalLog = await db.tripLog.findFirst({
      where: {
        AND: [
          { trip: { vehicle: { companyId: context.companyId, id: vehicle.id } } },
          { lat: { not: null } },
        ],
      },
      orderBy: { timestamp: 'desc' },
    })

    if (historicalLog?.lat && historicalLog?.lng) {
      lastKnownGps = {
        latitude: historicalLog.lat,
        longitude: historicalLog.lng,
        location: historicalLog.location,
        timestamp: historicalLog.timestamp.toISOString(),
        status: 'historical_stale_gps',
      }
    }
  }

  // Motion state determination
  let motionState = 'unconfirmed_motion_state'
  if (activeTrip) {
    motionState = 'active_dispatch_in_transit'
  } else if (['available', 'maintenance', 'out_of_service'].includes(vehicle.status)) {
    motionState = `confirmed_stationary_state (${vehicle.status})`
  }

  return {
    found: true,
    vehicle: {
      id: vehicle.id,
      vehicleNumber: vehicle.vehicleNumber,
      registrationNumber: vehicle.registrationNumber,
      model: vehicle.model,
      manufacturer: vehicle.manufacturer,
      fuelType: vehicle.fuelType,
      odometerKm: vehicle.odometer,
      operationalStatus: vehicle.status,
      motionState,
      activeTripNumber: activeTrip ? activeTrip.tripNumber : null,
      gpsTelemetry: lastKnownGps,
      telemetrySource: 'persisted_database_records',
      healthScores: latestHealth
        ? {
            overallScore: latestHealth.overallScore,
            engineScore: latestHealth.engineScore,
            batteryScore: latestHealth.batteryScore,
            brakeScore: latestHealth.brakeScore,
            tyreScore: latestHealth.tyreScore,
            assessedDate: latestHealth.assessedDate.toISOString(),
          }
        : null,
    },
  }
}

// ============================================================================
// TOOL 2: get_driver_safety_profile
// ============================================================================
async function handleDriverSafetyProfile(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'drivers:view')) {
    throw new Error(`Role "${context.role}" lacks permission to view driver safety profiles.`)
  }

  const rawDriverId = typeof args.driverId === 'string' ? args.driverId : ''
  if (!rawDriverId.trim()) {
    throw new Error('Missing required argument: driverId')
  }

  const { clean, upper } = normalizeIdentifier(rawDriverId)

  // Enforce company isolation using mandatory AND array
  const driver = await db.driver.findFirst({
    where: {
      AND: [
        { companyId: context.companyId },
        {
          OR: [
            { id: clean },
            { licenseNumber: upper },
            { name: { contains: clean } },
          ],
        },
      ],
    },
    include: {
      scores: {
        orderBy: { periodDate: 'desc' },
        take: 3,
      },
    },
  })

  if (!driver) {
    return {
      found: false,
      message: `No driver matching "${rawDriverId}" was found in your organization.`,
    }
  }

  const latestScore = driver.scores[0]

  return {
    found: true,
    driver: {
      id: driver.id,
      name: driver.name,
      licenseNumber: driver.licenseNumber,
      experienceYears: driver.experience,
      rating: driver.rating,
      dutyStatus: driver.status,
      latestSafetyScore: latestScore
        ? {
            safetyScore: latestScore.safetyScore,
            overspeedingEvents: latestScore.overspeeding,
            harshBrakingEvents: latestScore.harshBraking,
            sharpTurns: latestScore.sharpTurns,
            nightDrivingHours: latestScore.nightDriving,
            continuousDriveHours: latestScore.continuousDrive,
            idleTimeMinutes: latestScore.idleTime,
            period: latestScore.period,
            periodDate: latestScore.periodDate.toISOString(),
            source: 'persisted_driver_scorecard',
          }
        : null,
      message: latestScore
        ? 'Latest historical safety scorecard retrieved.'
        : 'No recorded safety scorecards on file for this driver.',
    },
  }
}

// ============================================================================
// TOOL 3: get_trip_pnl_summary
// ============================================================================
async function handleTripPnlSummary(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'trips:view')) {
    throw new Error(`Role "${context.role}" lacks permission to view trip records.`)
  }

  const rawTripId = typeof args.tripId === 'string' ? args.tripId : ''
  if (!rawTripId.trim()) {
    throw new Error('Missing required argument: tripId')
  }

  const { clean, upper } = normalizeIdentifier(rawTripId)

  // Enforce company isolation via vehicle relation
  const trip = await db.trip.findFirst({
    where: {
      AND: [
        { vehicle: { companyId: context.companyId } },
        {
          OR: [
            { id: clean },
            { tripNumber: upper },
            { tripNumber: { contains: clean } },
          ],
        },
      ],
    },
    include: {
      vehicle: {
        select: {
          id: true,
          vehicleNumber: true,
          model: true,
        },
      },
      driver: {
        select: {
          id: true,
          name: true,
        },
      },
      expenses: {
        select: {
          id: true,
          category: true,
          amount: true,
          description: true,
          date: true,
        },
      },
    },
  })

  if (!trip) {
    return {
      found: false,
      message: `No trip matching "${rawTripId}" was found in your organization.`,
    }
  }

  const totalExpense = trip.expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  const revenue = trip.tripCost || 0
  const netMargin = revenue - totalExpense
  const marginPercentage = revenue > 0 ? ((netMargin / revenue) * 100).toFixed(2) : '0.00'

  const expensesByCategory: Record<string, number> = {}
  for (const exp of trip.expenses) {
    expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + exp.amount
  }

  return {
    found: true,
    tripPnl: {
      tripNumber: trip.tripNumber,
      status: trip.status,
      corridor: `${trip.pickupLocation} -> ${trip.destination}`,
      assignedVehicle: trip.vehicle.vehicleNumber,
      assignedDriver: trip.driver.name,
      estimatedDistanceKm: trip.estimatedDistance,
      actualDistanceKm: trip.actualDistance,
      revenueBilled: revenue,
      totalExpenses: totalExpense,
      netMargin,
      marginPercentage: `${marginPercentage}%`,
      expensesByCategory,
      expenseEntriesCount: trip.expenses.length,
      accountingNotes: 'Trip revenue represents contract tariff. Margin accounts for recorded fuel, toll, and operational receipts.',
    },
  }
}

// ============================================================================
// TOOL 4: get_fuel_efficiency_metrics
// ============================================================================
async function handleFuelEfficiencyMetrics(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'fuel:view') && !hasPermission(context.role, 'reports:view')) {
    throw new Error(`Role "${context.role}" lacks permission to view fuel metrics.`)
  }

  const rawVehicleId = typeof args.vehicleId === 'string' ? args.vehicleId : undefined
  const timeframeDays = args.timeframeDays === '7' || args.timeframeDays === '90' ? args.timeframeDays : '30'
  const days = parseInt(timeframeDays, 10)
  const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)

  // Mandatory tenant boundary in AND array
  const andConditions: any[] = [
    { vehicle: { companyId: context.companyId } },
    { fuelDate: { gte: cutoffDate } },
  ]

  if (rawVehicleId && rawVehicleId.trim()) {
    const { clean, upper } = normalizeIdentifier(rawVehicleId)
    andConditions.push({
      vehicle: {
        OR: [
          { id: clean },
          { vehicleNumber: upper },
          { registrationNumber: upper },
          { vehicleNumber: { contains: clean } },
        ],
      },
    })
  }

  const fuelLogs = await db.fuelLog.findMany({
    where: {
      AND: andConditions,
    },
    include: {
      vehicle: {
        select: {
          id: true,
          vehicleNumber: true,
          model: true,
          fuelType: true,
        },
      },
    },
    orderBy: { fuelDate: 'desc' },
    take: 50,
  })

  if (fuelLogs.length === 0) {
    return {
      found: true,
      timeframeDays,
      logsCount: 0,
      totalLiters: 0,
      totalCost: 0,
      averageMileageKmPerL: null,
      message: `No fuel logs recorded for your organization in the past ${timeframeDays} days.`,
    }
  }

  let totalLiters = 0
  let totalCost = 0
  let validMileageCount = 0
  let mileageSum = 0

  const vehicleBreakdown: Record<string, { liters: number; cost: number; logs: number }> = {}

  for (const log of fuelLogs) {
    totalLiters += log.quantity
    totalCost += log.cost
    if (log.mileage && log.mileage > 0) {
      mileageSum += log.mileage
      validMileageCount += 1
    }

    const vNum = log.vehicle.vehicleNumber
    if (!vehicleBreakdown[vNum]) {
      vehicleBreakdown[vNum] = { liters: 0, cost: 0, logs: 0 }
    }
    vehicleBreakdown[vNum].liters += log.quantity
    vehicleBreakdown[vNum].cost += log.cost
    vehicleBreakdown[vNum].logs += 1
  }

  const averageMileageKmPerL =
    validMileageCount > 0 ? (mileageSum / validMileageCount).toFixed(2) : null

  return {
    found: true,
    timeframeDays,
    logsCount: fuelLogs.length,
    logsEvaluated: fuelLogs.length,
    mostRecentLogDate: fuelLogs[0]?.fuelDate.toISOString(),
    totalLiters: Math.round(totalLiters * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
    averageMileageKmPerL: averageMileageKmPerL ? `${averageMileageKmPerL} km/L` : 'Insufficient mileage data',
    vehicleBreakdown: Object.entries(vehicleBreakdown).slice(0, 10).map(([vehicle, stats]) => ({
      vehicle,
      liters: Math.round(stats.liters * 100) / 100,
      cost: Math.round(stats.cost * 100) / 100,
      entries: stats.logs,
    })),
  }
}

// ============================================================================
// TOOL 5: get_predictive_maintenance_alerts
// ============================================================================
async function handlePredictiveMaintenanceAlerts(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'maintenance:view')) {
    throw new Error(`Role "${context.role}" lacks permission to view maintenance alerts.`)
  }

  const urgencyThreshold = typeof args.urgencyThreshold === 'string' ? args.urgencyThreshold : 'all'

  // 1. Fetch Recorded Maintenance Work Orders (status: pending or in_progress)
  const maintenanceRecords = await db.maintenanceRecord.findMany({
    where: {
      AND: [
        { vehicle: { companyId: context.companyId } },
        { status: { in: ['pending', 'in_progress'] } },
      ],
    },
    include: {
      vehicle: {
        select: {
          id: true,
          vehicleNumber: true,
          model: true,
        },
      },
      repairs: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 15,
  })

  // 2. Fetch Deterministic Physical Health Threshold Alerts
  const vehiclesWithLowHealth = await db.vehicleHealth.findMany({
    where: {
      AND: [
        { vehicle: { companyId: context.companyId } },
        {
          OR: [
            { brakeScore: { lt: 80 } },
            { batteryScore: { lt: 75 } },
            { engineScore: { lt: 80 } },
            { tyreScore: { lt: 70 } },
          ],
        },
      ],
    },
    include: {
      vehicle: {
        select: {
          id: true,
          vehicleNumber: true,
          model: true,
        },
      },
    },
    orderBy: { assessedDate: 'desc' },
    take: 15,
  })

  // 3. Fetch Actual ML Model Predictions from AIPrediction model
  const mlPredictions = await db.aIPrediction.findMany({
    where: {
      AND: [
        { type: 'maintenance' },
        { status: 'active' },
      ],
    },
    orderBy: { createdAt: 'desc' },
    take: 15,
  })

  // Filter ML predictions to only those whose targetId is a vehicle in context.companyId
  const companyVehicleIds = new Set(
    (
      await db.vehicle.findMany({
        where: { companyId: context.companyId },
        select: { id: true },
      })
    ).map((v) => v.id)
  )

  const verifiedMlPredictions = mlPredictions.filter(
    (p) => p.targetId && companyVehicleIds.has(p.targetId)
  )

  return {
    urgencyThreshold,
    recordedMaintenanceWorkOrders: maintenanceRecords.map((m) => ({
      attribution: 'Recorded Maintenance Work Order (Technician Entry)',
      recordId: m.id,
      vehicleNumber: m.vehicle.vehicleNumber,
      type: m.type,
      status: m.status,
      scheduledDate: m.scheduledDate ? m.scheduledDate.toISOString() : null,
      description: m.description,
      costEstimate: m.cost,
    })),
    deterministicHealthThresholdAlerts: vehiclesWithLowHealth.map((h) => ({
      attribution: 'Deterministic Health Threshold Rule (Sensor Scorecard)',
      vehicleNumber: h.vehicle.vehicleNumber,
      brakeScore: h.brakeScore,
      batteryScore: h.batteryScore,
      engineScore: h.engineScore,
      tyreScore: h.tyreScore,
      assessedDate: h.assessedDate.toISOString(),
      ruleTrigger: 'Physical sensor health dropped below operating threshold (<80%)',
    })),
    machineLearningPredictions: verifiedMlPredictions.length > 0
      ? verifiedMlPredictions.map((p) => ({
          attribution: 'Machine Learning Predictive Inference',
          predictionId: p.id,
          targetVehicleId: p.targetId,
          confidence: `${Math.round(p.confidence * 100)}%`,
          predictionData: safeParseJson(p.predictionData),
          generatedAt: p.createdAt.toISOString(),
          expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
        }))
      : 'No recorded ML predictive model inference is available on file for this organization.',
  }
}

// ============================================================================
// TOOL 6: explain_ml_prediction
// ============================================================================
async function handleExplainMlPrediction(
  args: Record<string, unknown>,
  context: IToolExecutionContext
) {
  if (!hasPermission(context.role, 'ai:view') && !hasPermission(context.role, 'reports:view')) {
    throw new Error(`Role "${context.role}" lacks permission to access AI prediction diagnostics.`)
  }

  const modelType = typeof args.modelType === 'string' ? args.modelType : ''
  const rawTargetId = typeof args.targetId === 'string' ? args.targetId : ''

  if (!modelType || !rawTargetId) {
    throw new Error('Missing required arguments: modelType and targetId')
  }

  const { clean, upper } = normalizeIdentifier(rawTargetId)

  // Verify that the target (vehicle or driver) belongs to context.companyId
  let resolvedTargetId: string | null = null
  let targetType: 'vehicle' | 'driver' | null = null

  const vehicle = await db.vehicle.findFirst({
    where: {
      AND: [
        { companyId: context.companyId },
        {
          OR: [
            { id: clean },
            { vehicleNumber: upper },
            { registrationNumber: upper },
            { vehicleNumber: { contains: clean } },
          ],
        },
      ],
    },
    select: { id: true, vehicleNumber: true },
  })

  if (vehicle) {
    resolvedTargetId = vehicle.id
    targetType = 'vehicle'
  } else {
    const driver = await db.driver.findFirst({
      where: {
        AND: [
          { companyId: context.companyId },
          {
            OR: [
              { id: clean },
              { licenseNumber: upper },
              { name: { contains: clean } },
            ],
          },
        ],
      },
      select: { id: true, name: true },
    })
    if (driver) {
      resolvedTargetId = driver.id
      targetType = 'driver'
    }
  }

  if (!resolvedTargetId) {
    return {
      found: false,
      message: `Target "${rawTargetId}" is not authorized or does not exist in your organization.`,
    }
  }

  // Sourced strictly from AIPrediction table
  const prediction = await db.aIPrediction.findFirst({
    where: {
      AND: [
        { type: modelType },
        { targetId: resolvedTargetId },
        { status: 'active' },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })

  if (!prediction) {
    return {
      found: false,
      modelType,
      targetId: rawTargetId,
      message: `No active ML prediction inference on file for ${targetType} "${rawTargetId}" under model category "${modelType}".`,
    }
  }

  return {
    found: true,
    predictionSummary: {
      attribution: 'Machine Learning Predictive Inference (Verified Persisted Model)',
      modelType: prediction.type,
      targetType,
      confidenceScore: `${Math.round(prediction.confidence * 100)}%`,
      generatedTimestamp: prediction.createdAt.toISOString(),
      expiresTimestamp: prediction.expiresAt ? prediction.expiresAt.toISOString() : null,
      featureTelemetryWeights: safeParseJson(prediction.predictionData),
      explanation: 'ML inference computed via historical telematics and component degradation feature weights.',
    },
  }
}

function safeParseJson(data: string) {
  try {
    return JSON.parse(data)
  } catch {
    return data
  }
}
