import { db } from '@/lib/db'

export interface ITripQueryOptions {
  status?: string
  driverId?: string
  vehicleId?: string
  page?: number
  limit?: number
}

/**
 * BACKEND DOMAIN REPOSITORY: Trips
 * Centralized, type-safe data access for fleet mission dispatches and corridor logs.
 */
export class TripRepository {
  static async findMany(options: ITripQueryOptions = {}) {
    const { status, driverId, vehicleId, page = 1, limit = 50 } = options
    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (driverId) where.driverId = driverId
    if (vehicleId) where.vehicleId = vehicleId

    const [trips, total] = await Promise.all([
      db.trip.findMany({
        where,
        include: {
          driver: { select: { id: true, name: true, phone: true, rating: true } },
          vehicle: { select: { id: true, vehicleNumber: true, model: true, registrationNumber: true } },
          route: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.trip.count({ where }),
    ])

    return {
      trips,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  static async findById(id: string) {
    return db.trip.findUnique({
      where: { id },
      include: {
        driver: true,
        vehicle: true,
        route: true,
        logs: { orderBy: { timestamp: 'desc' } },
        expenses: true,
      },
    })
  }
}
