import { db } from '@/lib/db'

export interface IVehicleQueryOptions {
  status?: string
  search?: string
  companyId?: string
  page?: number
  limit?: number
}

/**
 * BACKEND DOMAIN REPOSITORY: Vehicles
 * Centralized, type-safe data access for fleet vehicle records.
 */
export class VehicleRepository {
  static async findMany(options: IVehicleQueryOptions = {}) {
    const { status, search, companyId, page = 1, limit = 50 } = options
    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (companyId) where.companyId = companyId
    if (search) {
      where.OR = [
        { vehicleNumber: { contains: search } },
        { model: { contains: search } },
        { manufacturer: { contains: search } },
        { registrationNumber: { contains: search } },
      ]
    }

    const [vehicles, total] = await Promise.all([
      db.vehicle.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          _count: {
            select: {
              trips: true,
              maintenanceRecords: true,
              fuelLogs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.vehicle.count({ where }),
    ])

    return {
      vehicles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  static async findById(id: string) {
    return db.vehicle.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        fuelLogs: { orderBy: { fuelDate: 'desc' }, take: 15 },
        maintenanceRecords: { orderBy: { createdAt: 'desc' }, take: 15 },
        trips: { orderBy: { createdAt: 'desc' }, take: 15 },
        healthRecords: { orderBy: { assessedDate: 'desc' }, take: 10 },
        _count: {
          select: {
            trips: true,
            maintenanceRecords: true,
            fuelLogs: true,
            expenses: true,
          },
        },
      },
    })
  }
}
