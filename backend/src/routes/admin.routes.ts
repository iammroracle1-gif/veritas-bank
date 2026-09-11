import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateTransactionReference } from '../utils/helpers';

const router = Router();
const prisma = new PrismaClient();

// All admin routes require authentication and admin role
router.use(authenticateToken, requireAdmin);

// Get admin dashboard stats
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      pendingUsers,
      totalBalance,
      todayTransactions,
      recentTransactions,
      recentAudits,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'USER' } }),
      prisma.user.count({ where: { role: 'USER', accountStatus: 'ACTIVE' } }),
      prisma.user.count({ where: { role: 'USER', accountStatus: 'PENDING' } }),
      prisma.account.aggregate({ _sum: { balance: true } }),
      prisma.transaction.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              accountNumber: true,
            },
          },
        },
      }),
      prisma.auditLog.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          admin: {
            select: { firstName: true, lastName: true },
          },
          targetUser: {
            select: { firstName: true, lastName: true },
          },
        },
      }),
    ]);

    res.json({
      data: {
        stats: {
          totalUsers,
          activeUsers,
          pendingUsers,
          totalBalance: totalBalance._sum.balance || 0,
          todayTransactions,
        },
        recentTransactions,
        recentAudits,
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
});

// Get all users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { search, status } = req.query;

    const where: any = { role: 'USER' };
    if (search) {
      where.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { accountNumber: { contains: search as string, mode: 'insensitive' } },
      ];
    }
    if (status) {
      where.accountStatus = status;
    }

    const users = await prisma.user.findMany({
      where,
      include: { account: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ data: users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user details
router.get('/users/:id', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        account: true,
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
        savingsGoals: true,
        supportRequests: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ data: user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user status
router.patch('/users/:id/status', async (req: AuthRequest, res) => {
  const { accountStatus } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: { accountStatus },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'ACCOUNT_STATUS_CHANGE',
        targetUserId: req.params.id,
        oldValue: user.accountStatus,
        newValue: accountStatus,
        reason: 'Status changed by admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: 'User status updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// Update user restrictions
router.patch('/users/:id/restrictions', async (req: AuthRequest, res) => {
  const { transferRestricted, withdrawalRestricted, depositRestricted, restrictionReason } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: req.params.id },
      data: {
        transferRestricted: transferRestricted !== undefined ? transferRestricted : user.transferRestricted,
        withdrawalRestricted: withdrawalRestricted !== undefined ? withdrawalRestricted : user.withdrawalRestricted,
        depositRestricted: depositRestricted !== undefined ? depositRestricted : user.depositRestricted,
        restrictionReason: restrictionReason !== undefined ? restrictionReason : user.restrictionReason,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'RESTRICTIONS_UPDATE',
        targetUserId: req.params.id,
        oldValue: JSON.stringify({
          transfer: user.transferRestricted,
          withdrawal: user.withdrawalRestricted,
          deposit: user.depositRestricted,
        }),
        newValue: JSON.stringify({
          transfer: updatedUser.transferRestricted,
          withdrawal: updatedUser.withdrawalRestricted,
          deposit: updatedUser.depositRestricted,
        }),
        reason: restrictionReason || 'Restrictions updated by admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: 'User restrictions updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Restrictions update error:', error);
    res.status(500).json({ error: 'Failed to update restrictions' });
  }
});

// Admin balance adjustment
router.post('/users/:id/adjust-balance', async (req: AuthRequest, res) => {
  const { amount, reason, description } = req.body;

  try {
    const account = await prisma.account.findUnique({
      where: { userId: req.params.id },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const newBalance = Number(account.balance) + Number(amount);

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.params.id,
        reference: generateTransactionReference(),
        transactionType: 'ADMIN_ADJUSTMENT',
        category: 'Admin Adjustment',
        description: description || reason,
        amount: Number(amount),
        currency: 'USD',
        status: 'COMPLETED',
        previousBalance: account.balance,
        resultingBalance: newBalance,
        createdBy: req.user!.id,
      },
    });

    await prisma.account.update({
      where: { userId: req.params.id },
      data: { balance: newBalance },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'BALANCE_ADJUSTMENT',
        targetUserId: req.params.id,
        oldValue: account.balance.toString(),
        newValue: newBalance.toString(),
        reason: reason || 'Manual adjustment',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: 'Balance adjusted successfully',
      transaction,
      newBalance,
    });
  } catch (error) {
    console.error('Balance adjustment error:', error);
    res.status(500).json({ error: 'Failed to adjust balance' });
  }
});

// Get all transactions
router.get('/transactions', async (req: AuthRequest, res) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            accountNumber: true,
          },
        },
      },
    });

    res.json({ data: transactions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

export default router;
