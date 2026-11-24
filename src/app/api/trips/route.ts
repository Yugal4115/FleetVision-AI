import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const driverId = searchParams.get('driverId')
    const vehicleId = searchParams.get('vehicleId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (driverId) where.driverId = driverId
    if (vehicleId) where.vehicleId = vehicleId
    if (from || to) {
      where.startDate = {}
      if (from) (where.startDate as Record<string, unknown>).gte = new Date(from)
      if (to) (where.startDate as Record<string, unknown>).lte = new Date(to)
    }

    const [trips, total] = await Promise.all([
      db.trip.findMany({
        where,
        include: {
          driver: { select: { id: true, name: true, phone: true, rating: true } },
          vehicle: { select: { id: true, vehicleNumber: true, model: true, manufacturer: true } },
          _count: { select: { logs: true, expenses: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.trip.count({ where }),
    ])

    return NextResponse.json({
      trips,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET trips error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tripNumber, pickupLocation, pickupLat, pickupLng,
      destination, destLat, destLng,
      driverId, vehicleId, assignedBy,
      estimatedDistance, estimatedTime,
      tripCost, status, startDate, endDate, notes,
    } = body

    if (!pickupLocation || !destination || !driverId || !vehicleId) {
      return NextResponse.json(
        { error: 'pickupLocation, destination, driverId, and vehicleId are required' },
        { status: 400 }
      )
    }

    // Generate trip number if not provided
    const count = await db.trip.count()
    const finalTripNumber = tripNumber || `TRP-${String(count + 1).padStart(5, '0')}`

    const trip = await db.trip.create({
      data: {
        tripNumber: finalTripNumber,
        pickupLocation,
        pickupLat,
        pickupLng,
        destination,
        destLat,
        destLng,
        driverId,
        vehicleId,
        assignedBy,
        estimatedDistance: estimatedDistance || 0,
        estimatedTime: estimatedTime || 0,
        tripCost: tripCost || 0,
        status: status || 'scheduled',
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        notes,
      },
    })

    return NextResponse.json({ trip }, { status: 201 })
  } catch (error) {
    console.error('POST trip error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
