import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Get all support requests for current user
router.get('/', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const supportRequests = await prisma.supportRequest.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ supportRequests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch support requests' });
  }
});

// Create support request
router.post('/', authenticateToken, async (req: AuthRequest, res) => {
  const { subject, message } = req.body;

  try {
    const supportRequest = await prisma.supportRequest.create({
      data: {
        userId: req.user!.id,
        subject,
        message,
      },
    });

    res.status(201).json({
      message: 'Support request created successfully',
      supportRequest,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create support request' });
  }
});

export default router;
