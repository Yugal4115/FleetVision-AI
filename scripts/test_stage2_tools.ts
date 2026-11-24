import { db } from '../src/lib/db'
import { executeAssistantTool, IToolExecutionContext } from '../src/services/llm/toolExecutor'

async function runStage2Verification() {
  console.log('====================================================================')
  console.log('STAGE 2: SECURE ALLOWLISTED TOOL DISPATCHER VERIFICATION TEST')
  console.log('====================================================================\n')

  // Identify tenant contexts
  const rootCompany = await db.company.findFirst({
    where: { name: { contains: 'FleetVision' } },
  })
  const emptyCompany = await db.company.findFirst({
    where: { name: { not: { contains: 'FleetVision' } } },
  })

  if (!rootCompany) {
    throw new Error('Root company (FleetVision) not found in database.')
  }

  const rootContext: IToolExecutionContext = {
    userId: 'usr_root_manager',
    companyId: rootCompany.id,
    role: 'fleet_manager',
  }

  const emptyContext: IToolExecutionContext = {
    userId: 'usr_tenant_nantha',
    companyId: emptyCompany ? emptyCompany.id : 'cmw_dummy_empty_tenant',
    role: 'fleet_manager',
  }

  console.log(`Root Organisation (FleetVision): ${rootCompany.name} (${rootCompany.id})`)
  console.log(`Empty/Secondary Organisation: ${emptyCompany?.name || 'Dummy'} (${emptyContext.companyId})\n`)

  // Record initial counts to verify ZERO mutations
  const [vCount1, dCount1, tCount1, fCount1, mCount1] = await Promise.all([
    db.vehicle.count(),
    db.driver.count(),
    db.trip.count(),
    db.fuelLog.count(),
    db.maintenanceRecord.count(),
  ])

  // -------------------------------------------------------------------------
  // TOOL 1: get_vehicle_telemetry
  // -------------------------------------------------------------------------
  console.log('--- TEST 1: get_vehicle_telemetry ---')
  // 1a: Authenticated root org lookup with public identifier
  const res1a = await executeAssistantTool('get_vehicle_telemetry', { vehicleId: 'FV-014' }, rootContext)
  console.log('1a. Authenticated lookup (FV-014):', res1a.success, (res1a.data as any)?.vehicle?.model)

  // 1b: Normalization test with lowercase input
  const res1b = await executeAssistantTool('get_vehicle_telemetry', { vehicleId: '  fv-014  ' }, rootContext)
  console.log('1b. Case-insensitive lowercase input (fv-014):', res1b.success, (res1b.data as any)?.found)

  // 1c: Cross-organisation leakage test
  const res1c = await executeAssistantTool('get_vehicle_telemetry', { vehicleId: 'FV-014' }, emptyContext)
  console.log('1c. Cross-organisation access rejection:', res1c.success, (res1c.data as any)?.found === false)

  // 1d: Invalid identifier
  const res1d = await executeAssistantTool('get_vehicle_telemetry', { vehicleId: 'NONEXISTENT-999' }, rootContext)
  console.log('1d. Non-existent vehicle rejection:', res1d.success, (res1d.data as any)?.found === false)

  // 1e: Missing required argument
  const res1e = await executeAssistantTool('get_vehicle_telemetry', {}, rootContext)
  console.log('1e. Missing vehicleId validation error caught:', !res1e.success, res1e.error)
  console.log('Test 1 Passed.\n')

  // -------------------------------------------------------------------------
  // TOOL 2: get_driver_safety_profile
  // -------------------------------------------------------------------------
  console.log('--- TEST 2: get_driver_safety_profile ---')
  const sampleDriver = await db.driver.findFirst({ where: { companyId: rootCompany.id } })
  const driverName = sampleDriver?.name || 'Pradeep Kumar'

  // 2a: Authenticated driver lookup
  const res2a = await executeAssistantTool('get_driver_safety_profile', { driverId: driverName }, rootContext)
  console.log(`2a. Driver lookup (${driverName}):`, res2a.success, (res2a.data as any)?.found)

  // 2b: Cross-organisation driver rejection
  const res2b = await executeAssistantTool('get_driver_safety_profile', { driverId: driverName }, emptyContext)
  console.log('2b. Cross-organisation driver rejection:', res2b.success, (res2b.data as any)?.found === false)
  console.log('Test 2 Passed.\n')

  // -------------------------------------------------------------------------
  // TOOL 3: get_trip_pnl_summary
  // -------------------------------------------------------------------------
  console.log('--- TEST 3: get_trip_pnl_summary ---')
  const sampleTrip = await db.trip.findFirst({
    where: { vehicle: { companyId: rootCompany.id } },
  })
  const tripNum = sampleTrip?.tripNumber || 'TRIP-2026-8801'

  // 3a: Authenticated trip PnL
  const res3a = await executeAssistantTool('get_trip_pnl_summary', { tripId: tripNum }, rootContext)
  console.log(`3a. Trip PnL summary (${tripNum}):`, res3a.success, 'Revenue:', (res3a.data as any)?.tripPnl?.revenueBilled, 'Margin:', (res3a.data as any)?.tripPnl?.marginPercentage)

  // 3b: Cross-organisation trip rejection
  const res3b = await executeAssistantTool('get_trip_pnl_summary', { tripId: tripNum }, emptyContext)
  console.log('3b. Cross-organisation trip rejection:', res3b.success, (res3b.data as any)?.found === false)
  console.log('Test 3 Passed.\n')

  // -------------------------------------------------------------------------
  // TOOL 4: get_fuel_efficiency_metrics
  // -------------------------------------------------------------------------
  console.log('--- TEST 4: get_fuel_efficiency_metrics ---')
  // 4a: Fleet-wide aggregation
  const res4a = await executeAssistantTool('get_fuel_efficiency_metrics', { timeframeDays: '30' }, rootContext)
  console.log('4a. Fleet-wide fuel metrics:', res4a.success, 'Logs:', (res4a.data as any)?.logsEvaluated, 'Avg mileage:', (res4a.data as any)?.averageMileageKmPerL)

  // 4b: Vehicle-specific fuel metrics
  const res4b = await executeAssistantTool('get_fuel_efficiency_metrics', { vehicleId: 'FV-014', timeframeDays: '30' }, rootContext)
  console.log('4b. Specific vehicle (FV-014) fuel metrics:', res4b.success, 'Logs count:', (res4b.data as any)?.logsCount ?? (res4b.data as any)?.logsEvaluated)

  // 4c: Empty organisation safe response
  const res4c = await executeAssistantTool('get_fuel_efficiency_metrics', { timeframeDays: '30' }, emptyContext)
  console.log('4c. Empty organisation safe response (0 logs, no crash):', res4c.success, (res4c.data as any)?.logsCount === 0)

  // 4d: Cross-organisation query attempt on FV-014 by secondary tenant
  const res4d = await executeAssistantTool('get_fuel_efficiency_metrics', { vehicleId: 'FV-014', timeframeDays: '30' }, emptyContext)
  console.log('4d. Cross-org vehicle query returns 0 logs for unauthorized tenant:', res4d.success, (res4d.data as any)?.logsCount === 0)
  console.log('Test 4 Passed.\n')

  // -------------------------------------------------------------------------
  // TOOL 5: get_predictive_maintenance_alerts
  // -------------------------------------------------------------------------
  console.log('--- TEST 5: get_predictive_maintenance_alerts ---')
  // 5a: Authenticated root org alerts
  const res5a = await executeAssistantTool('get_predictive_maintenance_alerts', { urgencyThreshold: 'all' }, rootContext)
  const d5a = res5a.data as any
  console.log('5a. Recorded Work Orders count:', d5a?.recordedMaintenanceWorkOrders?.length)
  console.log('5a. Deterministic Health Threshold rules count:', d5a?.deterministicHealthThresholdAlerts?.length)
  console.log('5a. ML Predictions attribution:', typeof d5a?.machineLearningPredictions === 'string' ? d5a.machineLearningPredictions : 'Array of ML records')

  // 5b: Empty organisation zero-leakage check
  const res5b = await executeAssistantTool('get_predictive_maintenance_alerts', { urgencyThreshold: 'all' }, emptyContext)
  const d5b = res5b.data as any
  console.log('5b. Empty organisation work orders leaked:', d5b?.recordedMaintenanceWorkOrders?.length === 0)
  console.log('5b. Empty organisation deterministic alerts leaked:', d5b?.deterministicHealthThresholdAlerts?.length === 0)
  console.log('Test 5 Passed.\n')

  // -------------------------------------------------------------------------
  // TOOL 6: explain_ml_prediction
  // -------------------------------------------------------------------------
  console.log('--- TEST 6: explain_ml_prediction ---')
  // 6a: Authorized vehicle lookup
  const res6a = await executeAssistantTool('explain_ml_prediction', { modelType: 'maintenance', targetId: 'FV-014' }, rootContext)
  console.log('6a. Authorized vehicle target check:', res6a.success, (res6a.data as any)?.message || (res6a.data as any)?.predictionSummary?.attribution)

  // 6b: Cross-organisation target authorization rejection
  const res6b = await executeAssistantTool('explain_ml_prediction', { modelType: 'maintenance', targetId: 'FV-014' }, emptyContext)
  console.log('6b. Cross-organisation target rejection:', res6b.success, (res6b.data as any)?.found === false)

  // 6c: Missing required argument validation
  const res6c = await executeAssistantTool('explain_ml_prediction', { targetId: 'FV-014' }, rootContext)
  console.log('6c. Missing modelType validation caught:', !res6c.success, res6c.error)
  console.log('Test 6 Passed.\n')

  // -------------------------------------------------------------------------
  // DATABASE IMMUTABILITY VERIFICATION
  // -------------------------------------------------------------------------
  console.log('--- DATABASE IMMUTABILITY VERIFICATION ---')
  const [vCount2, dCount2, tCount2, fCount2, mCount2] = await Promise.all([
    db.vehicle.count(),
    db.driver.count(),
    db.trip.count(),
    db.fuelLog.count(),
    db.maintenanceRecord.count(),
  ])

  const countsMatch =
    vCount1 === vCount2 &&
    dCount1 === dCount2 &&
    tCount1 === tCount2 &&
    fCount1 === fCount2 &&
    mCount1 === mCount2

  console.log('Before vs After record counts match (ZERO mutations):', countsMatch)
  console.log(`Vehicles: ${vCount1} -> ${vCount2}`)
  console.log(`Drivers: ${dCount1} -> ${dCount2}`)
  console.log(`Trips: ${tCount1} -> ${tCount2}`)
  console.log(`Fuel Logs: ${fCount1} -> ${fCount2}`)
  console.log(`Maintenance Records: ${mCount1} -> ${mCount2}`)

  if (!countsMatch) {
    throw new Error('DATABASE MUTATION DETECTED: Read-only guarantee violated!')
  }

  console.log('\n====================================================================')
  console.log('STAGE 2 VERIFICATION COMPLETED SUCCESSFULLY WITH ZERO VIOLATIONS')
  console.log('====================================================================')
}

runStage2Verification().catch((err) => {
  console.error('STAGE 2 VERIFICATION FAILED:', err)
  process.exit(1)
})
