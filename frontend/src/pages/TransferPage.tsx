import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import TransferRestrictionModal from '../components/TransferRestrictionModal'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com'

export default function TransferPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showRestrictionModal, setShowRestrictionModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    if (!formData.recipient || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        `${API_URL}/api/transactions/transfer`,
        {
          recipientAccountNumber: formData.recipient,
          amount: amount,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      toast.success('Transfer successful!')
      
      // Check if transfer count reached limit
      if (response.data.transferCount >= 2) {
        setTimeout(() => {
          toast('You have reached your transfer limit', { icon: '⚠️' })
        }, 1000)
      }

      // Reset form
      setFormData({
        recipient: '',
        amount: '',
        description: '',
      })

      // Navigate to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error: any) {
      console.error('Transfer error:', error)
      
      // Check if it's a transfer limit error
      if (error.response?.data?.error === 'TRANSFER_LIMIT_REACHED') {
        setShowRestrictionModal(true)
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Transfer failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
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
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Send Money</h1>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter account number"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="What's this for?"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-lg font-semibold transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Send Money'}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Transfer Restriction Modal */}
      <TransferRestrictionModal 
        isOpen={showRestrictionModal}
        onClose={() => setShowRestrictionModal(false)}
      />
    </>
  )
}
