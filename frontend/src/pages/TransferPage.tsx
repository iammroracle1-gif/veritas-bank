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
  const [showPinOverlay, setShowPinOverlay] = useState(false)
  const [pin, setPin] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [transactionData, setTransactionData] = useState<any>(null)
  const [isLookingUp, setIsLookingUp] = useState(false)
  const [recipientInfo, setRecipientInfo] = useState<{name: string} | null>(null)
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    description: '',
    currency: 'USD',
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

    // Show PIN overlay instead of processing immediately
    setShowPinOverlay(true)
  }

  const handlePinSubmit = async () => {
    const enteredPin = pin.join('')
    
    if (enteredPin.length !== 4) {
      toast.error('Please enter 4-digit PIN')
      return
    }

    // Close PIN overlay and start processing
    setShowPinOverlay(false)
    setIsLoading(true)

    const amount = parseFloat(formData.amount)

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

      // Save transaction data for receipt
      setTransactionData(response.data)

      // Transition from loading to success after progress completes
      setTimeout(() => {
        setIsLoading(false)
        setShowSuccess(true)
      }, 2000)

      // Show receipt after success animation
      setTimeout(() => {
        setShowSuccess(false)
        setShowReceipt(true)
      }, 4000)
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
                      or WhatsApp <a href="https://wa.me/13332284434" target="_blank" rel="noopener noreferrer" className="underline">+1 33322844342</a>
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
                    Amount
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white font-semibold"
                      disabled={isLoading}
                    >
                      <option value="USD">USD $</option>
                      <option value="EUR">EUR €</option>
                      <option value="GBP">GBP £</option>
                      <option value="USDT">USDT ₮</option>
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      required
                      disabled={isLoading}
                    />
                  </div>
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

      {/* PIN Overlay - Apple Pay Style */}
      {showPinOverlay && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-slideUp">
            <div className="text-center">
              {/* Header */}
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Your PIN</h3>
                <p className="text-sm text-gray-500">Confirm transfer of {formData.currency} {parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>

              {/* PIN Input */}
              <div className="flex justify-center gap-3 mb-6">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newPin = [...pin]
                      newPin[index] = e.target.value
                      setPin(newPin)
                      
                      // Auto-focus next input
                      if (e.target.value && index < 3) {
                        const nextInput = document.getElementById(`pin-${index + 1}`)
                        nextInput?.focus()
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle backspace
                      if (e.key === 'Backspace' && !pin[index] && index > 0) {
                        const prevInput = document.getElementById(`pin-${index - 1}`)
                        prevInput?.focus()
                      }
                    }}
                    id={`pin-${index}`}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPinOverlay(false)
                    setPin(['', '', '', ''])
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading/Success Animation - Single Modal with Smooth Transitions */}
      {(isLoading || showSuccess) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[280px] w-full mx-4">
            <div className="text-center">
              {/* Animated Circle */}
              <div className="mb-6 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
                    {/* Progress/Success circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke={showSuccess ? "#10B981" : "#3B82F6"}
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray="276"
                      strokeDashoffset={isLoading ? "276" : "0"}
                      style={{
                        animation: isLoading ? 'fillCircle 2s ease-in-out forwards' : 'none',
                        transition: 'stroke 0.5s ease'
                      }}
                    />
                  </svg>
                  
                  {/* Checkmark - fades in when success */}
                  {showSuccess && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg 
                        className="w-12 h-12 text-green-600" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        style={{
                          animation: 'checkmarkAppear 0.5s ease-out 0.3s both'
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
              
              {/* Text - Only show during loading */}
              {isLoading && (
                <p className="text-base font-medium text-gray-900">Processing...</p>
              )}
              
              {/* Success content - fades in */}
              {showSuccess && (
                <div style={{ animation: 'fadeIn 0.4s ease-out 0.5s both' }}>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Successful</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ${parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Receipt Modal */}
      {showReceipt && transactionData && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-t-3xl text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Transfer Successful</h3>
              <p className="text-blue-100 text-sm">Transaction completed</p>
            </div>

            {/* Receipt Content */}
            <div className="p-6 space-y-6">
              {/* Amount */}
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Amount Sent</p>
                <h2 className="text-4xl font-bold text-gray-900">
                  {formData.currency === 'USD' && '$'}
                  {formData.currency === 'EUR' && '€'}
                  {formData.currency === 'GBP' && '£'}
                  {formData.currency === 'USDT' && '₮'}
                  {parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{formData.currency}</p>
              </div>

              {/* Transaction Details */}
              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">To</span>
                  <span className="text-sm font-semibold text-gray-900">{recipientInfo?.name || formData.recipient}</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Account Number</span>
                  <span className="text-sm font-mono font-semibold text-gray-900">{formData.recipient}</span>
                </div>

                {formData.description && (
                  <div className="flex justify-between py-3 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Description</span>
                    <span className="text-sm text-gray-900 text-right max-w-[200px]">{formData.description}</span>
                  </div>
                )}

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="text-xs font-mono text-gray-900">{transactionData.id?.substring(0, 12)}...</span>
                </div>

                <div className="flex justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-sm text-gray-900">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={() => {
                  // Save receipt as text or download - simplified for now
                  toast.success('Receipt saved')
                }}
                className="w-full py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-colors"
              >
                Save Receipt
              </button>
              <button
                onClick={() => {
                  setShowReceipt(false)
                  setFormData({ recipient: '', amount: '', description: '', currency: 'USD' })
                  setRecipientInfo(null)
                  setPin(['', '', '', ''])
                  setTransactionData(null)
                  navigate('/dashboard')
                }}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fillCircle {
          0% {
            stroke-dashoffset: 276;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        
        @keyframes checkmarkAppear {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.2) rotate(0deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }
        
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

    </>
  )
}
