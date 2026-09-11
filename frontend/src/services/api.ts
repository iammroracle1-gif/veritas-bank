import axios from 'axios'
import { useAuthStore } from '../stores/authStore'

// Type-safe environment variable access
interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

const API_URL = (import.meta as ImportMeta).env.VITE_API_URL || 'http://localhost:3000/api'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  refreshToken: () => api.post('/auth/refresh'),
}

// User API
export const userApi = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getDashboard: () => api.get('/users/dashboard'),
}

// Transaction API
export const transactionApi = {
  getTransactions: (params?: any) => api.get('/transactions', { params }),
  createDemoTransaction: (data: any) => api.post('/transactions/demo', data),
  getTransactionByReference: (reference: string) =>
    api.get(`/transactions/${reference}`),
}

// Currency API
export const currencyApi = {
  getCurrencies: () => api.get('/currencies'),
  convertCurrency: (from: string, to: string, amount: number) =>
    api.get('/currencies/convert', { params: { from, to, amount } }),
}

// Savings API
export const savingsApi = {
  getSavingsGoals: () => api.get('/savings'),
  createSavingsGoal: (data: any) => api.post('/savings', data),
  updateGoalProgress: (id: string, currentAmount: number) =>
    api.patch(`/savings/${id}/progress`, { currentAmount }),
  deleteGoal: (id: string) => api.delete(`/savings/${id}`),
}

// Support API
export const supportApi = {
  getSupportRequests: () => api.get('/support'),
  createSupportRequest: (data: any) => api.post('/support', data),
}

// Admin API
export const adminApi = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUserDetails: (id: string) => api.get(`/admin/users/${id}`),
  updateUserStatus: (id: string, accountStatus: string) =>
    api.patch(`/admin/users/${id}/status`, { accountStatus }),
  updateUserRestrictions: (id: string, restrictions: {
    transferRestricted?: boolean
    withdrawalRestricted?: boolean
    depositRestricted?: boolean
    restrictionReason?: string
  }) =>
    api.patch(`/admin/users/${id}/restrictions`, restrictions),
  adjustBalance: (id: string, amount: number, reason: string, description?: string) =>
    api.post(`/admin/users/${id}/adjust-balance`, { amount, reason, description }),
  getTransactions: () => api.get('/admin/transactions'),
}
