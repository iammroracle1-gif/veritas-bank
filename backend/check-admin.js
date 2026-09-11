const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@veritasbank.com' }
    });

    if (admin) {
      console.log('✅ Admin user found:');
      console.log('Email:', admin.email);
      console.log('Role:', admin.role);
      console.log('Account Status:', admin.accountStatus);
      console.log('Password Hash:', admin.password.substring(0, 20) + '...');
      
      // Test password
      const testPassword = 'Admin@123';
      const isValid = await bcrypt.compare(testPassword, admin.password);
      console.log('\nPassword "Admin@123" matches:', isValid);
    } else {
      console.log('❌ Admin user not found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();
