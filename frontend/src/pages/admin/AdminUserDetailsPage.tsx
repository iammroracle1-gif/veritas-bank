import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { adminApi } from '../../services/api'

type BalanceAdjustmentForm = {
  amount: number
  reason: string
  description: string
}

export default function AdminUserDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [showAdjustModal, setShowAdjustModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BalanceAdjustmentForm>()

  // Fetch user details with real-time sync
  const { data: userData, isLoading, refetch } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserDetails(id!),
    enabled: !!id,
    refetchInterval: 3000, // Refetch every 3 seconds for real-time sync
    staleTime: 0, // Always consider data stale
    cacheTime: 0, // Don't cache
  })

  const user = userData?.data

  // Debug logging
  console.log('User data:', user)
  console.log('Account balance:', user?.account?.balance)

  // Adjust balance mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: (data: BalanceAdjustmentForm) =>
      adminApi.adjustBalance(id!, data.amount, data.reason, data.description),
    onSuccess: async (response) => {
      console.log('Balance adjustment response:', response.data)
      toast.success('Balance updated successfully!')
      
      // Force immediate refetch with cache bypass
      await refetch()
      
      reset()
      setShowAdjustModal(false)
    },
    onError: (error: any) => {
      console.error('Balance adjustment error:', error)
      toast.error(error.response?.data?.error || 'Failed to adjust balance')
    },
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => adminApi.updateUserStatus(id!, status),
    onSuccess: () => {
      toast.success('Status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  const onSubmit = (data: BalanceAdjustmentForm) => {
    adjustBalanceMutation.mutate(data)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-500'
      case 'pending':
        return 'bg-amber-500'
      case 'suspended':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">User not found</p>
        <Link to="/admin/users" className="text-blue-600 hover:text-blue-700">
          Back to Users
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/users"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </Link>

      {/* Header Card - iOS Style */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
        {/* Cover / Header Background */}
        <div className="h-24 md:h-32 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600"></div>
        
        {/* Profile Info */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 md:-mt-16">
            {/* Avatar & Name */}
            <div className="flex flex-col md:flex-row md:items-end md:gap-4 mb-4 md:mb-0">
              {/* Profile Icon - Generic SVG */}
              <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-lg border-4 border-white flex items-center justify-center mb-4 md:mb-0">
                <svg className="w-12 h-12 md:w-16 md:h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* User Info */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-gray-600 text-sm md:text-base">{user.email}</p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowAdjustModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold transition-colors shadow-sm"
            >
              Load Balance
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Account Info */}
        <div className="space-y-4">
          {/* Balance Card - iOS Style */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg">
            <p className="text-sm opacity-90 mb-2">Balance</p>
            <p className="text-4xl font-bold">${(user.account?.balance || 0).toFixed(2)}</p>
          </div>

          {/* Account Details Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Account Number</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(user.accountNumber)
                    toast.success('Copied!')
                  }}
                  className="font-mono text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {user.accountNumber}
                </button>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p className="text-sm font-medium text-gray-900">{user.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Joined</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status Change Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Status</h3>
            <select
              value={user.accountStatus}
              onChange={(e) => updateStatusMutation.mutate(e.target.value)}
              disabled={updateStatusMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-sm font-medium text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* Right Column - Transactions */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              <span className="text-sm text-gray-500">
                {user.transactions?.length || 0} total
              </span>
            </div>

            {user.transactions && user.transactions.length > 0 ? (
              <div className="space-y-2">
                {user.transactions.slice(0, 10).map((txn: any) => {
                  const isCredit = txn.amount > 0
                  return (
                    <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isCredit ? 'bg-green-100' : 'bg-gray-200'
                        }`}>
                          <svg className={`w-5 h-5 ${isCredit ? 'text-green-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isCredit ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{txn.category || txn.transactionType}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(txn.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-gray-900'}`}>
                          {isCredit ? '+' : ''}{txn.currency === 'USD' ? '$' : ''}{Math.abs(txn.amount).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">{txn.reference}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance Adjustment Modal - iOS Style */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Load Balance</h3>
                <button
                  onClick={() => setShowAdjustModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
              {/* Current Balance Display */}
              <div className="bg-blue-50 rounded-2xl p-4 text-center">
                <p className="text-xs text-blue-600 mb-1">Current Balance</p>
                <p className="text-2xl font-bold text-blue-900">${(user.account?.balance || 0).toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    validate: (value) => value !== 0 || 'Amount cannot be zero'
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-base font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Enter amount"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Use positive to add, negative to deduct
                </p>
                {errors.amount && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason
                </label>
                <select
                  {...register('reason', { required: 'Reason is required' })}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-base font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="">Select reason</option>
                  <option value="Manual Deposit">Manual Deposit</option>
                  <option value="Balance Load">Balance Load</option>
                  <option value="Correction">Correction</option>
                  <option value="Refund">Refund</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.reason.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border-0 rounded-2xl text-base resize-none focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Add notes..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-2xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustBalanceMutation.isPending}
                  className="flex-1 py-3.5 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-sm"
                >
                  {adjustBalanceMutation.isPending ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
