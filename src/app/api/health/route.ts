import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Quick database ping
    const dbHealthy = await db.$queryRaw`SELECT 1`.then(() => true).catch(() => false)
    return NextResponse.json({
      status: 'healthy',
      database: dbHealthy ? 'connected' : 'degraded',
      service: 'FleetVision AI Engine',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    })
  } catch (err: unknown) {
    return NextResponse.json(
      {
        status: 'degraded',
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 503 }
    )
  }
}
