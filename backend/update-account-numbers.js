const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.production' });

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
});

async function updateAccountNumbers() {
  try {
    console.log('Updating all account numbers to 10 digits...');

    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        accountNumber: true,
        firstName: true,
        lastName: true,
      },
    });

    console.log(`Found ${users.length} users to update`);

    for (const user of users) {
      // Generate new 10-digit account number
      const year = '2025';
      const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      const newAccountNumber = `${year}${random}`;

      await prisma.user.update({
        where: { id: user.id },
        data: { accountNumber: newAccountNumber },
      });

      console.log(`✅ Updated ${user.firstName} ${user.lastName}: ${user.accountNumber} → ${newAccountNumber}`);
    }

    console.log('\n✅ All account numbers updated to 10 digits!');
    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateAccountNumbers();
