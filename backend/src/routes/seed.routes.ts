import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// Seed endpoint - REMOVE THIS AFTER FIRST USE IN PRODUCTION!
router.post('/initialize', async (req: Request, res: Response) => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@veritasbank.com' }
    });

    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    // Create currencies
    const currencies = [
      { currencyName: 'US Dollar', currencyCode: 'USD', currencySymbol: '$', exchangeRate: 1.0 },
      { currencyName: 'British Pound', currencyCode: 'GBP', currencySymbol: '£', exchangeRate: 0.79 },
      { currencyName: 'Euro', currencyCode: 'EUR', currencySymbol: '€', exchangeRate: 0.92 },
    ];

    for (const currency of currencies) {
      await prisma.currency.upsert({
        where: { currencyCode: currency.currencyCode },
        update: {},
        create: currency,
      });
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.create({
      data: {
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

    await prisma.account.create({
      data: {
        userId: admin.id,
        balance: 0.0,
      },
    });

    res.json({ 
      message: 'Database initialized successfully',
      admin: {
        email: 'admin@veritasbank.com',
        password: 'Admin@123'
      }
    });
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
});

export default router;
