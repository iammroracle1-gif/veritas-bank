import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';
import { hashPassword, comparePassword } from '../utils/helpers';

const router = Router();
const prisma = new PrismaClient();

// Check if user has a PIN
router.get('/check', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { transactionPin: true },
    });

    res.json({ hasPin: !!user?.transactionPin });
  } catch (error) {
    console.error('Check PIN error:', error);
    res.status(500).json({ error: 'Failed to check PIN status' });
  }
});

// Create PIN (first time setup)
router.post('/create', authenticateToken, async (req: AuthRequest, res) => {
  const { pin } = req.body;

  try {
    // Validate PIN format (4 digits)
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'PIN must be 4 digits' });
    }

    // Check if user already has a PIN
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { transactionPin: true },
    });

    if (user?.transactionPin) {
      return res.status(400).json({ error: 'PIN already exists. Use change PIN instead.' });
    }

    // Hash and save PIN
    const hashedPin = await hashPassword(pin);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { transactionPin: hashedPin },
    });

    res.json({ message: 'PIN created successfully' });
  } catch (error) {
    console.error('Create PIN error:', error);
    res.status(500).json({ error: 'Failed to create PIN' });
  }
});

// Verify PIN
router.post('/verify', authenticateToken, async (req: AuthRequest, res) => {
  const { pin } = req.body;

  try {
    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ error: 'Invalid PIN format' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { transactionPin: true },
    });

    if (!user?.transactionPin) {
      return res.status(400).json({ error: 'PIN not set' });
    }

    const isValid = await comparePassword(pin, user.transactionPin);

    if (!isValid) {
      return res.status(401).json({ error: 'Incorrect PIN' });
    }

    res.json({ message: 'PIN verified successfully', verified: true });
  } catch (error) {
    console.error('Verify PIN error:', error);
    res.status(500).json({ error: 'Failed to verify PIN' });
  }
});

// Change PIN (requires old PIN)
router.post('/change', authenticateToken, async (req: AuthRequest, res) => {
  const { oldPin, newPin } = req.body;

  try {
    // Validate format
    if (!oldPin || !/^\d{4}$/.test(oldPin)) {
      return res.status(400).json({ error: 'Invalid old PIN format' });
    }
    if (!newPin || !/^\d{4}$/.test(newPin)) {
      return res.status(400).json({ error: 'New PIN must be 4 digits' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { transactionPin: true },
    });

    if (!user?.transactionPin) {
      return res.status(400).json({ error: 'No PIN set. Please create a PIN first.' });
    }

    // Verify old PIN
    const isValidOldPin = await comparePassword(oldPin, user.transactionPin);
    if (!isValidOldPin) {
      return res.status(401).json({ error: 'Incorrect old PIN' });
    }

    // Hash and update to new PIN
    const hashedNewPin = await hashPassword(newPin);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { transactionPin: hashedNewPin },
    });

    res.json({ message: 'PIN changed successfully' });
  } catch (error) {
    console.error('Change PIN error:', error);
    res.status(500).json({ error: 'Failed to change PIN' });
  }
});

export default router;
