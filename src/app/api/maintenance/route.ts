import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (vehicleId) where.vehicleId = vehicleId
    if (status) where.status = status
    if (type) where.type = type

    const [records, total] = await Promise.all([
      db.maintenanceRecord.findMany({
        where,
        include: {
          vehicle: { select: { id: true, vehicleNumber: true, model: true, manufacturer: true } },
          repairs: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.maintenanceRecord.count({ where }),
    ])

    const aggregate = await db.maintenanceRecord.aggregate({
      where,
      _sum: { cost: true },
    })

    return NextResponse.json({
      records,
      aggregate: {
        totalCost: aggregate._sum.cost || 0,
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET maintenance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleId, type, description, cost, status,
      scheduledDate, completedDate, odometer, performedBy, notes,
      repairs,
    } = body

    if (!vehicleId || !type) {
      return NextResponse.json(
        { error: 'vehicleId and type are required' },
        { status: 400 }
      )
    }

    const record = await db.maintenanceRecord.create({
      data: {
        vehicleId,
        type,
        description,
        cost: cost || 0,
        status: status || 'pending',
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        completedDate: completedDate ? new Date(completedDate) : null,
        odometer,
        performedBy,
        notes,
        ...(repairs && Array.isArray(repairs) ? {
          repairs: {
            create: repairs.map((r: { component: string; issue: string; action?: string; partsUsed?: string; laborCost?: number }) => ({
              component: r.component,
              issue: r.issue,
              action: r.action,
              partsUsed: r.partsUsed,
              laborCost: r.laborCost || 0,
            })),
          },
        } : {}),
      },
      include: { repairs: true },
    })

    return NextResponse.json({ record }, { status: 201 })
  } catch (error) {
    console.error('POST maintenance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
