const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        accountStatus: true,
        firstName: true,
        lastName: true,
      }
    });

    console.log('=== ALL USERS IN DATABASE ===\n');
    users.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Name: ${user.firstName} ${user.lastName}`);
      console.log(`Role: ${user.role}`);
      console.log(`Status: ${user.accountStatus}`);
      console.log('---\n');
    });

    console.log(`Total users: ${users.length}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
