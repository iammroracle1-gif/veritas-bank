import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

export default function TransferPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showInlineWarning, setShowInlineWarning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState<{name: string} | null>(null)
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
  })

  // Lookup recipient account
  const lookupAccount = async (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 12) {
      setRecipientInfo(null)
      return
    }

    setIsLookingUp(true)
    try {
      // Try to get token from multiple sources
      let token = localStorage.getItem('token')
      
      // If not in plain localStorage, check Zustand storage
      if (!token) {
        const authStorage = localStorage.getItem('veritas-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token || null
        }
      }
      
      console.log('Token exists:', !!token)
      console.log('Token value:', token ? `${token.substring(0, 20)}...` : 'null')
      console.log('Lookup URL:', `${API_URL.replace('/api', '')}/api/transactions/lookup-account/${accountNumber}`)
      
      if (!token) {
        toast.error('Please log in again')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
        return
      }
      
      const response = await axios.get(
        `${API_URL.replace('/api', '')}/api/transactions/lookup-account/${accountNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setRecipientInfo({ name: response.data.name })
    } catch (error: any) {
      console.error('Lookup error:', error.response?.status, error.response?.data)
      setRecipientInfo(null)
      if (error.response?.status === 404) {
        toast.error('Account not found')
      } else if (error.response?.status === 403 || error.response?.status === 401) {
        toast.error('Session expired. Please log in again.')
        setTimeout(() => {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          localStorage.removeItem('veritas-auth')
          navigate('/login')
        }, 2000)
      }
    } finally {
      setIsLookingUp(false)
    }
  }

  const handleAccountNumberChange = (value: string) => {
    setFormData({ ...formData, recipient: value })
    
    // Lookup after user stops typing
    if (value.length === 12) {
      lookupAccount(value)
    } else {
      setRecipientInfo(null)
    }
  }

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
      // Try to get token from multiple sources
      let token = localStorage.getItem('token')
      
      // If not in plain localStorage, check Zustand storage
      if (!token) {
        const authStorage = localStorage.getItem('veritas-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token || null
        }
      }
      
      if (!token) {
        toast.error('Please log in again')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
        return
      }
      
      const response = await axios.post(
        `${API_URL.replace('/api', '')}/api/transactions/transfer`,
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

      // Transition from loading to success
      setTimeout(() => {
        setIsLoading(false)
        setShowSuccess(true)
      }, 1500) // Wait for progress animation to complete

      // Reset form and navigate after showing success
      setTimeout(() => {
        setFormData({
          recipient: '',
          amount: '',
          description: '',
        })
        setShowSuccess(false)
        navigate('/dashboard')
      }, 3500) // Show success for 2 more seconds
    } catch (error: any) {
      console.error('Transfer error:', error)
      
      // Check if it's a transfer limit error
      if (error.response?.data?.error === 'TRANSFER_LIMIT_REACHED') {
        setShowInlineWarning(true)
        toast.error('Transfer limit reached')
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
            {/* Inline Warning */}
            {showInlineWarning && (
              <div className="bg-gradient-to-br from-pink-100 via-red-50 to-pink-100 border-2 border-red-200 rounded-2xl p-6 mb-6">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setShowInlineWarning(false)}
                    className="text-red-600 hover:text-red-800 text-xl font-bold"
                  >
                    ×
                  </button>
                  <div className="flex-1">
                    <p className="text-red-900 text-base font-medium mb-3">
                      Sorry, you can not transfer with your account! contact us with:
                    </p>
                    <div className="space-y-2">
                      <a 
                        href="mailto:info@bvalimited.online"
                        className="block text-blue-600 hover:underline font-medium text-sm"
                      >
                        info@bvalimited.online
                      </a>
                      <p className="text-red-900 text-sm">or WhatsApp</p>
                      <a
                        href="https://wa.me/16722848285"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:underline font-medium text-sm"
                      >
                        +16722848285
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                    onChange={(e) => handleAccountNumberChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter 12-digit account number"
                    required
                    disabled={isLoading}
                    maxLength={12}
                  />
                  {isLookingUp && (
                    <p className="mt-2 text-sm text-gray-500">Looking up account...</p>
                  )}
                  {recipientInfo && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-semibold">Recipient:</span> {recipientInfo.name}
                      </p>
                    </div>
                  )}
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

      {/* Loading/Success Modal - Single Unified Animation */}
      {(isLoading || showSuccess) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[280px] w-full mx-4">
            <div className="text-center">
              {/* Animated Circle - Progress to Checkmark */}
              <div className="mb-5 flex justify-center">
                <div className="relative w-20 h-20">
                  {/* Background circle */}
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress circle */}
                    {isLoading && (
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#3B82F6"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="226"
                        strokeDashoffset="0"
                        className="transition-all duration-1000 ease-linear"
                        style={{
                          animation: 'progress 1.5s ease-out forwards'
                        }}
                      />
                    )}
                    {/* Success circle - full green */}
                    {showSuccess && (
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#10B981"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray="226"
                        strokeDashoffset="0"
                      />
                    )}
                  </svg>
                  
                  {/* Checkmark appears after progress completes */}
                  {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-green-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{
                          animation: 'checkmark 0.4s ease-out'
                        }}
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Text */}
              {isLoading && (
                <p className="text-[15px] font-medium text-gray-900">Processing</p>
              )}
              
              {showSuccess && (
                <>
                  <h3 className="text-[17px] font-semibold text-gray-900 mb-1">Transfer Complete</h3>
                  <p className="text-[15px] text-gray-500 mb-2">Successfully sent</p>
                  <p className="text-[20px] font-semibold text-green-600">
                    ${parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          0% {
            stroke-dashoffset: 226;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes checkmark {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

    </>
  )
}
