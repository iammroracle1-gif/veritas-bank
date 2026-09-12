import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateTransactionReference } from '../utils/helpers';

const router = Router();
const prisma = new PrismaClient();

// Get all transactions for current user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { page = '1', limit = '10', type } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = { userId: req.user!.id };
    if (type) {
      where.transactionType = type;
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      transactions,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Lookup account by account number
router.get('/lookup-account/:accountNumber', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const accountNumber = req.params.accountNumber.trim();
    
    console.log('Looking up account:', accountNumber);
    
    const user = await prisma.user.findFirst({
      where: { 
        accountNumber: accountNumber,
        role: 'USER' // Only lookup user accounts, not admin
      },
      select: {
        firstName: true,
        lastName: true,
        accountNumber: true,
      },
    });

    console.log('Found user:', user);

    if (!user) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      accountNumber: user.accountNumber,
    });
  } catch (error) {
    console.error('Lookup error:', error);
    res.status(500).json({ error: 'Failed to lookup account' });
  }
});

// Create demo transaction
router.post('/demo', authenticateToken, async (req: AuthRequest, res) => {
  const { amount, type, category, description } = req.body;

  try {
    const account = await prisma.account.findUnique({
      where: { userId: req.user!.id },
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const isCredit = type === 'DEMO_CREDIT';
    const transactionAmount = isCredit ? Math.abs(amount) : -Math.abs(amount);
    const newBalance = Number(account.balance) + transactionAmount;

    if (newBalance < 0) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        reference: generateTransactionReference(),
        transactionType: type,
        category: category || 'General',
        description: description || '',
        amount: transactionAmount,
        currency: 'USD',
        status: 'COMPLETED',
        previousBalance: account.balance,
        resultingBalance: newBalance,
      },
    });

    await prisma.account.update({
      where: { userId: req.user!.id },
      data: { balance: newBalance },
    });

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction,
      newBalance,
    });
  } catch (error) {
    console.error('Transaction error:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
});

// Transfer money to another user
router.post('/transfer', authenticateToken, async (req: AuthRequest, res) => {
  const { recipientAccountNumber, amount, description } = req.body;

  try {
    // Validate amount
    const transferAmount = parseFloat(amount);
    if (isNaN(transferAmount) || transferAmount <= 0) {
      return res.status(400).json({ error: 'Invalid transfer amount' });
    }

    // Get sender account and user info
    const sender = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: { account: true },
    });

    if (!sender || !sender.account) {
      return res.status(404).json({ error: 'Sender account not found' });
    }

    // Check if transfers are restricted by admin
    if (sender.transferRestricted) {
      return res.status(403).json({ 
        error: 'TRANSFER_LIMIT_REACHED',
        message: 'Your transfers have been restricted. Please contact support.'
      });
    }

    // Check balance
    if (sender.account.balance < transferAmount) {
      return res.status(400).json({ error: 'Insufficient funds' });
    }

    // Get recipient
    const recipient = await prisma.user.findUnique({
      where: { accountNumber: recipientAccountNumber },
      include: { account: true },
    });

    if (!recipient || !recipient.account) {
      return res.status(404).json({ error: 'Recipient account not found' });
    }

    if (recipient.id === sender.id) {
      return res.status(400).json({ error: 'Cannot transfer to your own account' });
    }

    // Perform transfer in a transaction
    const [debitTransaction, creditTransaction] = await prisma.$transaction(async (tx) => {
      // Debit sender
      const senderNewBalance = Number(sender.account!.balance) - transferAmount;
      await tx.account.update({
        where: { userId: sender.id },
        data: { balance: senderNewBalance },
      });

      // Increment sender's transfer count
      await tx.user.update({
        where: { id: sender.id },
        data: { transferCount: sender.transferCount + 1 },
      });

      const debitTx = await tx.transaction.create({
        data: {
          userId: sender.id,
          reference: generateTransactionReference(),
          transactionType: 'TRANSFER_OUT',
          category: 'Transfer',
          description: description || `Transfer to ${recipient.firstName} ${recipient.lastName}`,
          amount: -transferAmount,
          currency: 'USD',
          status: 'COMPLETED',
          previousBalance: sender.account!.balance,
          resultingBalance: senderNewBalance,
        },
      });

      // Credit recipient
      const recipientNewBalance = Number(recipient.account!.balance) + transferAmount;
      await tx.account.update({
        where: { userId: recipient.id },
        data: { balance: recipientNewBalance },
      });

      const creditTx = await tx.transaction.create({
        data: {
          userId: recipient.id,
          reference: generateTransactionReference(),
          transactionType: 'TRANSFER_IN',
          category: 'Transfer',
          description: description || `Transfer from ${sender.firstName} ${sender.lastName}`,
          amount: transferAmount,
          currency: 'USD',
          status: 'COMPLETED',
          previousBalance: recipient.account!.balance,
          resultingBalance: recipientNewBalance,
        },
      });

      return [debitTx, creditTx];
    });

    res.status(201).json({
      message: 'Transfer successful',
      transaction: debitTransaction,
      newBalance: debitTransaction.resultingBalance,
      transferCount: sender.transferCount + 1,
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ error: 'Transfer failed' });
  }
});

// Get transaction by reference
router.get('/:reference', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const transaction = await prisma.transaction.findFirst({
      where: {
        reference: req.params.reference,
        userId: req.user!.id,
      },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ transaction });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

export default router;
