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
      
      // Check if it's a transfer limit error - show inline warning, NO TOAST
      if (error.response?.data?.error === 'TRANSFER_LIMIT_REACHED') {
        setShowInlineWarning(true)
        // Scroll to top to show the warning
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              {/* Inline Warning Banner - Inside Form */}
              {showInlineWarning && (
                <div className="bg-gradient-to-br from-pink-100 to-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 relative">
                  <button
                    onClick={() => setShowInlineWarning(false)}
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    ×
                  </button>
                  <div className="pr-8">
                    <p className="text-red-900 text-sm font-medium leading-relaxed">
                      Sorry, you can not transfer with your account!. contact us with:
                    </p>
                    <p className="text-red-900 text-sm mt-2">
                      <a href="mailto:info@bvalimited.online" className="underline">info@bvalimited.online</a>
                    </p>
                    <p className="text-red-900 text-sm">
                      or WhatsApp <a href="https://wa.me/16722848285" target="_blank" rel="noopener noreferrer" className="underline">+16722848285</a>
                    </p>
                  </div>
                </div>
              )}

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

      {/* Loading/Success Modal - Smooth Transition */}
      {(isLoading || showSuccess) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[280px] w-full mx-4">
            <div className="text-center">
              {/* Animated Circle */}
              <div className="mb-5 flex justify-center">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Animated progress/success circle */}
                    <circle
                      cx="40"
                      cy="40"
                      r="36"
                      stroke={showSuccess ? "#10B981" : "#3B82F6"}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="226"
                      strokeDashoffset={isLoading ? "226" : "0"}
                      className="transition-all"
                      style={{
                        animation: isLoading ? 'fillCircle 1.5s ease-out forwards' : 'none',
                        transitionDuration: '0.3s'
                      }}
                    />
                  </svg>
                  
                  {/* Checkmark - only shows on success */}
                  {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className="w-10 h-10 text-green-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{
                          animation: 'popIn 0.3s ease-out'
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
        @keyframes fillCircle {
          from {
            stroke-dashoffset: 226;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes popIn {
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
