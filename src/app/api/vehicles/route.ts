import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const companyId = searchParams.get('companyId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

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
          _count: { select: { trips: true, maintenanceRecords: true, fuelLogs: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.vehicle.count({ where }),
    ])

    return NextResponse.json({
      vehicles,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET vehicles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      vehicleNumber, model, manufacturer, registrationNumber,
      fuelType, engineDetails, odometer, status,
      insuranceExpiry, pollutionCertExpiry, rcBookExpiry, companyId,
    } = body

    if (!vehicleNumber || !model || !manufacturer || !registrationNumber) {
      return NextResponse.json(
        { error: 'vehicleNumber, model, manufacturer, and registrationNumber are required' },
        { status: 400 }
      )
    }

    const existing = await db.vehicle.findFirst({
      where: {
        OR: [{ vehicleNumber }, { registrationNumber }],
      },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Vehicle with this number or registration already exists' },
        { status: 409 }
      )
    }

    const vehicle = await db.vehicle.create({
      data: {
        vehicleNumber,
        model,
        manufacturer,
        registrationNumber,
        fuelType: fuelType || 'diesel',
        engineDetails,
        odometer: odometer || 0,
        status: status || 'available',
        insuranceExpiry: insuranceExpiry ? new Date(insuranceExpiry) : null,
        pollutionCertExpiry: pollutionCertExpiry ? new Date(pollutionCertExpiry) : null,
        rcBookExpiry: rcBookExpiry ? new Date(rcBookExpiry) : null,
        companyId,
      },
    })

    return NextResponse.json({ vehicle }, { status: 201 })
  } catch (error) {
    console.error('POST vehicle error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
