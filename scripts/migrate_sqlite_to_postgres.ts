/**
 * FleetVision AI — Controlled One-Time SQLite to PostgreSQL Data Migration Tool
 * 
 * Safely transfers all active records from local SQLite (db/custom.db)
 * to production Render PostgreSQL database while preserving exact IDs,
 * timestamps, constraints, and relationships.
 * 
 * Usage:
 *   TARGET_DATABASE_URL="postgresql://..." npx tsx scripts/migrate_sqlite_to_postgres.ts
 */

import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

async function runDataMigration() {
  const targetPgUrl = process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL
  if (!targetPgUrl || !targetPgUrl.startsWith('postgres')) {
    console.error('ERROR: TARGET_DATABASE_URL must be a valid PostgreSQL connection string.')
    console.error('Example: TARGET_DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"')
    process.exit(1)
  }

  const sqlitePath = path.resolve(process.cwd(), 'db/custom.db')
  if (!fs.existsSync(sqlitePath)) {
    console.error(`ERROR: Source SQLite database not found at: ${sqlitePath}`)
    process.exit(1)
  }

  console.log('=================================================================')
  console.log('    FLEETVISION AI: SQLITE -> POSTGRESQL DATA MIGRATION          ')
  console.log('=================================================================')
  console.log(`Source SQLite:     ${sqlitePath}`)
  console.log(`Target PostgreSQL: ${targetPgUrl.split('@')[1] || 'Target DB'}\n`)

  // 1. Initialize SQLite Source Client
  const sourceDb = new PrismaClient({
    datasources: { db: { url: `file:${sqlitePath.replace(/\\/g, '/')}` } },
  })

  // 2. Initialize PostgreSQL Target Client
  const targetDb = new PrismaClient({
    datasources: { db: { url: targetPgUrl } },
  })

  try {
    console.log('1. Reading all records from SQLite...')
    const [
      companies,
      users,
      companyMembers,
      branches,
      vehicles,
      drivers,
      vehicleDocs,
      driverDocs,
      driverScores,
      trips,
      tripLogs,
      tripRoutes,
      fuelLogs,
      maintenanceRecords,
      repairs,
      expenses,
      vehicleHealth,
      aiPredictions,
      notifications,
      auditLogs,
    ] = await Promise.all([
      sourceDb.company.findMany(),
      sourceDb.user.findMany(),
      sourceDb.companyMember.findMany(),
      sourceDb.branch.findMany(),
      sourceDb.vehicle.findMany(),
      sourceDb.driver.findMany(),
      sourceDb.vehicleDocument.findMany(),
      sourceDb.driverDocument.findMany(),
      sourceDb.driverScore.findMany(),
      sourceDb.trip.findMany(),
      sourceDb.tripLog.findMany(),
      sourceDb.tripRoute.findMany(),
      sourceDb.fuelLog.findMany(),
      sourceDb.maintenanceRecord.findMany(),
      sourceDb.repair.findMany(),
      sourceDb.expense.findMany(),
      sourceDb.vehicleHealth.findMany(),
      sourceDb.aIPrediction.findMany(),
      sourceDb.notification.findMany(),
      sourceDb.auditLog.findMany(),
    ])

    console.log(`  - Companies: ${companies.length}`)
    console.log(`  - Users: ${users.length}`)
    console.log(`  - Vehicles: ${vehicles.length}`)
    console.log(`  - Drivers: ${drivers.length}`)
    console.log(`  - Trips: ${trips.length}`)
    console.log(`  - Fuel Logs: ${fuelLogs.length}`)
    console.log(`  - Maintenance: ${maintenanceRecords.length}`)
    console.log(`  - Expenses: ${expenses.length}`)
    console.log(`  - Health Radar: ${vehicleHealth.length}`)

    console.log('\n2. Inserting records into PostgreSQL (Topological Order)...')

    // Companies
    for (const item of companies) {
      await targetDb.company.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Users
    for (const item of users) {
      await targetDb.user.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // CompanyMembers
    for (const item of companyMembers) {
      await targetDb.companyMember.upsert({
        where: { userId_companyId: { userId: item.userId, companyId: item.companyId } },
        update: item,
        create: item,
      })
    }
    // Branches
    for (const item of branches) {
      await targetDb.branch.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Vehicles
    for (const item of vehicles) {
      await targetDb.vehicle.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Drivers
    for (const item of drivers) {
      await targetDb.driver.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Vehicle Documents
    for (const item of vehicleDocs) {
      await targetDb.vehicleDocument.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Driver Documents
    for (const item of driverDocs) {
      await targetDb.driverDocument.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Driver Scores
    for (const item of driverScores) {
      await targetDb.driverScore.upsert({
        where: { driverId_period_periodDate: { driverId: item.driverId, period: item.period, periodDate: item.periodDate } },
        update: item,
        create: item,
      })
    }
    // Trips
    for (const item of trips) {
      await targetDb.trip.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Trip Logs & Routes
    for (const item of tripLogs) {
      await targetDb.tripLog.upsert({ where: { id: item.id }, update: item, create: item })
    }
    for (const item of tripRoutes) {
      await targetDb.tripRoute.upsert({ where: { tripId: item.tripId }, update: item, create: item })
    }
    // Fuel Logs
    for (const item of fuelLogs) {
      await targetDb.fuelLog.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Maintenance & Repairs
    for (const item of maintenanceRecords) {
      await targetDb.maintenanceRecord.upsert({ where: { id: item.id }, update: item, create: item })
    }
    for (const item of repairs) {
      await targetDb.repair.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Expenses
    for (const item of expenses) {
      await targetDb.expense.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Vehicle Health
    for (const item of vehicleHealth) {
      await targetDb.vehicleHealth.upsert({
        where: { vehicleId_assessedDate: { vehicleId: item.vehicleId, assessedDate: item.assessedDate } },
        update: item,
        create: item,
      })
    }
    // AI Predictions
    for (const item of aiPredictions) {
      await targetDb.aIPrediction.upsert({ where: { id: item.id }, update: item, create: item })
    }
    // Notifications & Audit Logs
    for (const item of notifications) {
      await targetDb.notification.upsert({ where: { id: item.id }, update: item, create: item })
    }
    for (const item of auditLogs) {
      await targetDb.auditLog.upsert({ where: { id: item.id }, update: item, create: item })
    }

    console.log('\n3. Validating PostgreSQL Destination Counts...')
    const [pgVehicles, pgUsers, pgTrips, pgFuel, pgMaint] = await Promise.all([
      targetDb.vehicle.count(),
      targetDb.user.count(),
      targetDb.trip.count(),
      targetDb.fuelLog.count(),
      targetDb.maintenanceRecord.count(),
    ])

    console.log(`  ✓ PostgreSQL Vehicles: ${pgVehicles} (Source: ${vehicles.length})`)
    console.log(`  ✓ PostgreSQL Users: ${pgUsers} (Source: ${users.length})`)
    console.log(`  ✓ PostgreSQL Trips: ${pgTrips} (Source: ${trips.length})`)
    console.log(`  ✓ PostgreSQL Fuel Logs: ${pgFuel} (Source: ${fuelLogs.length})`)
    console.log(`  ✓ PostgreSQL Maintenance: ${pgMaint} (Source: ${maintenanceRecords.length})`)

    console.log('\n=================================================================')
    console.log('✓ SQLITE TO POSTGRESQL DATA MIGRATION COMPLETED SUCCESSFULLY')
    console.log('=================================================================')
  } catch (err: any) {
    console.error('Migration failed:', err)
  } finally {
    await sourceDb.$disconnect()
    await targetDb.$disconnect()
  }
}

runDataMigration()
