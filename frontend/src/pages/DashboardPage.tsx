import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { userApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'
import AIChatbot from '../components/AIChatbot'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showSidebar, setShowSidebar] = useState(false)

  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userApi.getDashboard(),
  })

  const balance = dashboardData?.data?.balance || user?.balance || 0
  const accountNumber = user?.accountNumber || 'N/A'

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={handleLogout} />
        
        <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
          <Navbar onMenuClick={() => setShowSidebar(true)} />
          
          <div className="p-6 md:p-8 max-w-5xl mx-auto pt-24 md:pt-28">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Account Number Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">Account Number</p>
                <p className="text-gray-900 text-3xl md:text-4xl font-bold">{accountNumber}</p>
              </div>

              {/* USD Balance Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">USD Balance</p>
                <p className="text-gray-900 text-3xl md:text-4xl font-bold">${balance.toFixed(2)}</p>
              </div>

              {/* EUR Balance Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">EUR Balance</p>
                <p className="text-gray-900 text-3xl md:text-4xl font-bold">€0.00</p>
              </div>

              {/* GBP Balance Card */}
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-3">GBP Balance</p>
                <p className="text-gray-900 text-3xl md:text-4xl font-bold">£0.00</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => navigate('/dashboard/transfer')}
                className="bg-blue-600 hover:bg-blue-700 text-white py-5 px-6 rounded-2xl font-semibold text-base transition-colors shadow-sm"
              >
                Send Money
              </button>
              <button 
                onClick={() => navigate('/dashboard/deposit')}
                className="bg-gray-800 hover:bg-gray-900 text-white py-5 px-6 rounded-2xl font-semibold text-base transition-colors shadow-sm"
              >
                Deposit
              </button>
              <button 
                onClick={() => navigate('/dashboard/withdraw')}
                className="bg-gray-800 hover:bg-gray-900 text-white py-5 px-6 rounded-2xl font-semibold text-base transition-colors shadow-sm"
              >
                Withdraw
              </button>
              <button 
                onClick={() => navigate('/dashboard/transactions')}
                className="bg-gray-800 hover:bg-gray-900 text-white py-5 px-6 rounded-2xl font-semibold text-base transition-colors shadow-sm"
              >
                Transactions
              </button>
            </div>

            {/* Account Details Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Account Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm font-medium">Account Type</span>
                  <span className="text-gray-900 font-semibold">Savings</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm font-medium">Routing Number</span>
                  <span className="text-gray-900 font-semibold">021000021</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-500 text-sm font-medium">Interest Rate</span>
                  <span className="text-gray-900 font-semibold">2.5% APY</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-500 text-sm font-medium">Status</span>
                  <span className="text-green-600 font-semibold">Active</span>
                </div>
              </div>
            </div>

            {/* Recent Activity Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
                <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors">
                  View All
                </button>
              </div>
              <div className="space-y-1">
                {dashboardData?.data?.recentTransactions && dashboardData.data.recentTransactions.length > 0 ? (
                  dashboardData.data.recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-gray-900 font-semibold text-base">{transaction.description}</p>
                        <p className="text-gray-400 text-sm mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <span className={`font-bold text-lg ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount >= 0 ? '+' : ''}{transaction.currency === 'USD' ? '$' : ''}{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-400 text-sm">No recent transactions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <AIChatbot />
    </>
  )
}
