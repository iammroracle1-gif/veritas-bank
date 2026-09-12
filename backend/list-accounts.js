const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.production' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function listAccounts() {
  try {
    console.log('Fetching all user accounts...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        accountNumber: true,
        role: true,
      },
      orderBy: { createdAt: 'asc' }
    });

    console.log(`Found ${users.length} users:\n`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Account: ${user.accountNumber}`);
      console.log(`   Role: ${user.role}`);
      console.log('');
    });

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

listAccounts();
