import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const tests: any = {
    basic: 'ok',
    env: {},
    modules: {}
  };

  // Check environment variables
  tests.env = {
    DATABASE_URL: !!process.env.DATABASE_URL ? 'set' : 'missing',
    JWT_SECRET: !!process.env.JWT_SECRET ? 'set' : 'missing',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'not set',
  };

  // Test module imports
  try {
    await import('@vercel/node');
    tests.modules.vercelNode = 'ok';
  } catch (e: any) {
    tests.modules.vercelNode = 'failed: ' + e.message;
  }

  try {
    await import('bcryptjs');
    tests.modules.bcryptjs = 'ok';
  } catch (e: any) {
    tests.modules.bcryptjs = 'failed: ' + e.message;
  }

  try {
    await import('jsonwebtoken');
    tests.modules.jsonwebtoken = 'ok';
  } catch (e: any) {
    tests.modules.jsonwebtoken = 'failed: ' + e.message;
  }

  try {
    const { PrismaClient } = await import('@prisma/client');
    tests.modules.prismaImport = 'ok';
    
    try {
      const prisma = new PrismaClient();
      tests.modules.prismaInstantiate = 'ok';
      
      try {
        await prisma.$connect();
        tests.modules.prismaConnect = 'ok';
        await prisma.$disconnect();
      } catch (e: any) {
        tests.modules.prismaConnect = 'failed: ' + e.message;
      }
    } catch (e: any) {
      tests.modules.prismaInstantiate = 'failed: ' + e.message;
    }
  } catch (e: any) {
    tests.modules.prismaImport = 'failed: ' + e.message;
  }

  return res.status(200).json(tests);
}
