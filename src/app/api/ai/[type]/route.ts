import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params
    const { searchParams } = new URL(request.url)
    const targetId = searchParams.get('targetId')

    switch (type) {
      case 'maintenance':
        return handleMaintenancePrediction(targetId)
      case 'driver-behavior':
        return handleDriverBehavior(targetId)
      case 'fuel-prediction':
        return handleFuelPrediction(targetId)
      case 'route-optimization':
        return handleRouteOptimization(targetId)
      case 'accident-risk':
        return handleAccidentRisk(targetId)
      case 'vehicle-health':
        return handleVehicleHealth(targetId)
      case 'fleet-analytics':
        return handleFleetAnalytics()
      default:
        return NextResponse.json({ error: `Unknown AI prediction type: ${type}` }, { status: 400 })
    }
  } catch (error) {
    console.error('AI prediction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleMaintenancePrediction(vehicleId?: string | null) {
  const vehicles = vehicleId
    ? await db.vehicle.findMany({ where: { id: vehicleId } })
    : await db.vehicle.findMany({ take: 15 })

  const predictions = vehicles.map((v) => {
    const score = rand(20, 95)
    const urgency = score < 40 ? 'critical' : score < 65 ? 'high' : score < 80 ? 'medium' : 'low'
    const types = ['oil_change', 'brake_service', 'battery', 'tyres', 'engine_repair', 'scheduled_service']
    const predictedType = types[randInt(0, types.length - 1)]
    const daysUntilDue = randInt(1, 90)
    const estimatedCost = randInt(500, 25000)

    return {
      vehicleId: v.id,
      vehicleNumber: v.vehicleNumber,
      vehicleModel: v.model,
      currentOdometer: v.odometer,
      predictedMaintenanceType: predictedType,
      predictedDate: new Date(Date.now() + daysUntilDue * 86400000).toISOString().split('T')[0],
      daysUntilDue,
      confidence: rand(70, 98),
      urgency,
      estimatedCost,
      recommendation: score < 50
        ? `Urgent: ${v.vehicleNumber} needs ${predictedType.replace('_', ' ')} within ${daysUntilDue} days`
        : `${v.vehicleNumber} may require ${predictedType.replace('_', ' ')} in ~${daysUntilDue} days`,
    }
  })

  return NextResponse.json({ type: 'maintenance', predictions, generatedAt: new Date().toISOString() })
}

async function handleDriverBehavior(driverId?: string | null) {
  const drivers = driverId
    ? await db.driver.findMany({ where: { id: driverId } })
    : await db.driver.findMany({ take: 20 })

  const predictions = drivers.map((d) => {
    const safetyScore = rand(40, 100)
    return {
      driverId: d.id,
      driverName: d.name,
      currentRating: d.rating,
      safetyScore,
      behavior: {
        overspeedingEvents: randInt(0, 25),
        harshBrakingEvents: randInt(0, 15),
        sharpTurns: randInt(0, 20),
        nightDrivingHours: randInt(0, 40),
        continuousDriveViolations: randInt(0, 8),
        idleTimeHours: rand(0, 15),
      },
      riskLevel: safetyScore < 50 ? 'high' : safetyScore < 70 ? 'medium' : 'low',
      trend: Math.random() > 0.5 ? 'improving' : 'declining',
      recommendation: safetyScore < 60
        ? `${d.name} needs immediate coaching on safe driving practices`
        : safetyScore < 80
          ? `${d.name} could benefit from refresher training`
          : `${d.name} maintains excellent driving standards`,
    }
  })

  return NextResponse.json({ type: 'driver-behavior', predictions, generatedAt: new Date().toISOString() })
}

async function handleFuelPrediction(vehicleId?: string | null) {
  const vehicles = vehicleId
    ? await db.vehicle.findMany({ where: { id: vehicleId } })
    : await db.vehicle.findMany({ take: 15 })

  const predictions = vehicles.map((v) => {
    const currentMileage = rand(6, 18)
    const predictedMileage = rand(5, 20)
    const monthlyFuelCost = rand(8000, 45000)
    const efficiency = rand(55, 95)

    return {
      vehicleId: v.id,
      vehicleNumber: v.vehicleNumber,
      vehicleModel: v.model,
      fuelType: v.fuelType,
      currentMileage: `${currentMileage} km/l`,
      predictedMileage: `${predictedMileage} km/l`,
      mileageChange: ((predictedMileage - currentMileage) / currentMileage * 100).toFixed(1) + '%',
      monthlyFuelCost,
      predictedMonthlyCost: monthlyFuelCost * rand(0.85, 1.15),
      efficiencyScore: efficiency,
      fuelConsumption: {
        thisMonth: rand(200, 800),
        predictedNextMonth: rand(200, 800),
        change: rand(-15, 15),
      },
      recommendation: efficiency < 65
        ? `${v.vehicleNumber} shows poor fuel efficiency - consider maintenance check`
        : `${v.vehicleNumber} fuel efficiency is within normal range`,
    }
  })

  return NextResponse.json({ type: 'fuel-prediction', predictions, generatedAt: new Date().toISOString() })
}

async function handleRouteOptimization(_targetId?: string | null) {
  const inProgressTrips = await db.trip.findMany({
    where: { status: 'in_progress' },
    include: {
      driver: { select: { id: true, name: true } },
      vehicle: { select: { id: true, vehicleNumber: true } },
    },
    take: 10,
  })

  const optimizations = inProgressTrips.map((trip) => {
    const originalTime = trip.estimatedTime || 120
    const optimizedTime = originalTime * rand(0.75, 0.95)
    const originalDist = trip.estimatedDistance || 100
    const optimizedDist = originalDist * rand(0.8, 0.98)
    const savings = rand(5, 25)

    return {
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      driverName: trip.driver.name,
      vehicleNumber: trip.vehicle.vehicleNumber,
      from: trip.pickupLocation,
      to: trip.destination,
      original: {
        distance: `${originalDist.toFixed(1)} km`,
        estimatedTime: `${Math.round(originalTime)} min`,
      },
      optimized: {
        distance: `${optimizedDist.toFixed(1)} km`,
        estimatedTime: `${Math.round(optimizedTime)} min`,
        savings: `${savings}%`,
      },
      fuelSavings: rand(2, 15),
      co2Reduction: rand(1, 10),
    }
  })

  // Simulated general optimization stats
  const fleetStats = {
    totalTripsAnalyzed: randInt(50, 200),
    averageOptimization: rand(8, 22),
    totalDistanceSaved: rand(500, 5000),
    totalFuelSaved: rand(100, 1500),
    totalCostSaved: rand(10000, 100000),
  }

  return NextResponse.json({
    type: 'route-optimization',
    fleetStats,
    optimizations,
    generatedAt: new Date().toISOString(),
  })
}

async function handleAccidentRisk(driverId?: string | null) {
  const drivers = driverId
    ? await db.driver.findMany({ where: { id: driverId } })
    : await db.driver.findMany({ take: 15 })

  const predictions = drivers.map((d) => {
    const riskScore = rand(5, 85)
    const factors = {
      driverExperience: rand(20, 100),
      drivingHoursThisWeek: rand(10, 70),
      fatigueIndex: rand(0, 80),
      weatherConditions: rand(10, 90),
      routeComplexity: rand(20, 95),
      vehicleCondition: rand(30, 100),
      timeOfDayRisk: rand(10, 70),
      historicalIncidents: randInt(0, 5),
    }

    return {
      driverId: d.id,
      driverName: d.name,
      riskScore,
      riskLevel: riskScore < 25 ? 'low' : riskScore < 50 ? 'medium' : riskScore < 75 ? 'high' : 'critical',
      contributingFactors: factors,
      topRiskFactors: Object.entries(factors)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .slice(0, 3)
        .map(([key, val]) => ({ factor: key, score: val })),
      recommendation: riskScore > 60
        ? `HIGH RISK: ${d.name} - consider reassigning routes or mandatory rest`
        : riskScore > 35
          ? `Moderate risk for ${d.name} - monitor closely and ensure breaks`
          : `${d.name} is within acceptable risk parameters`,
    }
  })

  return NextResponse.json({ type: 'accident-risk', predictions, generatedAt: new Date().toISOString() })
}

async function handleVehicleHealth(vehicleId?: string | null) {
  const vehicles = vehicleId
    ? await db.vehicle.findMany({ where: { id: vehicleId } })
    : await db.vehicle.findMany({ take: 15 })

  const predictions = vehicles.map((v) => {
    const engine = rand(40, 100)
    const battery = rand(50, 100)
    const tyres = rand(35, 100)
    const brakes = rand(40, 100)
    const suspension = rand(50, 100)
    const overall = (engine + battery + tyres + brakes + suspension) / 5

    return {
      vehicleId: v.id,
      vehicleNumber: v.vehicleNumber,
      vehicleModel: v.model,
      odometer: v.odometer,
      healthScores: {
        engine,
        battery,
        tyres,
        brakes,
        suspension,
        overall: Math.round(overall * 100) / 100,
      },
      status: overall < 40 ? 'critical' : overall < 60 ? 'poor' : overall < 80 ? 'fair' : 'good',
      estimatedNextService: new Date(Date.now() + randInt(5, 60) * 86400000).toISOString().split('T')[0],
      recommendations: [
        ...(engine < 60 ? ['Engine check recommended'] : []),
        ...(battery < 60 ? ['Battery inspection needed'] : []),
        ...(tyres < 60 ? ['Tyre rotation or replacement due'] : []),
        ...(brakes < 60 ? ['Brake service overdue'] : []),
        ...(suspension < 60 ? ['Suspension inspection required'] : []),
      ].length > 0
        ? [`Engine check recommended`, 'Battery inspection needed', 'Tyre rotation due'].slice(0, randInt(0, 3))
        : ['All systems nominal'],
    }
  })

  return NextResponse.json({ type: 'vehicle-health', predictions, generatedAt: new Date().toISOString() })
}

async function handleFleetAnalytics() {
  const now = new Date()
  const totalVehicles = await db.vehicle.count()
  const activeTrips = await db.trip.count({ where: { status: 'in_progress' } })
  const completedTrips = await db.trip.count({ where: { status: 'completed' } })

  const tripDistance = await db.trip.aggregate({
    where: { status: 'completed' },
    _sum: { actualDistance: true },
  })

  const fuelAgg = await db.fuelLog.aggregate({ _sum: { quantity: true, cost: true } })

  const analytics = {
    fleetOverview: {
      totalVehicles,
      utilizationRate: rand(60, 95),
      averageAge: `${rand(1, 8)} years`,
      totalDistanceCovered: `${(tripDistance._sum.actualDistance || 0).toFixed(0)} km`,
    },
    performanceMetrics: {
      onTimeDelivery: rand(75, 98),
      averageTripDuration: `${rand(2, 12)} hours`,
      averageDistancePerTrip: `${rand(100, 600)} km`,
      fuelEfficiency: `${rand(7, 14)} km/l`,
      costPerKm: `₹${rand(8, 25)}`,
    },
    tripAnalytics: {
      activeTrips,
      completedTrips,
      completionRate: completedTrips > 0 ? rand(80, 99) : 0,
      averageDelay: `${rand(5, 45)} min`,
      cancellations: randInt(0, 15),
    },
    fuelAnalytics: {
      totalFuelConsumed: `${(fuelAgg._sum.quantity || 0).toFixed(0)} liters`,
      totalFuelCost: `₹${(fuelAgg._sum.cost || 0).toFixed(0)}`,
      averageFuelPerTrip: `${rand(30, 120)} liters`,
      fuelWastage: rand(2, 12),
    },
    costAnalytics: {
      totalOperatingCost: rand(500000, 2000000),
      costPerVehicle: rand(30000, 80000),
      maintenanceRatio: rand(10, 30),
      fuelRatio: rand(35, 55),
      savingsOpportunities: rand(5, 20),
    },
    trends: {
      fleetUtilization: { current: rand(60, 95), lastMonth: rand(55, 90), trend: 'up' as const },
      fuelEfficiency: { current: rand(7, 14), lastMonth: rand(6, 13), trend: 'up' as const },
      maintenanceCosts: { current: rand(30000, 80000), lastMonth: rand(25000, 75000), trend: Math.random() > 0.5 ? 'up' as const : 'down' as const },
      driverPerformance: { current: rand(70, 95), lastMonth: rand(65, 90), trend: 'up' as const },
    },
  }

  return NextResponse.json({ type: 'fleet-analytics', analytics, generatedAt: now.toISOString() })
}