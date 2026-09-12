import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import { transactionApi } from '../services/api'

export default function TransactionsPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)

  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionApi.getTransactions(),
  })

  const transactions = transactionsData?.data?.transactions || transactionsData?.data || []

  const formatNumber = (num: number) => {
    return Math.abs(num).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 min-h-screen max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Transactions</h1>
            <p className="text-sm text-gray-500 mt-1">Your transaction history</p>
          </div>
          
          {isLoading ? (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-sm text-gray-600">Loading transactions...</p>
            </div>
          ) : transactions.length > 0 ? (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {transactions.map((transaction: any, index: number) => {
                const isCredit = transaction.amount > 0
                return (
                  <div 
                    key={transaction.id} 
                    className={`px-4 py-4 flex items-center gap-3 ${index !== transactions.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCredit ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <svg className={`w-5 h-5 ${isCredit ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isCredit ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        )}
                      </svg>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {transaction.category || transaction.transactionType}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                        {isCredit ? '+' : '-'}${formatNumber(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{transaction.reference}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-900 mb-1">No transactions yet</p>
              <p className="text-xs text-gray-500">Your transactions will appear here</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
