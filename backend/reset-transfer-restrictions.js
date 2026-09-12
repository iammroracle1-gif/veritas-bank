const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.production' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function resetTransferRestrictions() {
  try {
    console.log('Resetting all user transfer restrictions...');

    // Update all users
    const result = await prisma.user.updateMany({
      where: {
        role: 'USER',
      },
      data: {
        transferRestricted: false,
        transferCount: 0,
      },
    });

    console.log(`✅ Reset ${result.count} users`);
    console.log('✅ All users can now transfer freely');
    console.log('✅ Admin can restrict individual users via the admin panel');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

resetTransferRestrictions();
