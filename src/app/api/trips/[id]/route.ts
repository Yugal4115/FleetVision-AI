import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const trip = await db.trip.findUnique({
      where: { id },
      include: {
        driver: { select: { id: true, name: true, phone: true, email: true, rating: true } },
        vehicle: { select: { id: true, vehicleNumber: true, model: true, manufacturer: true, status: true } },
        logs: { orderBy: { timestamp: 'asc' } },
        route: true,
        expenses: true,
      },
    })

    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    return NextResponse.json({ trip })
  } catch (error) {
    console.error('GET trip error:', error)
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

    const existing = await db.trip.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    const updatable = [
      'pickupLocation', 'pickupLat', 'pickupLng',
      'destination', 'destLat', 'destLng',
      'driverId', 'vehicleId', 'assignedBy',
      'estimatedDistance', 'estimatedTime', 'actualDistance', 'actualTime',
      'tripCost', 'notes',
    ]
    for (const key of updatable) {
      if (body[key] !== undefined) data[key] = body[key]
    }
    if (body.status !== undefined) data.status = body.status
    if (body.startDate) data.startDate = new Date(body.startDate)
    if (body.endDate) data.endDate = new Date(body.endDate)

    const trip = await db.trip.update({ where: { id }, data })
    return NextResponse.json({ trip })
  } catch (error) {
    console.error('PUT trip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.trip.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    await db.trip.delete({ where: { id } })
    return NextResponse.json({ message: 'Trip deleted successfully' })
  } catch (error) {
    console.error('DELETE trip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
