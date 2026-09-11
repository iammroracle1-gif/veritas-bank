import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get all savings goals for current user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ savingsGoals });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch savings goals' });
  }
});

// Create savings goal
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { goalName, targetAmount, deadline } = req.body;

  try {
    const savingsGoal = await prisma.savingsGoal.create({
      data: {
        userId: req.user!.id,
        goalName,
        targetAmount: Number(targetAmount),
        deadline: deadline ? new Date(deadline) : null,
      },
    });

    res.status(201).json({
      message: 'Savings goal created successfully',
      savingsGoal,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
});

// Update savings goal progress
router.patch('/:id/progress', authenticateToken, async (req: AuthRequest, res) => {
  const { currentAmount } = req.body;

  try {
    const goal = await prisma.savingsGoal.findFirst({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    if (!goal) {
      return res.status(404).json({ error: 'Savings goal not found' });
    }

    const updatedGoal = await prisma.savingsGoal.update({
      where: { id: req.params.id },
      data: {
        currentAmount: Number(currentAmount),
        status:
          Number(currentAmount) >= Number(goal.targetAmount)
            ? 'ACHIEVED'
            : 'ACTIVE',
      },
    });

    res.json({
      message: 'Savings goal updated successfully',
      savingsGoal: updatedGoal,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update savings goal' });
  }
});

// Delete savings goal
router.delete('/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await prisma.savingsGoal.delete({
      where: {
        id: req.params.id,
        userId: req.user!.id,
      },
    });

    res.json({ message: 'Savings goal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete savings goal' });
  }
});

export default router;
