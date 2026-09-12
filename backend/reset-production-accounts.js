const { PrismaClient } = require('@prisma/client');

// Use production database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_bSlHIvuh29KL@ep-twilight-sun-za59z8ug-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&connect_timeout=15&sslmode=require'
    }
  }
});

async function resetAccounts() {
  try {
    console.log('🔍 Checking production database...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        accountStatus: true,
        transferRestricted: true,
        transferCount: true,
        role: true,
      },
    });

    console.log('\n📊 Current user statuses:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}): Status=${user.accountStatus}, TransferRestricted=${user.transferRestricted}, TransferCount=${user.transferCount}`);
    });

    // Reset all user accounts
    const result = await prisma.user.updateMany({
      where: {
        role: 'USER' // Only reset user accounts, not admin
      },
      data: {
        accountStatus: 'ACTIVE',
        transferRestricted: false,
        transferCount: 0,
      },
    });

    console.log(`\n✅ Reset ${result.count} user account(s)`);

    // Verify the update
    const updatedUsers = await prisma.user.findMany({
      where: {
        role: 'USER'
      },
      select: {
        email: true,
        accountStatus: true,
        transferRestricted: true,
        transferCount: true,
      },
    });

    console.log('\n✨ Updated user accounts:');
    updatedUsers.forEach(user => {
      console.log(`- ${user.email}: Status=${user.accountStatus}, TransferRestricted=${user.transferRestricted}, TransferCount=${user.transferCount}`);
    });

    console.log('\n🎉 All user accounts have been reset and are ready to use!');

  } catch (error) {
    console.error('❌ Error resetting accounts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAccounts();
