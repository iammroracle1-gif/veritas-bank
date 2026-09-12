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

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => transactionApi.getTransactions(),
  })

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="p-6 md:p-8 max-w-4xl mx-auto pt-24 md:pt-28">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Transaction History</h1>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading transactions...</p>
              </div>
            ) : transactions?.data && transactions.data.length > 0 ? (
              <div className="space-y-1">
                {transactions.data.map((transaction: any) => (
                  <div key={transaction.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-gray-900 font-semibold text-base">{transaction.description}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">{transaction.reference}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.currency === 'USD' ? '$' : ''}{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-2">Your transactions will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
