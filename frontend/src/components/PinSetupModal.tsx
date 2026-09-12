import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'

interface PinSetupModalProps {
  onClose: () => void
  onSuccess: () => void
}

export default function PinSetupModal({ onClose, onSuccess }: PinSetupModalProps) {
  const [pin, setPin] = useState(['', '', '', ''])
  const [confirmPin, setConfirmPin] = useState(['', '', '', ''])
  const [step, setStep] = useState<'info' | 'create' | 'confirm'>('info')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handlePinChange = (index: number, value: string, isConfirm = false) => {
    if (!/^\d*$/.test(value)) return

    const targetPin = isConfirm ? confirmPin : pin
    const setTargetPin = isConfirm ? setConfirmPin : setPin
    const newPin = [...targetPin]
    newPin[index] = value
    setTargetPin(newPin)

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`${isConfirm ? 'confirm' : 'pin'}-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number, isConfirm = false) => {
    const targetPin = isConfirm ? confirmPin : pin
    
    if (e.key === 'Backspace' && !targetPin[index] && index > 0) {
      const prevInput = document.getElementById(`${isConfirm ? 'confirm' : 'pin'}-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleContinue = () => {
    if (pin.some(d => !d)) {
      toast.error('Please enter a 4-digit PIN')
      return
    }
    setStep('confirm')
  }

  const handleSubmit = async () => {
    if (confirmPin.some(d => !d)) {
      toast.error('Please confirm your PIN')
      return
    }

    const pinValue = pin.join('')
    const confirmValue = confirmPin.join('')

    if (pinValue !== confirmValue) {
      toast.error('PINs do not match')
      setConfirmPin(['', '', '', ''])
      return
    }

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('token') || JSON.parse(localStorage.getItem('veritas-auth') || '{}').state?.token

      await axios.post(
        `${API_URL}/pin/create`,
        { pin: pinValue },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      toast.success('PIN created successfully!')
      onSuccess()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create PIN')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          {step === 'info' ? (
            <>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Create Transaction PIN</h3>
              <p className="text-base text-gray-600 mb-6 leading-relaxed">
                You need to create a 4-digit PIN first to secure your transactions. This PIN will be stored safely and used for all future transfers.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('create')}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Create PIN
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                {step === 'create' ? 'Enter Your PIN' : 'Confirm Your PIN'}
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {step === 'create' 
                  ? 'Create a 4-digit PIN to secure your transactions'
                  : 'Re-enter your PIN to confirm'}
              </p>

              {/* PIN Input */}
              {step === 'create' ? (
                <div className="flex justify-center gap-3 mb-6">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value, false)}
                      onKeyDown={(e) => handleKeyDown(e, index, false)}
                      id={`pin-${index}`}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex justify-center gap-3 mb-6">
                  {confirmPin.map((digit, index) => (
                    <input
                      key={index}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(index, e.target.value, true)}
                      onKeyDown={(e) => handleKeyDown(e, index, true)}
                      id={`confirm-${index}`}
                      className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                {step === 'create' ? (
                  <>
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContinue}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setStep('create')
                        setConfirmPin(['', '', '', ''])
                      }}
                      className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? 'Creating...' : 'Confirm'}
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
