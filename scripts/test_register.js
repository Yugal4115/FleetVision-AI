const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const email = 'nantha@gmail.com';
    const existing = await prisma.user.findUnique({ where: { email } });
    console.log('Existing user check:', existing);

    const companyName = 'nk';
    let company = await prisma.company.findFirst({ where: { name: companyName } });
    console.log('Existing company:', company);

    if (!company) {
      console.log('Creating company...');
      company = await prisma.company.create({
        data: {
          name: companyName,
          email: email,
        }
      });
      console.log('Created company:', company);
    }
  } catch (err) {
    console.error('Error in registration test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

run();
