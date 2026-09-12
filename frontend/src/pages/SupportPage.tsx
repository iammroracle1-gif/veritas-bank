import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'

export default function SupportPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
      
      <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
        <Navbar onMenuClick={() => setShowSidebar(true)} />
        
        <div className="p-6 md:p-8 max-w-4xl mx-auto pt-24 md:pt-28">
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Support</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-2">Need Help?</h2>
                <p className="text-gray-600">Contact our support team for assistance</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Email: support@veritasbank.com</p>
                <p className="text-sm text-gray-600 mt-2">Phone: +1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
