const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({ datasources: { db: { url: 'file:./db/custom.db' } } });
const http = require('http');

const sessionCookie = 'fleetvision_session=9793a89faefbab25c05ee41489acbb82a087291c915d0203d24d06945a54f84b';

async function testVehicles() {
  const list = await prisma.vehicle.findMany({ take: 6 });
  console.log('Testing ' + list.length + ' vehicle detail pages:');
  for (const v of list) {
    await new Promise(res => {
      http.get('http://localhost:3000/vehicles/' + v.id, { headers: { 'Cookie': sessionCookie } }, r => {
        console.log('Vehicle ' + v.id + ' (' + v.make + ' ' + v.model + '): Status ' + r.statusCode);
        res();
      });
    });
  }
}

testVehicles().then(() => prisma.$disconnect()).catch(err => {
  console.error(err);
  prisma.$disconnect();
});
