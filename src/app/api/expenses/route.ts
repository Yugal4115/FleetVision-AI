import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const vehicleId = searchParams.get('vehicleId')
    const driverId = searchParams.get('driverId')
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: Record<string, unknown> = {}
    if (category) where.category = category
    if (vehicleId) where.vehicleId = vehicleId
    if (driverId) where.driverId = driverId
    if (from || to) {
      where.date = {}
      if (from) (where.date as Record<string, unknown>).gte = new Date(from)
      if (to) (where.date as Record<string, unknown>).lte = new Date(to)
    }

    const [expenses, total] = await Promise.all([
      db.expense.findMany({
        where,
        include: {
          vehicle: { select: { id: true, vehicleNumber: true, model: true } },
          driver: { select: { id: true, name: true } },
          trip: { select: { id: true, tripNumber: true, pickupLocation: true, destination: true } },
        },
        orderBy: { date: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.expense.count({ where }),
    ])

    const aggregate = await db.expense.aggregate({
      where,
      _sum: { amount: true },
      _count: true,
    })

    // Category breakdown
    const categoryBreakdown = await db.expense.groupBy({
      by: ['category'],
      where,
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    })

    return NextResponse.json({
      expenses,
      aggregate: {
        totalAmount: aggregate._sum.amount || 0,
        count: aggregate._count,
        categoryBreakdown,
      },
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    })
  } catch (error) {
    console.error('GET expenses error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { category, amount, description, date, vehicleId, driverId, tripId, receiptUrl } = body

    if (!category || amount === undefined || !date) {
      return NextResponse.json(
        { error: 'category, amount, and date are required' },
        { status: 400 }
      )
    }

    const expense = await db.expense.create({
      data: {
        category,
        amount,
        description,
        date: new Date(date),
        vehicleId,
        driverId,
        tripId,
        receiptUrl,
      },
    })

    return NextResponse.json({ expense }, { status: 201 })
  } catch (error) {
    console.error('POST expense error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
