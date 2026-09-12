import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied`)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 min-h-screen max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
            <p className="text-sm text-gray-500 mt-1">Your account information</p>
          </div>

          {/* Profile Card - Fintech iOS Style */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
            {/* Avatar Section */}
            <div className="p-8 text-center border-b border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-gray-500 mt-2">{user?.email}</p>
            </div>

            {/* Account Details */}
            <div className="divide-y divide-gray-100">
              <button
                onClick={() => copyToClipboard(user?.accountNumber || '', 'Account number')}
                className="w-full px-6 py-5 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors text-left"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Number</p>
                  <p className="text-lg font-mono font-bold text-gray-900">{user?.accountNumber}</p>
                </div>
                <div className="ml-4 w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              </button>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Full Name</p>
                <p className="text-base font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Email Address</p>
                <p className="text-base font-medium text-gray-900">{user?.email}</p>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Type</p>
                <p className="text-base font-semibold text-gray-900">Savings Account</p>
              </div>

              <div className="px-6 py-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Account Status</p>
                <div className="flex items-center gap-2">
                  <span className="flex h-3 w-3">
                    <span className="animate-ping absolute h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  <span className="text-base font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/settings')}
              className="w-full px-6 py-5 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-gray-900">Settings</p>
                  <p className="text-xs text-gray-500 mt-0.5">Manage account preferences</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/dashboard/support')}
              className="w-full px-6 py-5 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-gray-900">Support</p>
                  <p className="text-xs text-gray-500 mt-0.5">Get help from our team</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => {
                logout()
                navigate('/login')
                toast.success('Signed out successfully')
              }}
              className="w-full px-6 py-5 bg-white rounded-2xl shadow-sm flex items-center justify-between hover:bg-red-50 active:bg-red-100 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-base font-semibold text-red-600 group-hover:text-red-700">Sign Out</p>
                  <p className="text-xs text-red-500 mt-0.5">End your session</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-red-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
