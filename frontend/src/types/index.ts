export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  accountNumber: string
  role: 'USER' | 'ADMIN'
  accountStatus: 'PENDING' | 'ACTIVE' | 'SUSPENDED'
  preferredCurrency: string
  createdAt: string
  lastLogin?: string
  account?: {
    balance: number
    baseCurrency: string
  }
}

export interface Transaction {
  id: string
  userId: string
  reference: string
  transactionType: 'DEMO_CREDIT' | 'DEMO_DEBIT' | 'SIMULATED_TRANSFER' | 'ADMIN_ADJUSTMENT'
  category?: string
  description?: string
  amount: number
  currency: string
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED'
  previousBalance?: number
  resultingBalance?: number
  createdBy?: string
  createdAt: string
  user?: {
    firstName: string
    lastName: string
    accountNumber: string
  }
}

export interface Currency {
  id: string
  currencyName: string
  currencyCode: string
  currencySymbol: string
  exchangeRate: number
  rateUpdatedAt: string
  isActive: boolean
  createdAt: string
}

export interface SavingsGoal {
  id: string
  userId: string
  goalName: string
  targetAmount: number
  currentAmount: number
  deadline?: string
  status: 'ACTIVE' | 'ACHIEVED' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export interface SupportRequest {
  id: string
  userId: string
  subject: string
  message: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

export interface AuditLog {
  id: string
  adminId: string
  action: string
  targetUserId?: string
  oldValue?: string
  newValue?: string
  reason?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
  admin: {
    firstName: string
    lastName: string
  }
  targetUser?: {
    firstName: string
    lastName: string
  }
}
