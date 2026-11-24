import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const vehicle = await db.vehicle.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        fuelLogs: { orderBy: { fuelDate: 'desc' }, take: 10 },
        maintenanceRecords: { orderBy: { createdAt: 'desc' }, take: 10 },
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
        healthRecords: { orderBy: { assessedDate: 'desc' }, take: 5 },
        _count: { select: { trips: true, maintenanceRecords: true, fuelLogs: true, expenses: true } },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('GET vehicle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.vehicle.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    const updatable = [
      'vehicleNumber', 'model', 'manufacturer', 'registrationNumber',
      'fuelType', 'engineDetails', 'odometer', 'status', 'companyId',
    ]
    for (const key of updatable) {
      if (body[key] !== undefined) data[key] = body[key]
    }

    if (body.insuranceExpiry) data.insuranceExpiry = new Date(body.insuranceExpiry)
    if (body.pollutionCertExpiry) data.pollutionCertExpiry = new Date(body.pollutionCertExpiry)
    if (body.rcBookExpiry) data.rcBookExpiry = new Date(body.rcBookExpiry)

    const vehicle = await db.vehicle.update({ where: { id }, data })
    return NextResponse.json({ vehicle })
  } catch (error) {
    console.error('PUT vehicle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.vehicle.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    await db.vehicle.delete({ where: { id } })
    return NextResponse.json({ message: 'Vehicle deleted successfully' })
  } catch (error) {
    console.error('DELETE vehicle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
