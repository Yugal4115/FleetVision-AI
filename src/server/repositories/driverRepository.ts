import { db } from '@/lib/db'

export interface IDriverQueryOptions {
  status?: string
  search?: string
  companyId?: string
  page?: number
  limit?: number
}

/**
 * BACKEND DOMAIN REPOSITORY: Drivers
 * Centralized, type-safe data access for fleet driver records.
 */
export class DriverRepository {
  static async findMany(options: IDriverQueryOptions = {}) {
    const { status, search, companyId, page = 1, limit = 50 } = options
    const where: Record<string, unknown> = {}

    if (status) where.status = status
    if (companyId) where.companyId = companyId
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
        { licenseNumber: { contains: search } },
      ]
    }

    const [drivers, total] = await Promise.all([
      db.driver.findMany({
        where,
        include: {
          company: { select: { id: true, name: true } },
          scores: { orderBy: { periodDate: 'desc' }, take: 1 },
          _count: { select: { trips: true, scores: true, fuelLogs: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.driver.count({ where }),
    ])

    return {
      drivers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    }
  }

  static async findById(id: string) {
    return db.driver.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        documents: true,
        scores: { orderBy: { periodDate: 'desc' }, take: 10 },
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { trips: true, scores: true, fuelLogs: true, expenses: true } },
      },
    })
  }
}
