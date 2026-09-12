import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [showSidebar, setShowSidebar] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [oldPin, setOldPin] = useState(['', '', '', ''])
  const [newPin, setNewPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [step, setStep] = useState<'old' | 'new' | 'confirm'>('old')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePinChange = (index: number, value: string, type: 'old' | 'new' | 'confirm') => {
    if (!/^\d*$/.test(value)) return

    const targetPin = type === 'old' ? oldPin : type === 'new' ? newPin : confirmPin
    const setTargetPin = type === 'old' ? setOldPin : type === 'new' ? setNewPin : setConfirmPin
    const newPinArray = [...targetPin]
    newPinArray[index] = value
    setTargetPin(newPinArray)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`${type}-pin-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number, type: 'old' | 'new' | 'confirm') => {
    const targetPin = type === 'old' ? oldPin : type === 'new' ? newPin : confirmPin
    
    if (e.key === 'Backspace' && !targetPin[index] && index > 0) {
      const prevInput = document.getElementById(`${type}-pin-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleContinueOld = () => {
    if (oldPin.some(d => !d)) {
      toast.error('Please enter your current PIN')
      return
    }
    setStep('new')
  }

  const handleContinueNew = () => {
    if (newPin.some(d => !d)) {
      toast.error('Please enter your new PIN')
      return
    }
    setStep('confirm')
  }

  const handleSubmitPin = async () => {
    if (confirmPin.some(d => !d)) {
      toast.error('Please confirm your new PIN')
      return
    }

    const newPinValue = newPin.join('')
    const confirmValue = confirmPin.join('')

    if (newPinValue !== confirmValue) {
      toast.error('PINs do not match')
      setConfirmPin(['', '', '', ''])
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('veritas-auth') || '{}').state?.token

      await axios.post(
        `${API_URL}/pin/change`,
        { 
          oldPin: oldPin.join(''), 
          newPin: newPinValue 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success('PIN changed successfully!')
      setShowPinModal(false)
      setOldPin(['', '', '', ''])
      setNewPin(['', '', '', ''])
      setConfirmPin(['', '', '', ''])
      setStep('old')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to change PIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  const closePinModal = () => {
    setShowPinModal(false)
    setOldPin(['', '', '', ''])
    setNewPin(['', '', '', ''])
    setConfirmPin(['', '', '', ''])
    setStep('old')
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar isOpen={showSidebar} onClose={() => setShowSidebar(false)} onLogout={logout} />
        
        <main className="flex-1 lg:ml-72 overflow-auto bg-gray-50">
          <Navbar onMenuClick={() => setShowSidebar(true)} />
          
          <div className="pt-20 md:pt-24 pb-12 px-4 md:px-6 min-h-screen max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your account preferences</p>
            </div>

            {/* Security Section */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Security</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <button
                  onClick={() => setShowPinModal(true)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Change Transaction PIN</p>
                      <p className="text-xs text-gray-500 mt-0.5">Update your 4-digit PIN</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Account Section */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Account</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <button
                  onClick={() => navigate('/dashboard/profile')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Profile Information</p>
                      <p className="text-xs text-gray-500 mt-0.5">View your account details</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Support Section */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Support</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <button
                  onClick={() => navigate('/dashboard/support')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Contact Support</p>
                      <p className="text-xs text-gray-500 mt-0.5">Get help from our team</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* PIN Change Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {step === 'old' ? 'Enter Current PIN' : step === 'new' ? 'Enter New PIN' : 'Confirm New PIN'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {step === 'old' 
                  ? 'Verify your current PIN to continue'
                  : step === 'new'
                  ? 'Create a new 4-digit PIN'
                  : 'Re-enter your new PIN to confirm'}
              </p>

              {/* PIN Input */}
              <div className="flex justify-center gap-3 mb-6">
                {(step === 'old' ? oldPin : step === 'new' ? newPin : confirmPin).map((digit, index) => (
                  <input
                    key={index}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value, step)}
                    onKeyDown={(e) => handleKeyDown(e, index, step)}
                    id={`${step}-pin-${index}`}
                    className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={closePinModal}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    step === 'old' 
                      ? handleContinueOld 
                      : step === 'new' 
                      ? handleContinueNew 
                      : handleSubmitPin
                  }
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Changing...' : step === 'confirm' ? 'Confirm' : 'Continue'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
