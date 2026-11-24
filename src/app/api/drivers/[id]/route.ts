import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const driver = await db.driver.findUnique({
      where: { id },
      include: {
        company: { select: { id: true, name: true } },
        trips: { orderBy: { createdAt: 'desc' }, take: 10 },
        scores: { orderBy: { periodDate: 'desc' }, take: 10 },
        _count: { select: { trips: true, scores: true, fuelLogs: true } },
      },
    })

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    return NextResponse.json({ driver })
  } catch (error) {
    console.error('GET driver error:', error)
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

    const existing = await db.driver.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    const updatable = [
      'name', 'phone', 'email', 'licenseNumber', 'experience',
      'emergencyContact', 'emergencyPhone', 'address', 'rating', 'status', 'companyId',
    ]
    for (const key of updatable) {
      if (body[key] !== undefined) data[key] = body[key]
    }
    if (body.licenseExpiry) data.licenseExpiry = new Date(body.licenseExpiry)

    const driver = await db.driver.update({ where: { id }, data })
    return NextResponse.json({ driver })
  } catch (error) {
    console.error('PUT driver error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.driver.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    await db.driver.delete({ where: { id } })
    return NextResponse.json({ message: 'Driver deleted successfully' })
  } catch (error) {
    console.error('DELETE driver error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
