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

  // Parse the path - Vercel rewrites /api/* to /api with query params
  let path = req.url || '/';
  
  // Remove query string
  const queryIndex = path.indexOf('?');
  if (queryIndex !== -1) {
    path = path.substring(0, queryIndex);
  }
  
  // Remove /api prefix if present
  path = path.replace(/^\/api/, '');
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = '/' + path;
  }

  try {
    // Health check
    if (path === '/health' || path === '/' || path === '') {
      return res.status(200).json({ 
        status: 'ok', 
        message: 'Veritas Bank API is running',
        timestamp: new Date().toISOString()
      });
    }

    // Route to appropriate handler based on path
    const pathParts = path.split('/').filter(Boolean);
    const resource = pathParts[0];

    switch (resource) {
      case 'auth':
        const { default: authHandler } = await import('./routes/auth.js');
        return authHandler(req, res, pathParts.slice(1));

      case 'users':
        const { default: userHandler } = await import('./routes/users.js');
        return userHandler(req, res, pathParts.slice(1));

      case 'admin':
        const { default: adminHandler } = await import('./routes/admin.js');
        return adminHandler(req, res, pathParts.slice(1));

      case 'transactions':
        const { default: transactionHandler } = await import('./routes/transactions.js');
        return transactionHandler(req, res, pathParts.slice(1));

      case 'currencies':
        const { default: currencyHandler } = await import('./routes/currencies.js');
        return currencyHandler(req, res, pathParts.slice(1));

      case 'support':
        const { default: supportHandler } = await import('./routes/support.js');
        return supportHandler(req, res, pathParts.slice(1));

      case 'savings':
        const { default: savingsHandler } = await import('./routes/savings.js');
        return savingsHandler(req, res, pathParts.slice(1));

      default:
        return res.status(404).json({ 
          error: 'Endpoint not found',
          availableEndpoints: ['/health', '/auth/*', '/users/*', '/admin/*', '/transactions/*', '/currencies/*', '/support/*', '/savings/*']
        });
    }
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}
