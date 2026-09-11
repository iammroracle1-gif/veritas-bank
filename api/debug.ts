import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Check environment variables
  const envCheck = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    DIRECT_URL: !!process.env.DIRECT_URL,
    JWT_SECRET: !!process.env.JWT_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || 'not set',
    NODE_ENV: process.env.NODE_ENV || 'not set',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'not set',
  };

  // Try to import and test Prisma
  let prismaStatus = 'unknown';
  let prismaError = null;
  
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await prisma.$connect();
    prismaStatus = 'connected';
    await prisma.$disconnect();
  } catch (error: any) {
    prismaStatus = 'failed';
    prismaError = error.message;
  }

  // Test bcrypt
  let bcryptStatus = 'unknown';
  try {
    const bcrypt = await import('bcryptjs');
    await bcrypt.hash('test', 10);
    bcryptStatus = 'working';
  } catch (error: any) {
    bcryptStatus = 'failed: ' + error.message;
  }

  // Test JWT
  let jwtStatus = 'unknown';
  try {
    const jwt = await import('jsonwebtoken');
    if (process.env.JWT_SECRET) {
      jwt.sign({ test: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
      jwtStatus = 'working';
    } else {
      jwtStatus = 'JWT_SECRET not set';
    }
  } catch (error: any) {
    jwtStatus = 'failed: ' + error.message;
  }

  return res.status(200).json({
    message: 'Debug information',
    environment: envCheck,
    prisma: {
      status: prismaStatus,
      error: prismaError,
    },
    bcrypt: bcryptStatus,
    jwt: jwtStatus,
    timestamp: new Date().toISOString(),
  });
}
