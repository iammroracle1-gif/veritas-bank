import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'

export default function DepositPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="p-6 md:p-8 max-w-2xl mx-auto pt-24 md:pt-28">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-6 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Deposit Funds</h1>
            
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">
                Contact admin to deposit funds into your account
              </p>
              <p className="text-sm text-gray-500">
                For security reasons, deposits must be processed by an administrator
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
