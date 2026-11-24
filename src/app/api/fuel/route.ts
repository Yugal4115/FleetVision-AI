import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const driverId = searchParams.get('driverId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const fuelType = searchParams.get('fuelType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (vehicleId) where.vehicleId = vehicleId
    if (driverId) where.driverId = driverId
    if (fuelType) where.fuelType = fuelType
    if (from || to) {
      where.fuelDate = {}
      if (from) (where.fuelDate as Record<string, unknown>).gte = new Date(from)
      if (to) (where.fuelDate as Record<string, unknown>).lte = new Date(to)
    }

    const [fuelLogs, total] = await Promise.all([
      db.fuelLog.findMany({
        where,
        include: {
          vehicle: { select: { id: true, vehicleNumber: true, model: true } },
          driver: { select: { id: true, name: true } },
        },
        orderBy: { fuelDate: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.fuelLog.count({ where }),
    ])

    // Aggregate stats
    const aggregate = await db.fuelLog.aggregate({
      where,
      _sum: { quantity: true, cost: true },
      _avg: { mileage: true },
    })

    return NextResponse.json({
      fuelLogs,
      aggregate: {
        totalQuantity: aggregate._sum.quantity || 0,
        totalCost: aggregate._sum.cost || 0,
        avgMileage: aggregate._avg.mileage || 0,
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET fuel logs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleId, driverId, fuelDate, fuelType,
      quantity, cost, mileage, fuelStation, odometer, notes,
    } = body

    if (!vehicleId || !fuelDate || quantity === undefined || cost === undefined) {
      return NextResponse.json(
        { error: 'vehicleId, fuelDate, quantity, and cost are required' },
        { status: 400 }
      )
    }

    const fuelLog = await db.fuelLog.create({
      data: {
        vehicleId,
        driverId,
        fuelDate: new Date(fuelDate),
        fuelType: fuelType || 'diesel',
        quantity,
        cost,
        mileage,
        fuelStation,
        odometer,
        notes,
      },
    })

    return NextResponse.json({ fuelLog }, { status: 201 })
  } catch (error) {
    console.error('POST fuel log error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
