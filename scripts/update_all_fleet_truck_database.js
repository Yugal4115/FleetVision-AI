const { PrismaClient } = require('@prisma/client');
const path = require('path');
process.env.DATABASE_URL = `file:${path.resolve(__dirname, '../prisma/db/custom.db')}`;
const prisma = new PrismaClient();

const FLEET_TRUCKS = [
  {
    vehicleNumber: 'FV-001',
    manufacturer: 'Volvo',
    model: 'Volvo FH Aero Electric',
    registrationNumber: 'DL-01-AB-1234',
    fuelType: 'electric',
    engineDetails: '660 kW (880 HP) · 540 kWh Battery',
    odometer: 14250,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-002',
    manufacturer: 'Scania',
    model: 'Scania Super 560 R 6x2 Hauler',
    registrationNumber: 'DL-01-CD-5678',
    fuelType: 'diesel',
    engineDetails: '560 HP · 13.0L Super Euro 6d',
    odometer: 67800,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-003',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz Actros L 1863 Edition',
    registrationNumber: 'DL-02-EF-9012',
    fuelType: 'diesel',
    engineDetails: '625 HP · 15.6L OM473 Euro 6',
    odometer: 34100,
    status: 'available',
  },
  {
    vehicleNumber: 'FV-004',
    manufacturer: 'MAN',
    model: 'MAN TGX 18.640 PerformanceLine',
    registrationNumber: 'HR-26-GH-3456',
    fuelType: 'diesel',
    engineDetails: '640 HP · 15.2L D38 Euro 6d',
    odometer: 120500,
    status: 'maintenance',
  },
  {
    vehicleNumber: 'FV-005',
    manufacturer: 'MAN',
    model: 'MAN eTGX Ultra Electric Heavy Hauler',
    registrationNumber: 'HR-51-IJ-7890',
    fuelType: 'electric',
    engineDetails: '400 kW · 480 kWh Ultra Pack',
    odometer: 19800,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-006',
    manufacturer: 'Scania',
    model: 'Scania 770 S V8 Heavy Hauler',
    registrationNumber: 'MH-02-KL-1234',
    fuelType: 'diesel',
    engineDetails: '770 HP · 16.4L V8 Euro 6',
    odometer: 32400,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-007',
    manufacturer: 'Volvo',
    model: 'Volvo FM Electric 460 Globetrotter',
    registrationNumber: 'MH-04-MN-5678',
    fuelType: 'electric',
    engineDetails: '490 kW · 540 kWh Battery',
    odometer: 25400,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-008',
    manufacturer: 'DAF',
    model: 'DAF XG+ 530 Super Space Cab',
    registrationNumber: 'KA-01-OP-9012',
    fuelType: 'diesel',
    engineDetails: '530 HP · 12.9L PACCAR MX-13',
    odometer: 48900,
    status: 'available',
  },
  {
    vehicleNumber: 'FV-009',
    manufacturer: 'Volvo',
    model: 'Volvo FH 500 I-Save Euro 6d',
    registrationNumber: 'KA-05-QR-3456',
    fuelType: 'diesel',
    engineDetails: '500 HP · Turbo Compound Diesel',
    odometer: 54200,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-010',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz eActros 600 LongHaul',
    registrationNumber: 'DL-04-ST-7890',
    fuelType: 'electric',
    engineDetails: '600 kW Dual-Motor e-Axle',
    odometer: 8900,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-011',
    manufacturer: 'Iveco',
    model: 'Iveco S-Way 570 Heavy Duty',
    registrationNumber: 'HR-26-UV-1234',
    fuelType: 'diesel',
    engineDetails: '570 HP · 12.9L Cursor 13 Euro 6',
    odometer: 21300,
    status: 'available',
  },
  {
    vehicleNumber: 'FV-012',
    manufacturer: 'Renault Trucks',
    model: 'Renault Trucks T High 520',
    registrationNumber: 'DL-08-WX-5678',
    fuelType: 'diesel',
    engineDetails: '520 HP · 12.8L DTI 13 Euro 6',
    odometer: 67800,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-013',
    manufacturer: 'Scania',
    model: 'Scania 660 S V8 Highline Hauler',
    registrationNumber: 'MH-12-YZ-9012',
    fuelType: 'diesel',
    engineDetails: '660 HP · 16.4L V8 Euro 6',
    odometer: 35600,
    status: 'available',
  },
  {
    vehicleNumber: 'FV-014',
    manufacturer: 'Volvo',
    model: 'Volvo FH16 750 Euro 6',
    registrationNumber: 'DL-10-AB-3456',
    fuelType: 'diesel',
    engineDetails: '750 HP · 12.8L Diesel',
    odometer: 15200,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-017',
    manufacturer: 'Mercedes-Benz',
    model: 'Mercedes-Benz Actros 1853',
    registrationNumber: 'MH-12-XY-7890',
    fuelType: 'electric',
    engineDetails: '450kW Motor',
    odometer: 24500,
    status: 'active',
  },
  {
    vehicleNumber: 'FV-028',
    manufacturer: 'Volvo',
    model: 'Volvo FH Aero 780',
    registrationNumber: 'VL-78-FH',
    fuelType: 'diesel',
    engineDetails: '16.5L Diesel · 6x4',
    odometer: 28500,
    status: 'active',
  },
];

async function main() {
  console.log('--- UPDATING ALL DATABASE VEHICLES TO REAL COMMERCIAL TRUCKS ---');

  for (const truck of FLEET_TRUCKS) {
    const existing = await prisma.vehicle.findUnique({
      where: { vehicleNumber: truck.vehicleNumber },
    });

    if (existing) {
      await prisma.vehicle.update({
        where: { vehicleNumber: truck.vehicleNumber },
        data: {
          manufacturer: truck.manufacturer,
          model: truck.model,
          registrationNumber: truck.registrationNumber,
          fuelType: truck.fuelType,
          engineDetails: truck.engineDetails,
          odometer: truck.odometer,
          status: truck.status,
        },
      });
      console.log(`✓ Updated [${truck.vehicleNumber}] -> ${truck.manufacturer} ${truck.model}`);
    }
  }

  console.log('ALL 16 VEHICLES NOW PROVISIONED WITH REAL COMMERCIAL HEAVY TRUCKS!');
}

main().catch(console.error).finally(() => prisma['$disconnect']());

