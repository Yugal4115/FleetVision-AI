import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST() {
  try {
    const results: Record<string, number> = {}

    // Clean existing data
    await db.notification.deleteMany()
    await db.aIPrediction.deleteMany()
    await db.vehicleHealth.deleteMany()
    await db.expense.deleteMany()
    await db.repair.deleteMany()
    await db.maintenanceRecord.deleteMany()
    await db.fuelLog.deleteMany()
    await db.tripLog.deleteMany()
    await db.tripRoute.deleteMany()
    await db.trip.deleteMany()
    await db.driverScore.deleteMany()
    await db.driverDocument.deleteMany()
    await db.driver.deleteMany()
    await db.vehicleDocument.deleteMany()
    await db.vehicle.deleteMany()
    await db.companyMember.deleteMany()
    await db.branch.deleteMany()
    await db.company.deleteMany()
    await db.auditLog.deleteMany()
    await db.user.deleteMany()

    // ==================== COMPANY ====================
    const company = await db.company.create({
      data: {
        name: 'FleetVision Logistics Pvt. Ltd.',
        address: '42 Industrial Area, Sector 7, Gurgaon, Haryana 122001',
        phone: '+91-124-4567890',
        email: 'ops@fleetvision-logistics.in',
      },
    })
    await db.branch.createMany({
      data: [
        { name: 'Delhi Hub', address: 'Warehouse No. 15, Najafgarh, New Delhi', phone: '+91-11-23456789', companyId: company.id },
        { name: 'Mumbai Hub', address: 'Plot 22, MIDC, Andheri East, Mumbai', phone: '+91-22-34567890', companyId: company.id },
        { name: 'Bangalore Hub', address: '94 PECH Layout, Whitefield, Bangalore', phone: '+91-80-45678901', companyId: company.id },
      ],
    })

    // ==================== USERS ====================
    const users = await db.user.createMany({
      data: [
        { email: 'admin@fleetvision.com', password: 'password123', name: 'Rajesh Kumar', phone: '+91-9876543210', role: 'admin', isActive: true },
        { email: 'manager@fleetvision.com', password: 'password123', name: 'Priya Sharma', phone: '+91-9876543211', role: 'fleet_manager', isActive: true },
        { email: 'dispatch@fleetvision.com', password: 'password123', name: 'Amit Verma', phone: '+91-9876543212', role: 'fleet_manager', isActive: true },
        { email: 'driver1@fleetvision.com', password: 'password123', name: 'Suresh Yadav', phone: '+91-9876543213', role: 'driver', isActive: true },
        { email: 'driver2@fleetvision.com', password: 'password123', name: 'Mohan Singh', phone: '+91-9876543214', role: 'driver', isActive: true },
      ],
    })
    results.users = users.count

    const createdUsers = await db.user.findMany()
    const adminUser = createdUsers.find((u) => u.role === 'admin')!
    const managerUser = createdUsers.find((u) => u.email === 'manager@fleetvision.com')!

    // Link admin to company
    await db.companyMember.create({
      data: { userId: adminUser.id, companyId: company.id, role: 'admin' },
    })

    // ==================== VEHICLES (14) ====================
    const vehicleData = [
      { vehicleNumber: 'FV-001', model: 'Tata Ace', manufacturer: 'Tata', registrationNumber: 'DL-01-AB-1234', fuelType: 'diesel', engineDetails: '700cc, 4-stroke', odometer: 45230, status: 'active' },
      { vehicleNumber: 'FV-002', model: 'Mahindra Bolero Pickup', manufacturer: 'Mahindra', registrationNumber: 'DL-01-CD-5678', fuelType: 'diesel', engineDetails: '1.5L mHawk', odometer: 67800, status: 'active' },
      { vehicleNumber: 'FV-003', model: 'Ashok Leyland Dost', manufacturer: 'Ashok Leyland', registrationNumber: 'DL-02-EF-9012', fuelType: 'diesel', engineDetails: '1.5L TDI', odometer: 34100, status: 'available' },
      { vehicleNumber: 'FV-004', model: 'Tata 407', manufacturer: 'Tata', registrationNumber: 'HR-26-GH-3456', fuelType: 'diesel', engineDetails: '3.0L Turbo DI', odometer: 120500, status: 'maintenance' },
      { vehicleNumber: 'FV-005', model: 'Eicher Pro 2049', manufacturer: 'Eicher', registrationNumber: 'HR-51-IJ-7890', fuelType: 'diesel', engineDetails: '2.0L E483', odometer: 89700, status: 'active' },
      { vehicleNumber: 'FV-006', model: 'Mahindra Scorpio S11', manufacturer: 'Mahindra', registrationNumber: 'MH-02-KL-1234', fuelType: 'diesel', engineDetails: '2.2L mHawk', odometer: 56200, status: 'available' },
      { vehicleNumber: 'FV-007', model: 'Tata Yodha Pickup', manufacturer: 'Tata', registrationNumber: 'MH-04-MN-5678', fuelType: 'diesel', engineDetails: '2.2L DICOR', odometer: 73400, status: 'active' },
      { vehicleNumber: 'FV-008', model: 'Ashok Leyland Bada Dost', manufacturer: 'Ashok Leyland', registrationNumber: 'KA-01-OP-9012', fuelType: 'diesel', engineDetails: '1.5L TDI', odometer: 41500, status: 'available' },
      { vehicleNumber: 'FV-009', model: 'Tata Intra V30', manufacturer: 'Tata', registrationNumber: 'KA-05-QR-3456', fuelType: 'diesel', engineDetails: '1.5L CRDi', odometer: 28900, status: 'active' },
      { vehicleNumber: 'FV-010', model: 'Eicher Pro 2055X', manufacturer: 'Eicher', registrationNumber: 'DL-04-ST-7890', fuelType: 'diesel', engineDetails: '2.0L E483', odometer: 95000, status: 'out_of_service' },
      { vehicleNumber: 'FV-011', model: 'Mahindra Supro', manufacturer: 'Mahindra', registrationNumber: 'HR-26-UV-1234', fuelType: 'petrol', engineDetails: '1.2L mFalcon', odometer: 21300, status: 'available' },
      { vehicleNumber: 'FV-012', model: 'Tata Winger', manufacturer: 'Tata', registrationNumber: 'DL-08-WX-5678', fuelType: 'diesel', engineDetails: '2.0L DICOR', odometer: 67800, status: 'active' },
      { vehicleNumber: 'FV-013', model: 'Piaggio Ape Xtra', manufacturer: 'Piaggio', registrationNumber: 'MH-12-YZ-9012', fuelType: 'cng', engineDetails: '230cc CNG', odometer: 35600, status: 'available' },
      { vehicleNumber: 'FV-014', model: 'Bajaj RE E-Tec 9.0', manufacturer: 'Bajaj', registrationNumber: 'DL-10-AB-3456', fuelType: 'electric', engineDetails: '8.2kW Motor', odometer: 15200, status: 'active' },
    ]

    const vehicles: any[] = []
    for (const vd of vehicleData) {
      const v = await db.vehicle.create({
        data: {
          ...vd,
          companyId: company.id,
          insuranceExpiry: new Date(Date.now() + Math.random() * 180 * 86400000),
          pollutionCertExpiry: new Date(Date.now() + Math.random() * 120 * 86400000),
          rcBookExpiry: new Date(Date.now() + 365 * 86400000),
        },
      })
      vehicles.push(v)
    }
    results.vehicles = vehicles.length

    // ==================== DRIVERS (10) ====================
    const driverData = [
      { name: 'Suresh Yadav', phone: '+91-8765432101', email: 'suresh@fleetvision.com', licenseNumber: 'DL-0420190012345', licenseExpiry: '2027-03-15', experience: 12, emergencyContact: 'Geeta Yadav', emergencyPhone: '+91-9876500001', address: 'Village Nangli, Najafgarh, New Delhi', rating: 4.8, status: 'on_trip' },
      { name: 'Mohan Singh', phone: '+91-8765432102', email: 'mohan@fleetvision.com', licenseNumber: 'HR-0620180054321', licenseExpiry: '2026-11-20', experience: 8, emergencyContact: 'Kamla Devi', emergencyPhone: '+91-9876500002', address: 'Sector 15, Gurgaon, Haryana', rating: 4.5, status: 'on_trip' },
      { name: 'Ramesh Gupta', phone: '+91-8765432103', email: 'ramesh@fleetvision.com', licenseNumber: 'MH-0120200098765', licenseExpiry: '2028-06-10', experience: 15, emergencyContact: 'Sunita Gupta', emergencyPhone: '+91-9876500003', address: 'Dombivli East, Thane, Maharashtra', rating: 4.9, status: 'available' },
      { name: 'Arjun Patel', phone: '+91-8765432104', email: 'arjun@fleetvision.com', licenseNumber: 'GJ-0520210011223', licenseExpiry: '2026-09-05', experience: 5, emergencyContact: 'Meena Patel', emergencyPhone: '+91-9876500004', address: 'Navrangpura, Ahmedabad, Gujarat', rating: 4.2, status: 'on_trip' },
      { name: 'Vikram Reddy', phone: '+91-8765432105', email: 'vikram@fleetvision.com', licenseNumber: 'TS-0820190044556', licenseExpiry: '2027-12-25', experience: 10, emergencyContact: 'Lakshmi Reddy', emergencyPhone: '+91-9876500005', address: 'Kukatpally, Hyderabad, Telangana', rating: 4.6, status: 'available' },
      { name: 'Deepak Sharma', phone: '+91-8765432106', email: 'deepak@fleetvision.com', licenseNumber: 'RJ-1420200066778', licenseExpiry: '2026-04-18', experience: 3, emergencyContact: 'Anita Sharma', emergencyPhone: '+91-9876500006', address: 'Malviya Nagar, Jaipur, Rajasthan', rating: 3.4, status: 'off_duty' },
      { name: 'Karthik Iyer', phone: '+91-8765432107', email: 'karthik@fleetvision.com', licenseNumber: 'TN-0120180088990', licenseExpiry: '2027-08-30', experience: 14, emergencyContact: 'Priya Iyer', emergencyPhone: '+91-9876500007', address: 'Adyar, Chennai, Tamil Nadu', rating: 4.7, status: 'on_trip' },
      { name: 'Manoj Tiwari', phone: '+91-8765432108', email: 'manoj@fleetvision.com', licenseNumber: 'UP-7220190011223', licenseExpiry: '2026-01-15', experience: 6, emergencyContact: 'Savita Tiwari', emergencyPhone: '+91-9876500008', address: 'Indiranagar, Lucknow, UP', rating: 3.1, status: 'inactive' },
      { name: 'Sanjay Mehta', phone: '+91-8765432109', email: 'sanjay@fleetvision.com', licenseNumber: 'DL-0120170033445', licenseExpiry: '2027-05-20', experience: 18, emergencyContact: 'Rekha Mehta', emergencyPhone: '+91-9876500009', address: 'Rohini, New Delhi', rating: 4.9, status: 'available' },
      { name: 'Pradeep Kumar', phone: '+91-8765432110', email: 'pradeep@fleetvision.com', licenseNumber: 'KA-0120220055667', licenseExpiry: '2028-10-10', experience: 2, emergencyContact: 'Kavitha Kumar', emergencyPhone: '+91-9876500010', address: 'Whitefield, Bangalore, Karnataka', rating: 3.8, status: 'on_trip' },
    ]

    const drivers: any[] = []
    for (const dd of driverData) {
      const d = await db.driver.create({
        data: {
          ...dd,
          companyId: company.id,
          licenseExpiry: new Date(dd.licenseExpiry),
        },
      })
      drivers.push(d)
    }
    results.drivers = drivers.length

    // ==================== TRIPS (18) ====================
    const locations = [
      { city: 'New Delhi', lat: 28.6139, lng: 77.2090 },
      { city: 'Mumbai', lat: 19.0760, lng: 72.8777 },
      { city: 'Bangalore', lat: 12.9716, lng: 77.5946 },
      { city: 'Chennai', lat: 13.0827, lng: 80.2707 },
      { city: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
      { city: 'Jaipur', lat: 26.9124, lng: 75.7873 },
      { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
      { city: 'Pune', lat: 18.5204, lng: 73.8567 },
      { city: 'Kolkata', lat: 22.5726, lng: 88.3639 },
      { city: 'Lucknow', lat: 26.8467, lng: 80.9462 },
    ]

    const tripData = [
      { pickup: 0, dest: 1, driver: 0, vehicle: 0, status: 'completed', dist: 1400, time: 1440, cost: 35000, startDate: daysAgo(15), endDate: daysAgo(14) },
      { pickup: 1, dest: 2, driver: 1, vehicle: 1, status: 'completed', dist: 1000, time: 1080, cost: 28000, startDate: daysAgo(12), endDate: daysAgo(11) },
      { pickup: 2, dest: 3, driver: 2, vehicle: 2, status: 'completed', dist: 350, time: 420, cost: 12000, startDate: daysAgo(10), endDate: daysAgo(10) },
      { pickup: 0, dest: 5, driver: 3, vehicle: 4, status: 'completed', dist: 270, time: 300, cost: 8500, startDate: daysAgo(8), endDate: daysAgo(8) },
      { pickup: 4, dest: 2, driver: 4, vehicle: 5, status: 'completed', dist: 570, time: 660, cost: 16500, startDate: daysAgo(7), endDate: daysAgo(6) },
      { pickup: 5, dest: 0, driver: 6, vehicle: 6, status: 'completed', dist: 280, time: 330, cost: 9000, startDate: daysAgo(5), endDate: daysAgo(5) },
      { pickup: 0, dest: 6, driver: 8, vehicle: 8, status: 'completed', dist: 920, time: 960, cost: 24000, startDate: daysAgo(4), endDate: daysAgo(3) },
      { pickup: 3, dest: 1, driver: 2, vehicle: 2, status: 'completed', dist: 1350, time: 1320, cost: 34000, startDate: daysAgo(3), endDate: daysAgo(2) },
      { pickup: 7, dest: 1, driver: 4, vehicle: 5, status: 'completed', dist: 150, time: 180, cost: 5500, startDate: daysAgo(2), endDate: daysAgo(2) },
      { pickup: 0, dest: 3, driver: 0, vehicle: 0, status: 'in_progress', dist: 2200, time: 2400, cost: 55000, startDate: daysAgo(1) },
      { pickup: 1, dest: 4, driver: 1, vehicle: 1, status: 'in_progress', dist: 710, time: 780, cost: 20000, startDate: daysAgo(1) },
      { pickup: 2, dest: 0, driver: 3, vehicle: 4, status: 'in_progress', dist: 2100, time: 2280, cost: 52000, startDate: hoursAgo(8) },
      { pickup: 6, dest: 2, driver: 6, vehicle: 6, status: 'in_progress', dist: 1500, time: 1560, cost: 38000, startDate: hoursAgo(4) },
      { pickup: 0, dest: 8, driver: 9, vehicle: 9, status: 'scheduled', dist: 1500, time: 1680, cost: 40000, startDate: futureDate(1) },
      { pickup: 5, dest: 7, driver: 8, vehicle: 8, status: 'scheduled', dist: 1170, time: 1200, cost: 30000, startDate: futureDate(2) },
      { pickup: 0, dest: 9, driver: 2, vehicle: 2, status: 'scheduled', dist: 550, time: 600, cost: 16000, startDate: futureDate(3) },
      { pickup: 4, dest: 6, driver: 4, vehicle: 7, status: 'cancelled', dist: 1100, time: 1140, cost: 28000, startDate: daysAgo(6) },
      { pickup: 0, dest: 7, driver: 6, vehicle: 6, status: 'delayed', dist: 1500, time: 1560, cost: 38000, startDate: daysAgo(2) },
    ]

    const trips: any[] = []
    for (let i = 0; i < tripData.length; i++) {
      const t = tripData[i]
      const pickup = locations[t.pickup]
      const dest = locations[t.dest]
      const trip = await db.trip.create({
        data: {
          tripNumber: `TRP-${String(i + 1).padStart(5, '0')}`,
          pickupLocation: pickup.city,
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          destination: dest.city,
          destLat: dest.lat,
          destLng: dest.lng,
          driverId: drivers[t.driver].id,
          vehicleId: vehicles[t.vehicle].id,
          assignedBy: managerUser.id,
          estimatedDistance: t.dist,
          estimatedTime: t.time,
          actualDistance: t.status === 'completed' ? t.dist * (0.92 + Math.random() * 0.16) : null,
          actualTime: t.status === 'completed' ? Math.round(t.time * (0.9 + Math.random() * 0.25)) : null,
          tripCost: t.cost,
          status: t.status,
          startDate: t.startDate,
          endDate: t.endDate || null,
          notes: t.status === 'cancelled' ? 'Cancelled due to vehicle breakdown' : undefined,
        },
      })
      trips.push(trip)
    }
    results.trips = trips.length

    // ==================== FUEL LOGS (35) ====================
    const fuelStations = ['Indian Oil', 'HP Petrol', 'Bharat Petroleum', 'Shell', 'Essar', 'Reliance']
    const fuelLogs: any[] = []
    for (let i = 0; i < 35; i++) {
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
      const driver = drivers[Math.floor(Math.random() * drivers.length)]
      const qty = Math.round((20 + Math.random() * 80) * 10) / 10
      const costPerL = 85 + Math.random() * 10
      const fl = await db.fuelLog.create({
        data: {
          vehicleId: vehicle.id,
          driverId: driver.id,
          fuelDate: new Date(Date.now() - Math.random() * 90 * 86400000),
          fuelType: vehicle.fuelType,
          quantity: qty,
          cost: Math.round(qty * costPerL * 100) / 100,
          mileage: 6 + Math.random() * 10,
          fuelStation: fuelStations[Math.floor(Math.random() * fuelStations.length)],
          odometer: vehicle.odometer - Math.round(Math.random() * 5000),
        },
      })
      fuelLogs.push(fl)
    }
    results.fuelLogs = fuelLogs.length

    // ==================== MAINTENANCE RECORDS (12) ====================
    const maintenanceTypes = ['oil_change', 'brake_service', 'battery', 'tyres', 'engine_repair', 'scheduled_service']
    const maintenanceData = [
      { vehicle: 0, type: 'oil_change', status: 'completed', cost: 3500, scheduledDate: daysAgo(20), completedDate: daysAgo(19) },
      { vehicle: 1, type: 'brake_service', status: 'completed', cost: 8500, scheduledDate: daysAgo(18), completedDate: daysAgo(17) },
      { vehicle: 2, type: 'scheduled_service', status: 'completed', cost: 5000, scheduledDate: daysAgo(15), completedDate: daysAgo(14) },
      { vehicle: 3, type: 'engine_repair', status: 'in_progress', cost: 25000, scheduledDate: daysAgo(5) },
      { vehicle: 4, type: 'tyres', status: 'completed', cost: 12000, scheduledDate: daysAgo(12), completedDate: daysAgo(11) },
      { vehicle: 5, type: 'battery', status: 'completed', cost: 6500, scheduledDate: daysAgo(10), completedDate: daysAgo(10) },
      { vehicle: 6, type: 'oil_change', status: 'pending', cost: 3500, scheduledDate: futureDate(3) },
      { vehicle: 7, type: 'brake_service', status: 'pending', cost: 8000, scheduledDate: futureDate(5) },
      { vehicle: 3, type: 'tyres', status: 'pending', cost: 15000, scheduledDate: futureDate(7) },
      { vehicle: 8, type: 'scheduled_service', status: 'completed', cost: 4500, scheduledDate: daysAgo(8), completedDate: daysAgo(7) },
      { vehicle: 9, type: 'engine_repair', status: 'pending', cost: 35000, scheduledDate: futureDate(2) },
      { vehicle: 10, type: 'oil_change', status: 'completed', cost: 3000, scheduledDate: daysAgo(25), completedDate: daysAgo(24) },
    ]

    const maintenanceRecords: any[] = []
    for (const md of maintenanceData) {
      const mr = await db.maintenanceRecord.create({
        data: {
          vehicleId: vehicles[md.vehicle].id,
          type: md.type,
          description: `${md.type.replace('_', ' ')} for ${vehicles[md.vehicle].vehicleNumber}`,
          cost: md.cost,
          status: md.status,
          scheduledDate: md.scheduledDate,
          completedDate: md.completedDate || null,
          odometer: vehicles[md.vehicle].odometer - Math.round(Math.random() * 2000),
          performedBy: md.status === 'completed' ? 'AutoServ Garage, Gurgaon' : null,
          notes: md.status === 'pending' ? 'Awaiting parts availability' : undefined,
        },
      })
      maintenanceRecords.push(mr)
    }
    results.maintenanceRecords = maintenanceRecords.length

    // ==================== EXPENSES (25) ====================
    const categories = ['fuel', 'repair', 'insurance', 'toll', 'driver_salary', 'vehicle_purchase', 'miscellaneous']
    const expenseDescriptions: Record<string, string[]> = {
      fuel: ['Diesel for Delhi-Mumbai trip', 'CNG refuel for local deliveries', 'Petrol for last mile delivery'],
      repair: ['Engine oil replacement', 'Brake pad replacement', 'Battery replacement', 'Tyre rotation'],
      insurance: ['Annual vehicle insurance - FV-001', 'Comprehensive insurance premium'],
      toll: ['NH-48 toll charges', 'Mumbai-Pune expressway toll', 'Gurgaon-Faridabad toll plaza'],
      driver_salary: ['Monthly salary - Suresh Yadav', 'Monthly salary - Mohan Singh', 'Overtime payment - Ramesh Gupta'],
      vehicle_purchase: ['Down payment for new Ace', 'Accessories for FV-009'],
      miscellaneous: ['Vehicle washing and cleaning', 'GPS device installation', 'Parking charges'],
    }

    for (let i = 0; i < 25; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)]
      const descs = expenseDescriptions[cat]
      const vehicle = vehicles[Math.floor(Math.random() * vehicles.length)]
      const driver = drivers[Math.floor(Math.random() * drivers.length)]
      const trip = trips[Math.floor(Math.random() * trips.length)]
      const dayOffset = Math.random() * 60
      const amounts: Record<string, [number, number]> = {
        fuel: [2000, 15000], repair: [1000, 25000], insurance: [8000, 35000],
        toll: [200, 3000], driver_salary: [15000, 35000], vehicle_purchase: [20000, 200000], miscellaneous: [100, 5000],
      }
      const [minA, maxA] = amounts[cat]
      await db.expense.create({
        data: {
          category: cat,
          amount: Math.round((minA + Math.random() * (maxA - minA)) * 100) / 100,
          description: descs[Math.floor(Math.random() * descs.length)],
          date: new Date(Date.now() - dayOffset * 86400000),
          vehicleId: Math.random() > 0.3 ? vehicle.id : null,
          driverId: (cat === 'driver_salary' || Math.random() > 0.5) ? driver.id : null,
          tripId: (cat === 'fuel' || cat === 'toll') ? trip.id : null,
        },
      })
    }
    results.expenses = 25

    // ==================== VEHICLE HEALTH (14) ====================
    for (const v of vehicles) {
      const engine = 40 + Math.random() * 60
      const battery = 45 + Math.random() * 55
      const tyres = 35 + Math.random() * 65
      const brakes = 40 + Math.random() * 60
      const suspension = 45 + Math.random() * 55
      const overall = (engine + battery + tyres + brakes + suspension) / 5
      await db.vehicleHealth.create({
        data: {
          vehicleId: v.id,
          healthScore: Math.round(engine * 100) / 100,
          engineScore: Math.round(engine * 100) / 100,
          batteryScore: Math.round(battery * 100) / 100,
          tyreScore: Math.round(tyres * 100) / 100,
          brakeScore: Math.round(brakes * 100) / 100,
          suspensionScore: Math.round(suspension * 100) / 100,
          overallScore: Math.round(overall * 100) / 100,
          nextAssessment: new Date(Date.now() + 30 * 86400000),
        },
      })
    }
    results.vehicleHealth = vehicles.length

    // ==================== DRIVER SCORES (20) ====================
    for (let i = 0; i < 20; i++) {
      const driver = drivers[Math.floor(Math.random() * drivers.length)]
      const safety = 40 + Math.random() * 60
      await db.driverScore.create({
        data: {
          driverId: driver.id,
          safetyScore: Math.round(safety * 100) / 100,
          overspeeding: Math.floor(Math.random() * 25),
          harshBraking: Math.floor(Math.random() * 15),
          sharpTurns: Math.floor(Math.random() * 20),
          nightDriving: Math.floor(Math.random() * 40),
          continuousDrive: Math.floor(Math.random() * 8),
          idleTime: Math.round(Math.random() * 15 * 100) / 100,
          period: i % 3 === 0 ? 'daily' : i % 3 === 1 ? 'weekly' : 'monthly',
          periodDate: new Date(Date.now() - Math.random() * 30 * 86400000),
        },
      })
    }
    results.driverScores = 20

    // ==================== AI PREDICTIONS (15) ====================
    const predictionTypes = [
      { type: 'maintenance', targetType: 'vehicle', prediction: JSON.stringify({ component: 'brake_pads', daysUntilFailure: 15, estimatedCost: 8000 }) },
      { type: 'maintenance', targetType: 'vehicle', prediction: JSON.stringify({ component: 'engine_oil', daysUntilFailure: 30, estimatedCost: 3500 }) },
      { type: 'maintenance', targetType: 'vehicle', prediction: JSON.stringify({ component: 'tyres', daysUntilFailure: 45, estimatedCost: 15000 }) },
      { type: 'fuel', targetType: 'vehicle', prediction: JSON.stringify({ predictedConsumption: '12.5 km/l', trend: 'declining', anomaly: true }) },
      { type: 'fuel', targetType: 'vehicle', prediction: JSON.stringify({ predictedConsumption: '8.2 km/l', trend: 'improving', anomaly: false }) },
      { type: 'accident_risk', targetType: 'driver', prediction: JSON.stringify({ riskLevel: 'high', contributingFactors: ['night_driving', 'overspeeding'] }) },
      { type: 'accident_risk', targetType: 'driver', prediction: JSON.stringify({ riskLevel: 'medium', contributingFactors: ['fatigue', 'route_complexity'] }) },
      { type: 'route_optimization', targetType: 'trip', prediction: JSON.stringify({ potentialSavings: '12%', alternativeRoute: 'via NH-48' }) },
      { type: 'route_optimization', targetType: 'trip', prediction: JSON.stringify({ potentialSavings: '8%', alternativeRoute: 'via Mumbai-Pune Expressway' }) },
      { type: 'maintenance', targetType: 'vehicle', prediction: JSON.stringify({ component: 'battery', daysUntilFailure: 60, estimatedCost: 6500 }) },
      { type: 'fuel', targetType: 'vehicle', prediction: JSON.stringify({ predictedConsumption: '10.1 km/l', trend: 'stable', anomaly: false }) },
      { type: 'accident_risk', targetType: 'driver', prediction: JSON.stringify({ riskLevel: 'low', contributingFactors: [] }) },
      { type: 'maintenance', targetType: 'vehicle', prediction: JSON.stringify({ component: 'suspension', daysUntilFailure: 90, estimatedCost: 12000 }) },
      { type: 'route_optimization', targetType: 'trip', prediction: JSON.stringify({ potentialSavings: '18%', alternativeRoute: 'via Yamuna Expressway' }) },
      { type: 'fuel', targetType: 'vehicle', prediction: JSON.stringify({ predictedConsumption: '7.5 km/l', trend: 'declining', anomaly: true }) },
    ]

    for (const p of predictionTypes) {
      const target = p.targetType === 'vehicle'
        ? vehicles[Math.floor(Math.random() * vehicles.length)]
        : drivers[Math.floor(Math.random() * drivers.length)]
      await db.aIPrediction.create({
        data: {
          type: p.type,
          targetType: p.targetType,
          targetId: target.id,
          predictionData: p.prediction,
          confidence: 70 + Math.random() * 28,
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 86400000),
        },
      })
    }
    results.aiPredictions = predictionTypes.length

    // ==================== NOTIFICATIONS (20) ====================
    const notificationTemplates = [
      { title: 'Insurance Expiring Soon', message: 'Vehicle FV-004 insurance expires in 15 days. Renew now to avoid penalties.', type: 'warning', category: 'insurance_expiry' },
      { title: 'License Expiry Alert', message: 'Driver Manoj Tiwari license expires on 15 Jan 2026. Schedule renewal.', type: 'warning', category: 'license_expiry' },
      { title: 'Maintenance Due', message: 'FV-004 engine repair is in progress. Estimated completion in 3 days.', type: 'info', category: 'maintenance_due' },
      { title: 'High Accident Risk Detected', message: 'Driver Deepak Sharma shows high risk score. Consider reassigning routes.', type: 'error', category: 'accident' },
      { title: 'Trip Completed', message: 'Trip TRP-00001 Delhi to Mumbai completed successfully by Suresh Yadav.', type: 'success', category: 'trip_completed' },
      { title: 'Fuel Anomaly Detected', message: 'FV-004 showing 23% higher fuel consumption than average. Check for leaks.', type: 'warning', category: 'fuel_anomaly' },
      { title: 'Pollution Certificate Due', message: 'Vehicle FV-010 pollution certificate expires next month.', type: 'warning', category: 'pollution_cert' },
      { title: 'New Driver Onboarded', message: 'Pradeep Kumar has been added to the fleet. Complete induction training.', type: 'success', category: 'driver_management' },
      { title: 'Route Optimized', message: 'AI suggests alternate route for TRP-00011 saving 12% fuel and time.', type: 'info', category: 'route_optimization' },
      { title: 'Maintenance Completed', message: 'FV-001 oil change completed at AutoServ Garage. Cost: ₹3,500.', type: 'success', category: 'maintenance_completed' },
      { title: 'Driver Rating Updated', message: 'Ramesh Gupta rating updated to 4.9 based on latest trip performance.', type: 'info', category: 'driver_rating' },
      { title: 'Vehicle Health Alert', message: 'FV-004 overall health score dropped to 42%. Immediate attention required.', type: 'error', category: 'vehicle_health' },
      { title: 'Monthly Report Ready', message: 'Fleet performance report for last month is ready for review.', type: 'info', category: 'report' },
      { title: 'Overspeeding Alert', message: 'Driver Arjun Patel recorded 3 overspeeding events today.', type: 'warning', category: 'driver_behavior' },
      { title: 'Battery Replacement Due', message: 'FV-006 battery health at 35%. Schedule replacement.', type: 'warning', category: 'maintenance_due' },
      { title: 'Trip Delayed', message: 'Trip TRP-00018 delayed by 2 hours due to traffic congestion.', type: 'warning', category: 'trip_delayed' },
      { title: 'Fuel Efficiency Improved', message: 'Fleet average fuel efficiency improved by 5% this month.', type: 'success', category: 'fuel_efficiency' },
      { title: 'Toll Charges Spike', message: 'Unusually high toll charges on Mumbai-Pune route. Verify receipts.', type: 'warning', category: 'expense_alert' },
      { title: 'Night Driving Alert', message: 'Vikram Reddy has logged 12 hours of night driving this week.', type: 'info', category: 'driver_behavior' },
      { title: 'Scheduled Service', message: 'FV-008 scheduled service due in 5 days at 50,000 km.', type: 'info', category: 'maintenance_due' },
    ]

    for (let i = 0; i < notificationTemplates.length; i++) {
      const n = notificationTemplates[i]
      const userId = i < 10 ? adminUser.id : managerUser.id
      await db.notification.create({
        data: {
          userId,
          title: n.title,
          message: n.message,
          type: n.type,
          category: n.category,
          isRead: i < 12, // first 12 read
        },
      })
    }
    results.notifications = notificationTemplates.length

    return NextResponse.json({
      success: true,
      message: 'Seed data created successfully',
      results,
      credentials: {
        email: 'admin@fleetvision.com',
        password: 'password123',
      },
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: 'Seed failed', details: String(error) }, { status: 500 })
  }
}

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000)
}

function hoursAgo(hours: number): Date {
  return new Date(Date.now() - hours * 3600000)
}

function futureDate(days: number): Date {
  return new Date(Date.now() + days * 86400000)
}
