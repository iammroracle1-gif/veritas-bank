import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
  pathParts: string[]
) {
  return res.status(200).json({ 
    message: 'Admin endpoint - Coming soon',
    path: pathParts
  });
}
