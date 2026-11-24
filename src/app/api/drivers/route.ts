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
          _count: { select: { trips: true, scores: true, fuelLogs: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.driver.count({ where }),
    ])

    return NextResponse.json({
      drivers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET drivers error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name, phone, email, licenseNumber, licenseExpiry,
      experience, emergencyContact, emergencyPhone, address,
      rating, status, companyId,
    } = body

    if (!name || !phone || !licenseNumber) {
      return NextResponse.json(
        { error: 'name, phone, and licenseNumber are required' },
        { status: 400 }
      )
    }

    const existing = await db.driver.findFirst({
      where: { OR: [{ phone }, { licenseNumber }, ...(email ? [{ email }] : [])] },
    })
    if (existing) {
      return NextResponse.json(
        { error: 'Driver with this phone, license, or email already exists' },
        { status: 409 }
      )
    }

    const driver = await db.driver.create({
      data: {
        name,
        phone,
        email,
        licenseNumber,
        licenseExpiry: licenseExpiry ? new Date(licenseExpiry) : null,
        experience: experience || 0,
        emergencyContact,
        emergencyPhone,
        address,
        rating: rating ?? 5.0,
        status: status || 'available',
        companyId,
      },
    })

    return NextResponse.json({ driver }, { status: 201 })
  } catch (error) {
    console.error('POST driver error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
