import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import PinSetupModal from '../components/PinSetupModal'
import { useAuthStore } from '../stores/authStore'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

export default function TransferPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showInlineWarning, setShowInlineWarning] = useState(false)
  const [showPinSetup, setShowPinSetup] = useState(false)
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

  // Check if user has PIN on mount
  useEffect(() => {
    checkPinStatus()
  }, [])

  const checkPinStatus = async () => {
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('veritas-auth') || '{}').state?.token
      const response = await axios.get(`${API_URL}/pin/check`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      // If no PIN, we'll show setup modal when they try to transfer
    } catch (error) {
      console.error('Check PIN error:', error)
    }
  }

  // Lookup recipient account
  const lookupAccount = async (accountNumber: string) => {
    if (!accountNumber || accountNumber.length < 10) {
      setRecipientInfo(null)
      return
    }

    setIsLookingUp(true)
    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const authStorage = localStorage.getItem('veritas-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token || null
        }
      }
      
      if (!token) {
        toast.error('Please log in again')
        setTimeout(() => navigate('/login'), 1500)
        return
      }
      
      const response = await axios.get(
        `${API_URL.replace('/api', '')}/api/transactions/lookup-account/${accountNumber}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      setRecipientInfo({ name: response.data.name })
    } catch (error: any) {
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
    
    if (value.length === 10) {
      lookupAccount(value)
    } else {
      setRecipientInfo(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.recipient || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    // Check if user has PIN before showing PIN overlay
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('veritas-auth') || '{}').state?.token
      const response = await axios.get(`${API_URL}/pin/check`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (!response.data.hasPin) {
        // No PIN set, show setup modal
        setShowPinSetup(true)
        return
      }
      
      // Has PIN, show PIN entry overlay
      setShowPinOverlay(true)
    } catch (error) {
      console.error('PIN check error:', error)
      toast.error('Failed to verify PIN status')
    }
  }

  const handlePinSubmit = async () => {
    const enteredPin = pin.join('')
    
    if (enteredPin.length !== 4) {
      toast.error('Please enter 4-digit PIN')
      return
    }

    setShowPinOverlay(false)
    setIsLoading(true)

    const amount = parseFloat(formData.amount)

    try {
      let token = localStorage.getItem('token')
      
      if (!token) {
        const authStorage = localStorage.getItem('veritas-auth')
        if (authStorage) {
          const parsed = JSON.parse(authStorage)
          token = parsed.state?.token || null
        }
      }
      
      if (!token) {
        toast.error('Please log in again')
        setTimeout(() => navigate('/login'), 1500)
        return
      }
      
      const response = await axios.post(
        `${API_URL.replace('/api', '')}/api/transactions/transfer`,
        {
          recipientAccountNumber: formData.recipient,
          amount: amount,
          description: formData.description,
          pin: enteredPin, // Include PIN in request
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setTransactionData(response.data)
      setPin(['', '', '', '']) // Clear PIN

      setTimeout(() => {
        setIsLoading(false)
        setShowSuccess(true)
      }, 2000)

      setTimeout(() => {
        setShowSuccess(false)
        setShowReceipt(true)
      }, 4000)
    } catch (error: any) {
      console.error('Transfer error:', error)
      setIsLoading(false)
      
      // Check for PIN_NOT_SET error
      if (error.response?.data?.error === 'PIN_NOT_SET') {
        setShowPinSetup(true)
        setPin(['', '', '', ''])
        return
      }
      
      // Check for incorrect PIN
      if (error.response?.data?.error === 'INCORRECT_PIN') {
        toast.error('Incorrect PIN. Please try again.')
        setPin(['', '', '', ''])
        setShowPinOverlay(true) // Show PIN input again
        return
      }
      
      if (error.response?.data?.error === 'TRANSFER_LIMIT_REACHED') {
        setShowInlineWarning(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else if (error.response?.data?.error) {
        toast.error(error.response.data.error)
      } else {
        toast.error('Transfer failed. Please try again.')
      }
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
        
        <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
          <Navbar onMenuClick={() => setShowSidebar(true)} />
          
          {/* Full Width Clean Layout - iOS Style */}
          <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 min-h-screen max-w-xl mx-auto">
            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Send Money</h1>
              <p className="text-sm text-gray-500 mt-1">Transfer funds securely</p>
            </div>

            {/* Restriction Warning - iOS Alert Style */}
            {showInlineWarning && (
              <div className="bg-red-50 rounded-2xl p-4 mb-4 relative">
                <button
                  onClick={() => setShowInlineWarning(false)}
                  className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-red-500 hover:bg-red-100 rounded-full transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="pr-8">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-red-900 mb-1">Transfers Restricted</h4>
                      <p className="text-xs text-red-800 mb-2">Sorry, you cannot transfer with your account. Please contact us:</p>
                      <div className="space-y-1.5">
                        <a href="mailto:support@veritasbank.com" className="flex items-center gap-2 text-xs text-red-900 hover:text-red-700">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          support@veritasbank.com
                        </a>
                        <a href="https://wa.me/13332284434" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-red-900 hover:text-red-700">
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          +1 333-228-4434
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Transfer Form - iOS Grouped List Style */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Section */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Recipient
                  </label>
                </div>
                <div className="p-4">
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.recipient}
                      onChange={(e) => handleAccountNumberChange(e.target.value)}
                      className="w-full h-12 px-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 text-gray-900 font-mono outline-none transition-all placeholder:text-gray-400"
                      placeholder="Account number"
                      required
                      disabled={isLoading}
                      maxLength={10}
                    />
                    {isLookingUp && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="animate-spin h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                  {recipientInfo && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-medium">{recipientInfo.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Amount Section */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Amount
                  </label>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-20 h-12 px-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 text-gray-900 font-semibold text-sm outline-none transition-all"
                      disabled={isLoading}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                        {formData.currency === 'USD' && '$'}
                        {formData.currency === 'EUR' && '€'}
                        {formData.currency === 'GBP' && '£'}
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full h-12 pl-8 pr-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 text-gray-900 font-semibold text-lg outline-none transition-all placeholder:text-gray-300"
                        placeholder="0.00"
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Description Section */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description <span className="text-gray-400 normal-case">(Optional)</span>
                  </label>
                </div>
                <div className="p-4">
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-gray-50 text-gray-900 text-sm resize-none outline-none transition-all placeholder:text-gray-400"
                    placeholder="What's this for?"
                    rows={3}
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Submit Button - iOS Style */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {isLoading ? 'Processing...' : 'Continue'}
              </button>
            </form>
          </div>
        </main>
      </div>

      {/* PIN Setup Modal */}
      {showPinSetup && (
        <PinSetupModal
          onClose={() => setShowPinSetup(false)}
          onSuccess={() => {
            setShowPinSetup(false)
            toast.success('PIN created successfully!')
            // Show PIN entry overlay after setup
            setTimeout(() => {
              setShowPinOverlay(true)
            }, 500)
          }}
        />
      )}

      {/* PIN Overlay */}
      {showPinOverlay && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 animate-slideUp">
            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enter Your PIN</h3>
                <p className="text-sm text-gray-500">Confirm transfer of {formData.currency} {parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
              </div>

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
                      
                      if (e.target.value && index < 3) {
                        const nextInput = document.getElementById(`pin-${index + 1}`)
                        nextInput?.focus()
                      }
                    }}
                    onKeyDown={(e) => {
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

      {/* Loading/Success Animation */}
      {(isLoading || showSuccess) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-[280px] w-full mx-4">
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="relative w-24 h-24">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="44"
                      stroke="#E5E7EB"
                      strokeWidth="4"
                      fill="none"
                    />
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
              
              {isLoading && (
                <p className="text-base font-medium text-gray-900">Processing...</p>
              )}
              
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
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-t-3xl text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Transfer Successful</h3>
              <p className="text-blue-100 text-sm">Transaction completed</p>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">Amount Sent</p>
                <h2 className="text-4xl font-bold text-gray-900">
                  {formData.currency === 'USD' && '$'}
                  {formData.currency === 'EUR' && '€'}
                  {formData.currency === 'GBP' && '£'}
                  {parseFloat(formData.amount || '0').toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{formData.currency}</p>
              </div>

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

            <div className="p-6 pt-0 space-y-3">
              <button
                onClick={() => {
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
