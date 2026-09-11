import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all active currencies
router.get('/', async (req, res) => {
  try {
    const currencies = await prisma.currency.findMany({
      where: { isActive: true },
      orderBy: { currencyCode: 'asc' },
    });

    res.json({ data: currencies });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currencies' });
  }
});

// Get exchange rate
router.get('/convert', async (req, res) => {
  const { from = 'USD', to = 'USD', amount = 1 } = req.query;

  try {
    const [fromCurrency, toCurrency] = await Promise.all([
      prisma.currency.findUnique({ where: { currencyCode: from as string } }),
      prisma.currency.findUnique({ where: { currencyCode: to as string } }),
    ]);

    if (!fromCurrency || !toCurrency) {
      return res.status(404).json({ error: 'Currency not found' });
    }

    const convertedAmount =
      (Number(amount) / Number(fromCurrency.exchangeRate)) *
      Number(toCurrency.exchangeRate);

    res.json({
      from: fromCurrency.currencyCode,
      to: toCurrency.currencyCode,
      amount: Number(amount),
      convertedAmount,
      rate: Number(toCurrency.exchangeRate) / Number(fromCurrency.exchangeRate),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to convert currency' });
  }
});

export default router;
