import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { authApi } from '../services/api'
import { useAuthStore } from '../stores/authStore'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  // Test backend connection on mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'https://veritas-bank-0dru.onrender.com/api'
        const response = await fetch(`${API_URL}/ping`, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        })
        if (response.ok) {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('error')
        }
      } catch (error) {
        console.error('Connection test failed:', error)
        setConnectionStatus('failed')
      }
    }
    testConnection()
  }, [])

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      console.log('Attempting login...');
      const response = await authApi.login(data.email, data.password)
      console.log('Login response:', response);
      
      const { user, token } = response.data
      
      // Save to Zustand store
      setAuth(user, token)
      
      // Also save directly to localStorage for backward compatibility
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      toast.success(`Welcome back, ${user.firstName}!`)
      
      // Redirect based on role
      if (user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (error: any) {
      console.error('Full login error:', error);
      
      // Handle network errors
      if (error.isNetworkError) {
        toast.error('Cannot connect to server. Please check your internet connection.')
        return;
      }
      
      // Handle timeout
      if (error.isTimeout) {
        toast.error('Request timed out. The server may be slow. Please try again.')
        return;
      }
      
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message
      
      if (error.response?.status === 400 || error.response?.status === 401) {
        toast.error('Invalid email or password. Please check your credentials.')
      } else if (error.response?.status === 403) {
        toast.error('Your account is not active. Please contact support.')
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again in a few moments.')
      } else {
        toast.error(errorMsg || 'Login failed. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }}></div>

      {/* Back to Home - Top Left */}
      <Link
        to="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-primary-500 font-medium transition-colors flex items-center gap-2 z-10"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <div className="w-full max-w-md relative z-10">
        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-10 border border-white/20">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src="/images/ChatGPT_Image_Sep_7__2026__02_17_55_PM-removebg-preview.png" 
              alt="Veritas Bank" 
              className="h-14 mx-auto mb-6"
            />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue to your account</p>
            
            {/* Connection Status Indicator */}
            {connectionStatus === 'failed' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-700">
                  Cannot connect to server. Please check your internet or try again later.
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-gray-900 placeholder-gray-400"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all text-gray-900 placeholder-gray-400 pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <img 
                    src={showPassword ? "/images/eye-open.png" : "/images/eye-close.png"} 
                    alt="Toggle" 
                    className="w-5 h-5 opacity-60"
                  />
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-primary-500/50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing you in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">
                New to Veritas Bank?
              </span>
            </div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center py-3.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-100 hover:border-gray-300 active:scale-[0.98] transition-all font-semibold"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Protected by industry-leading security
        </p>
      </div>
    </div>
  )
}
