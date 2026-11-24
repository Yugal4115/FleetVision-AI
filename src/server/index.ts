/**
 * FLEETVISION AI — BACKEND SERVER DOMAIN LAYER
 * 
 * Provides centralized data access, database repositories,
 * and business services for Next.js API route handlers and server components.
 */

export * from './repositories/vehicleRepository'
export * from './repositories/driverRepository'
export * from './repositories/tripRepository'
export { db } from '@/lib/db'
