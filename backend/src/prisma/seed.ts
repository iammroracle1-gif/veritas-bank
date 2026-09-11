import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create currencies
  const currencies = [
    { currencyName: 'US Dollar', currencyCode: 'USD', currencySymbol: '$', exchangeRate: 1.0 },
    { currencyName: 'British Pound', currencyCode: 'GBP', currencySymbol: '£', exchangeRate: 0.79 },
    { currencyName: 'Euro', currencyCode: 'EUR', currencySymbol: '€', exchangeRate: 0.92 },
    { currencyName: 'Canadian Dollar', currencyCode: 'CAD', currencySymbol: 'C$', exchangeRate: 1.35 },
    { currencyName: 'Nigerian Naira', currencyCode: 'NGN', currencySymbol: '₦', exchangeRate: 1580.0 },
    { currencyName: 'Ghanaian Cedi', currencyCode: 'GHS', currencySymbol: 'GH₵', exchangeRate: 15.5 },
    { currencyName: 'South African Rand', currencyCode: 'ZAR', currencySymbol: 'R', exchangeRate: 18.75 },
    { currencyName: 'Japanese Yen', currencyCode: 'JPY', currencySymbol: '¥', exchangeRate: 149.5 },
    { currencyName: 'Australian Dollar', currencyCode: 'AUD', currencySymbol: 'A$', exchangeRate: 1.55 },
    { currencyName: 'Indian Rupee', currencyCode: 'INR', currencySymbol: '₹', exchangeRate: 83.25 },
  ];

  for (const currency of currencies) {
    await prisma.currency.upsert({
      where: { currencyCode: currency.currencyCode },
      update: {},
      create: currency,
    });
  }

  console.log('✓ Currencies created');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@veritasbank.com' },
    update: {},
    create: {
      email: 'admin@veritasbank.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      accountNumber: '202500000001',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  });

  await prisma.account.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 0.0,
    },
  });

  console.log('✓ Admin user created: admin@veritasbank.com / Admin@123');
  console.log('✅ Database seeded successfully - All users will start with $0 balance');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
