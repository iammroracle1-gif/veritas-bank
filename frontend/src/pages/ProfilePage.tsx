import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import { userApi } from '../services/api'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)

  // Fetch fresh account data
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => userApi.getDashboard(),
  })

  const accountNumber = dashboardData?.data?.data?.accountNumber || user?.accountNumber || 'N/A'

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 min-h-screen max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>

          {/* Profile Card - Clean iOS Style */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-3">
            {/* Avatar Section */}
            <div className="px-6 py-8 text-center border-b border-gray-100">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-gray-500 mt-1">{user?.email}</p>
            </div>

            {/* Account Details */}
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => copyToClipboard(accountNumber, 'Account number')}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-500 mb-1.5">Account Number</p>
                  <p className="text-base font-mono font-bold text-gray-900">{accountNumber}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>

              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Full Name</p>
                <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Email Address</p>
                <p className="text-base text-gray-900">{user?.email}</p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Account Type</p>
                <p className="text-base font-semibold text-gray-900">Savings</p>
              </div>

              <div className="px-6 py-4">
                <p className="text-xs font-medium text-gray-500 mb-1.5">Status</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-base font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2.5">
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="w-full px-5 py-4 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Settings</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/dashboard/support')}
              className="w-full px-5 py-4 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-gray-900">Support</span>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                logout()
                navigate('/login')
                toast.success('Signed out successfully')
              }}
              className="w-full px-5 py-4 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-red-50 active:bg-red-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className="text-sm font-semibold text-red-600">Sign Out</span>
              </div>
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
