const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixAccountStatus() {
  try {
    console.log('Checking user accounts...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountStatus: true,
        role: true,
      },
    });

    console.log('\nCurrent user statuses:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}): ${user.accountStatus}`);
    });

    // Update all users to ACTIVE status
    const result = await prisma.user.updateMany({
      where: {},
      data: {
        accountStatus: 'ACTIVE',
      },
    });

    console.log(`\n✅ Updated ${result.count} user(s) to ACTIVE status`);

    // Verify the update
    const updatedUsers = await prisma.user.findMany({
      select: {
        email: true,
        accountStatus: true,
      },
    });

    console.log('\nUpdated user statuses:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.email}: ${user.accountStatus}`);
    });

  } catch (error) {
    console.error('Error fixing account status:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAccountStatus();
