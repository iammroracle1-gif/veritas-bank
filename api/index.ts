import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.url?.replace('/api', '') || '/';

  try {
    // Health check
    if (path === '/health' || path === '/') {
      return res.status(200).json({ 
        status: 'ok', 
        message: 'Veritas Bank API is running',
        path: req.url,
        method: req.method
      });
    }

    // Route to appropriate handler based on path
    const pathParts = path.split('/').filter(Boolean);
    const resource = pathParts[0];

    switch (resource) {
      case 'auth':
        const { default: authHandler } = await import('./routes/auth');
        return authHandler(req, res, pathParts.slice(1));

      case 'users':
        const { default: userHandler } = await import('./routes/users');
        return userHandler(req, res, pathParts.slice(1));

      case 'admin':
        const { default: adminHandler } = await import('./routes/admin');
        return adminHandler(req, res, pathParts.slice(1));

      case 'transactions':
        const { default: transactionHandler } = await import('./routes/transactions');
        return transactionHandler(req, res, pathParts.slice(1));

      case 'currencies':
        const { default: currencyHandler } = await import('./routes/currencies');
        return currencyHandler(req, res, pathParts.slice(1));

      case 'support':
        const { default: supportHandler } = await import('./routes/support');
        return supportHandler(req, res, pathParts.slice(1));

      case 'savings':
        const { default: savingsHandler } = await import('./routes/savings');
        return savingsHandler(req, res, pathParts.slice(1));

      default:
        return res.status(404).json({ 
          error: 'Not found',
          path: req.url,
          resource
        });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      path: req.url
    });
  }
}
