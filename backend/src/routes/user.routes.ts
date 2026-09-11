import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get user profile
router.get('/profile', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { 
        account: {
          select: {
            balance: true,
            baseCurrency: true,
          },
        },
      },
    });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res) => {
  const { firstName, lastName, phone, preferredCurrency } = req.body;

  try {
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: {
        firstName,
        lastName,
        phone,
        preferredCurrency,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        preferredCurrency: true,
      },
    });

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get dashboard stats
router.get('/dashboard', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        account: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        savingsGoals: {
          where: { status: 'ACTIVE' },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const transactionCount = await prisma.transaction.count({
      where: { userId: req.user!.id },
    });

    res.json({
      data: {
        balance: user?.account?.balance || 0,
        recentTransactions: user?.transactions || [],
        savingsGoals: user?.savingsGoals || [],
        transactionCount,
        user: {
          transferRestricted: user.transferRestricted,
          withdrawalRestricted: user.withdrawalRestricted,
          depositRestricted: user.depositRestricted,
          restrictionReason: user.restrictionReason,
        },
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
