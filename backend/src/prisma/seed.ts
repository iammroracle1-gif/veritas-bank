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
      accountNumber: 'VB-ADMIN-001',
      role: 'ADMIN',
      accountStatus: 'ACTIVE',
    },
  });

  await prisma.account.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      balance: 5000.0,
    },
  });

  console.log('✓ Admin user created');

  // Create test user
  const userPassword = await bcrypt.hash('User@123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@veritasbank.com' },
    update: {},
    create: {
      email: 'user@veritasbank.com',
      password: userPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1234567891',
      accountNumber: 'VB-USER-001',
      role: 'USER',
      accountStatus: 'ACTIVE',
    },
  });

  await prisma.account.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      balance: 2500.0,
    },
  });

  console.log('✓ Test user created');

  // Create sample transactions for test user
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        reference: 'TXN-001',
        transactionType: 'DEMO_CREDIT',
        category: 'Salary',
        description: 'Monthly salary deposit',
        amount: 5000,
        currency: 'USD',
        status: 'COMPLETED',
        previousBalance: 0,
        resultingBalance: 5000,
      },
      {
        userId: user.id,
        reference: 'TXN-002',
        transactionType: 'DEMO_DEBIT',
        category: 'Groceries',
        description: 'Supermarket purchase',
        amount: -250,
        currency: 'USD',
        status: 'COMPLETED',
        previousBalance: 5000,
        resultingBalance: 4750,
      },
      {
        userId: user.id,
        reference: 'TXN-003',
        transactionType: 'DEMO_DEBIT',
        category: 'Utilities',
        description: 'Electric bill payment',
        amount: -150,
        currency: 'USD',
        status: 'COMPLETED',
        previousBalance: 4750,
        resultingBalance: 4600,
      },
    ],
  });

  console.log('✓ Sample transactions created');

  // Create sample savings goals
  await prisma.savingsGoal.create({
    data: {
      userId: user.id,
      goalName: 'Emergency Fund',
      targetAmount: 10000,
      currentAmount: 2500,
      deadline: new Date('2025-12-31'),
      status: 'ACTIVE',
    },
  });

  console.log('✓ Sample savings goal created');

  console.log('✅ Database seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
