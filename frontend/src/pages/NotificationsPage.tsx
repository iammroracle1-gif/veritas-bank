import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

interface Transaction {
  id: string
  transactionType: string
  category: string
  description: string
  amount: number
  currency: string
  status: string
  createdAt: string
  reference: string
}

interface Notification {
  id: string
  title: string
  message: string
  amount: number
  type: 'credit' | 'debit' | 'info'
  read: boolean
  createdAt: Date
  reference: string
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Fetch transactions
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['notifications-transactions'],
    queryFn: async () => {
      // Get token from localStorage
      let token = localStorage.getItem('token')
      if (!token) {
        const authStorage = localStorage.getItem('veritas-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token || null
        }
      }

      if (!token) {
        throw new Error('No token found')
      }

      const response = await axios.get(`${API_URL}/transactions?limit=50`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.transactions
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  })

  // Convert transactions to notifications
  useEffect(() => {
    if (transactionsData) {
      const notifs: Notification[] = transactionsData.map((txn: Transaction) => {
        const isCredit = txn.amount > 0
        const type: 'credit' | 'debit' | 'info' = isCredit ? 'credit' : 'debit'
        
        let title = ''
        let message = ''

        if (isCredit) {
          if (txn.category === 'Deposit' || txn.transactionType === 'CREDIT') {
            title = 'Money Received'
            message = `You received $${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          } else if (txn.transactionType === 'TRANSFER_IN') {
            title = 'Transfer Received'
            message = `You received $${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${txn.description || 'Transfer'}`
          } else {
            title = 'Credit'
            message = `$${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} credited to your account`
          }
        } else {
          if (txn.transactionType === 'TRANSFER_OUT') {
            title = 'Transfer Sent'
            message = `You sent $${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} - ${txn.description || 'Transfer'}`
          } else if (txn.transactionType === 'WITHDRAWAL') {
            title = 'Withdrawal'
            message = `You withdrew $${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          } else {
            title = 'Debit'
            message = `$${Math.abs(txn.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} debited from your account`
          }
        }

        if (txn.description && txn.description !== message) {
          message = `${message} - ${txn.description}`
        }

        return {
          id: txn.id,
          title,
          message,
          amount: txn.amount,
          type,
          read: false, // Can be tracked separately if needed
          createdAt: new Date(txn.createdAt),
          reference: txn.reference,
        }
      })

      setNotifications(notifs)
    }
  }, [transactionsData])

  const getIconColor = (type: string) => {
    switch (type) {
      case 'credit':
        return 'bg-green-100 text-green-600'
      case 'debit':
        return 'bg-red-100 text-red-600'
      default:
        return 'bg-blue-100 text-blue-600'
    }
  }

  const getIcon = (type: string) => {
    if (type === 'credit') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )
    } else if (type === 'debit') {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      )
    } else {
      return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto pt-20 md:pt-24">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-gray-600 mt-1">{unreadCount} unread</p>
              )}
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold px-4 py-2 rounded-xl hover:bg-blue-50 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading notifications...</p>
            </div>
          ) : notifications.length > 0 ? (
            /* Notifications List */
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                  className={`bg-white rounded-2xl p-4 md:p-5 shadow-sm transition-all cursor-pointer hover:shadow-md ${
                    !notification.read ? 'border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h3 className={`text-base font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          {notification.reference}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl p-12 md:p-16 text-center shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                You're all caught up! We'll notify you when there's something new.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
