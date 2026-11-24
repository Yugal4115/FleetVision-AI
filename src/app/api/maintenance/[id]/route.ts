import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.maintenanceRecord.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: 'Maintenance record not found' }, { status: 404 })
    }

    const data: Record<string, unknown> = {}
    const updatable = ['type', 'description', 'cost', 'status', 'performedBy', 'notes', 'odometer']
    for (const key of updatable) {
      if (body[key] !== undefined) data[key] = body[key]
    }
    if (body.scheduledDate) data.scheduledDate = new Date(body.scheduledDate)
    if (body.completedDate) data.completedDate = new Date(body.completedDate)

    const record = await db.maintenanceRecord.update({ where: { id }, data })
    return NextResponse.json({ record })
  } catch (error) {
    console.error('PUT maintenance error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
