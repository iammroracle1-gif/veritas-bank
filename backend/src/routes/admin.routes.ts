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

  console.log('Balance adjustment request:', {
    userId: req.params.id,
    amount,
    reason,
    description,
  });

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { account: true },
    });

    if (!user || !user.account) {
      console.error('User or account not found:', req.params.id);
      return res.status(404).json({ error: 'User or account not found' });
    }

    console.log('Current balance:', user.account.balance);
    const newBalance = Number(user.account.balance) + Number(amount);
    console.log('New balance will be:', newBalance);

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Create transaction record
      const transaction = await tx.transaction.create({
        data: {
          userId: req.params.id,
          reference: generateTransactionReference(),
          transactionType: 'CREDIT',
          category: 'Deposit',
          description: description || 'Account funding',
          amount: Number(amount),
          currency: 'USD',
          status: 'COMPLETED',
          previousBalance: user.account!.balance,
          resultingBalance: newBalance,
          createdBy: req.user!.id,
        },
      });

      // Update account balance
      const updatedAccount = await tx.account.update({
        where: { userId: req.params.id },
        data: { balance: newBalance },
      });

      console.log('Balance updated successfully:', updatedAccount.balance);
      return { transaction, updatedAccount };
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'BALANCE_ADJUSTMENT',
        targetUserId: req.params.id,
        oldValue: user.account.balance.toString(),
        newValue: newBalance.toString(),
        reason: reason || 'Manual adjustment',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      success: true,
      message: 'Balance adjusted successfully',
      transaction: result.transaction,
      newBalance: result.updatedAccount.balance,
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

// Cancel a transaction (admin only)
router.post('/transactions/:id/cancel', async (req: AuthRequest, res) => {
  const { reason } = req.body;

  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          include: { account: true },
        },
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status === 'CANCELLED') {
      return res.status(400).json({ error: 'Transaction already cancelled' });
    }

    // Reverse the transaction
    const reversalAmount = -transaction.amount;
    const newBalance = Number(transaction.user.account!.balance) + reversalAmount;

    await prisma.$transaction(async (tx) => {
      // Update original transaction status
      await tx.transaction.update({
        where: { id: req.params.id },
        data: { status: 'CANCELLED' },
      });

      // Create reversal transaction
      await tx.transaction.create({
        data: {
          userId: transaction.userId,
          reference: generateTransactionReference(),
          transactionType: 'REVERSAL',
          category: 'Admin Action',
          description: `Reversal: ${transaction.description || 'Transaction cancelled'}`,
          amount: reversalAmount,
          currency: transaction.currency,
          status: 'COMPLETED',
          previousBalance: transaction.user.account!.balance,
          resultingBalance: newBalance,
          createdBy: req.user!.id,
        },
      });

      // Update account balance
      await tx.account.update({
        where: { userId: transaction.userId },
        data: { balance: newBalance },
      });

      // If it was a transfer, decrement transfer count
      if (transaction.transactionType === 'TRANSFER_OUT') {
        await tx.user.update({
          where: { id: transaction.userId },
          data: { 
            transferCount: {
              decrement: 1
            }
          },
        });
      }
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'TRANSACTION_CANCELLED',
        targetUserId: transaction.userId,
        oldValue: transaction.status,
        newValue: 'CANCELLED',
        reason: reason || 'Transaction cancelled by admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: 'Transaction cancelled successfully',
      newBalance,
    });
  } catch (error) {
    console.error('Transaction cancellation error:', error);
    res.status(500).json({ error: 'Failed to cancel transaction' });
  }
});

// Toggle transfer restriction
router.patch('/users/:id/restrict-transfer', async (req: AuthRequest, res) => {
  const { restricted } = req.body;

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
        transferRestricted: restricted,
      },
    });

    // Log audit
    await prisma.auditLog.create({
      data: {
        adminId: req.user!.id,
        action: 'TRANSFER_RESTRICTION_CHANGE',
        targetUserId: req.params.id,
        oldValue: user.transferRestricted.toString(),
        newValue: restricted.toString(),
        reason: restricted ? 'Transfers restricted by admin' : 'Transfers enabled by admin',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
      },
    });

    res.json({
      message: restricted ? 'Transfers restricted' : 'Transfers enabled',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Restrict transfer error:', error);
    res.status(500).json({ error: 'Failed to update transfer restriction' });
  }
});

export default router;
