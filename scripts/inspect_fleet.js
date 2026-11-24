const { PrismaClient } = require('@prisma/client');
const path = require('path');
process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../prisma/db/custom.db')}`;
const prisma = new PrismaClient();

async function main() {
  const vehicles = await prisma.vehicle.findMany({
    include: {
      _count: { select: { trips: true, maintenanceRecords: true, fuelLogs: true } }
    },
    orderBy: { vehicleNumber: 'asc' }
  });
  console.log('Vehicles count:', vehicles.length);
  for (const v of vehicles) {
    console.log(`${v.vehicleNumber} | ${v.id} | ${v.manufacturer} | ${v.model} | ${v.registrationNumber} | ${v.fuelType} | ${v.engineDetails} | ${v.status} | trips: ${v._count.trips}`);
  }
}

main().catch(console.error).finally(() => prisma['$disconnect']());
