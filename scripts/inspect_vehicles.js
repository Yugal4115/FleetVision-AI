const { PrismaClient } = require('@prisma/client')
const path = require('path')

process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../prisma/db/custom.db')}`
const prisma = new PrismaClient()

async function main() {
  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      vehicleNumber: true,
      manufacturer: true,
      model: true,
      registrationNumber: true,
    },
    orderBy: { vehicleNumber: 'asc' }
  })
  console.log('Vehicles in prisma/db/custom.db (' + vehicles.length + '):')
  for (const v of vehicles) {
    console.log(`${v.vehicleNumber} | ${v.id} | ${v.manufacturer} | ${v.model} | ${v.registrationNumber}`)
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
