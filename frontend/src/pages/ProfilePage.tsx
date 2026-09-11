import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <p className="text-gray-900">{user?.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <p className="text-gray-900">{user?.accountNumber}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
