const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./db/custom.db' } } });

async function check() {
  const vehicles = await prisma.vehicle.groupBy({ by: ['companyId'], _count: { id: true } });
  console.log('Vehicles by companyId:', vehicles);
  const drivers = await prisma.driver.groupBy({ by: ['companyId'], _count: { id: true } });
  console.log('Drivers by companyId:', drivers);

  // Check Trip, FuelLog, MaintenanceRecord schemas
  // Does Trip have companyId column?
  const trip = await prisma.trip.findFirst();
  console.log('Trip keys:', Object.keys(trip));

  // Does FuelLog have companyId column?
  const fuel = await prisma.fuelLog.findFirst();
  console.log('FuelLog keys:', Object.keys(fuel));

  // Does MaintenanceRecord have companyId column?
  const maint = await prisma.maintenanceRecord.findFirst();
  console.log('MaintenanceRecord keys:', Object.keys(maint));

  // Does VehicleHealth have companyId column?
  const health = await prisma.vehicleHealth.findFirst();
  console.log('VehicleHealth keys:', Object.keys(health));
}

check().then(() => prisma.$disconnect()).catch(e => { console.error(e); prisma.$disconnect(); });
