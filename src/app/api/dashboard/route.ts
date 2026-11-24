import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const endOfLastMonth = startOfMonth

    // ==================== FLEET SUMMARY ====================
    const vehicleCounts = await db.vehicle.groupBy({
      by: ['status'],
      _count: true,
    })
    const vehicleStatusMap: Record<string, number> = {}
    vehicleCounts.forEach((v) => { vehicleStatusMap[v.status] = v._count })
    const totalVehicles = Object.values(vehicleStatusMap).reduce((a, b) => a + b, 0)

    const fleetSummary = {
      total: totalVehicles,
      active: vehicleStatusMap['active'] || 0,
      available: vehicleStatusMap['available'] || 0,
      maintenance: vehicleStatusMap['maintenance'] || 0,
      outOfService: vehicleStatusMap['out_of_service'] || 0,
    }

    // ==================== DRIVER SUMMARY ====================
    const driverCounts = await db.driver.groupBy({
      by: ['status'],
      _count: true,
    })
    const driverStatusMap: Record<string, number> = {}
    driverCounts.forEach((d) => { driverStatusMap[d.status] = d._count })
    const totalDrivers = Object.values(driverStatusMap).reduce((a, b) => a + b, 0)

    const topPerformers = await db.driver.findMany({
      where: { rating: { gte: 4.5 } },
      select: { id: true, name: true, rating: true, status: true },
      orderBy: { rating: 'desc' },
      take: 5,
    })
    const unsafeDrivers = await db.driver.findMany({
      where: { rating: { lt: 3.5 } },
      select: { id: true, name: true, rating: true, status: true },
      orderBy: { rating: 'asc' },
      take: 5,
    })

    const driverSummary = {
      total: totalDrivers,
      active: driverStatusMap['on_trip'] || 0,
      available: driverStatusMap['available'] || 0,
      offDuty: driverStatusMap['off_duty'] || 0,
      inactive: driverStatusMap['inactive'] || 0,
      topPerformers,
      unsafeDrivers,
    }

    // ==================== FINANCIAL SUMMARY ====================
    // Monthly expenses (current month)
    const monthlyExpenses = await db.expense.aggregate({
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true },
    })
    const lastMonthExpenses = await db.expense.aggregate({
      where: { date: { gte: startOfLastMonth, lt: endOfLastMonth } },
      _sum: { amount: true },
    })

    // Fuel cost this month
    const monthlyFuelCost = await db.fuelLog.aggregate({
      where: { fuelDate: { gte: startOfMonth } },
      _sum: { cost: true, quantity: true },
    })

    // Maintenance cost this month
    const monthlyMaintenanceCost = await db.maintenanceRecord.aggregate({
      where: { scheduledDate: { gte: startOfMonth } },
      _sum: { cost: true },
    })

    // Revenue from completed trips
    const monthlyRevenue = await db.trip.aggregate({
      where: {
        status: 'completed',
        startDate: { gte: startOfMonth },
      },
      _sum: { tripCost: true },
    })

    const totalMonthlyExpense = monthlyExpenses._sum.amount || 0
    const totalMonthlyFuel = monthlyFuelCost._sum.cost || 0
    const totalMonthlyMaintenance = monthlyMaintenanceCost._sum.cost || 0
    const totalMonthlyRevenue = monthlyRevenue._sum.tripCost || 0

    // Expense category breakdown
    const categoryBreakdown = await db.expense.groupBy({
      by: ['category'],
      where: { date: { gte: startOfMonth } },
      _sum: { amount: true },
      _count: true,
      orderBy: { _sum: { amount: 'desc' } },
    })

    // Monthly expense trend (last 6 months)
    const monthlyTrend: { month: string; expenses: number; revenue: number }[] = []
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
      const monthLabel = monthStart.toLocaleString('default', { month: 'short', year: '2-digit' })

      const exp = await db.expense.aggregate({
        where: { date: { gte: monthStart, lt: monthEnd } },
        _sum: { amount: true },
      })
      const rev = await db.trip.aggregate({
        where: { status: 'completed', startDate: { gte: monthStart, lt: monthEnd } },
        _sum: { tripCost: true },
      })
      monthlyTrend.push({
        month: monthLabel,
        expenses: exp._sum.amount || 0,
        revenue: rev._sum.tripCost || 0,
      })
    }

    const financialSummary = {
      monthlyExpense: totalMonthlyExpense,
      lastMonthExpense: lastMonthExpenses._sum.amount || 0,
      expenseChange: lastMonthExpenses._sum.amount
        ? ((totalMonthlyExpense - (lastMonthExpenses._sum.amount || 0)) / (lastMonthExpenses._sum.amount || 1)) * 100
        : 0,
      fuelCost: totalMonthlyFuel,
      fuelQuantity: monthlyFuelCost._sum.quantity || 0,
      maintenanceCost: totalMonthlyMaintenance,
      revenue: totalMonthlyRevenue,
      profit: totalMonthlyRevenue - totalMonthlyExpense,
      profitMargin: totalMonthlyRevenue > 0
        ? ((totalMonthlyRevenue - totalMonthlyExpense) / totalMonthlyRevenue) * 100
        : 0,
      categoryBreakdown,
      monthlyTrend,
    }

    // ==================== TRIP SUMMARY ====================
    const tripCounts = await db.trip.groupBy({
      by: ['status'],
      _count: true,
    })
    const tripStatusMap: Record<string, number> = {}
    tripCounts.forEach((t) => { tripStatusMap[t.status] = t._count })
    const totalTrips = Object.values(tripStatusMap).reduce((a, b) => a + b, 0)

    const recentTrips = await db.trip.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        driver: { select: { id: true, name: true } },
        vehicle: { select: { id: true, vehicleNumber: true, model: true } },
      },
    })

    const tripSummary = {
      total: totalTrips,
      scheduled: tripStatusMap['scheduled'] || 0,
      inProgress: tripStatusMap['in_progress'] || 0,
      completed: tripStatusMap['completed'] || 0,
      cancelled: tripStatusMap['cancelled'] || 0,
      delayed: tripStatusMap['delayed'] || 0,
      recentTrips,
    }

    // ==================== RECENT MAINTENANCE ====================
    const recentMaintenance = await db.maintenanceRecord.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: { select: { id: true, vehicleNumber: true, model: true } },
      },
    })

    // ==================== NOTIFICATION COUNT ====================
    const unreadNotifications = await db.notification.count({
      where: { isRead: false },
    })

    // ==================== AI INSIGHTS ====================
    const predictions = await db.aIPrediction.findMany({
      where: { status: 'active' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    })

    // Vehicle health overview
    const healthRecords = await db.vehicleHealth.findMany({
      orderBy: { assessedDate: 'desc' },
      distinct: ['vehicleId'],
      include: {
        vehicle: { select: { id: true, vehicleNumber: true, model: true, status: true } },
      },
      take: 5,
    })

    const aiInsights = {
      predictions,
      vehicleHealth: healthRecords,
      summary: {
        highRiskVehicles: healthRecords.filter((h) => h.overallScore < 60).length,
        maintenanceDueSoon: predictions.filter((p) => p.type === 'maintenance').length,
        fuelAlerts: predictions.filter((p) => p.type === 'fuel').length,
        accidentRisks: predictions.filter((p) => p.type === 'accident_risk').length,
      },
    }

    return NextResponse.json({
      fleetSummary,
      driverSummary,
      financialSummary,
      tripSummary,
      recentMaintenance,
      unreadNotifications,
      aiInsights,
      generatedAt: now.toISOString(),
    })
  } catch (error) {
    console.error('GET dashboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
