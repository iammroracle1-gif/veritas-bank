import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link, useNavigate } from 'react-router-dom'
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
  const [showRestrictionsModal, setShowRestrictionsModal] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BalanceAdjustmentForm>()

  // Fetch user details
  const { data: userData, isLoading } = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => adminApi.getUserDetails(id!),
    enabled: !!id,
  })

  const user = userData?.data

  // Adjust balance mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: (data: BalanceAdjustmentForm) =>
      adminApi.adjustBalance(id!, data.amount, data.reason, data.description),
    onSuccess: () => {
      toast.success('Balance adjusted successfully!')
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      reset()
      setShowAdjustModal(false)
    },
    onError: () => {
      toast.error('Failed to adjust balance')
    },
  })

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: (status: string) => adminApi.updateUserStatus(id!, status),
    onSuccess: () => {
      toast.success('User status updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
    },
    onError: () => {
      toast.error('Failed to update user status')
    },
  })

  // Update restrictions mutation
  const updateRestrictionsMutation = useMutation({
    mutationFn: (restrictions: {
      transferRestricted?: boolean
      withdrawalRestricted?: boolean
      depositRestricted?: boolean
      restrictionReason?: string
    }) => adminApi.updateUserRestrictions(id!, restrictions),
    onSuccess: () => {
      toast.success('Restrictions updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] })
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      setShowRestrictionsModal(false)
    },
    onError: () => {
      toast.error('Failed to update restrictions')
    },
  })

  const onSubmit = (data: BalanceAdjustmentForm) => {
    adjustBalanceMutation.mutate(data)
  }

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'suspended':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user details...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">User not found</p>
        <Link to="/admin/users" className="text-primary-500 hover:text-primary-600">
          Back to Users
        </Link>
      </div>
    )
  }

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/admin/users"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Users
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
          <p className="text-gray-600 mt-1">View and manage user account</p>
        </div>
        <button
          onClick={() => setShowAdjustModal(true)}
          className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
        >
          Adjust Balance
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
              {initials}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(user.accountStatus)}`}>
              {user.accountStatus}
            </span>
          </div>

          <div className="space-y-3 pt-6 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Account Number</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.accountNumber)
                  toast.success('Account number copied!')
                }}
                className="font-mono font-semibold text-gray-900 hover:text-primary-500 transition-colors"
              >
                {user.accountNumber}
              </button>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phone</span>
              <span className="font-semibold text-gray-900">{user.phone || 'N/A'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Role</span>
              <span className="font-semibold text-gray-900">{user.role}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Member Since</span>
              <span className="font-semibold text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Last Login</span>
              <span className="font-semibold text-gray-900">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
              </span>
            </div>
          </div>

          {/* Status Change */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Change Status
            </label>
            <select
              value={user.accountStatus}
              onChange={(e) => updateStatusMutation.mutate(e.target.value)}
              disabled={updateStatusMutation.isPending}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
            >
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          {/* Restrictions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700">Account Restrictions</h4>
              <button
                onClick={() => setShowRestrictionsModal(true)}
                className="text-sm text-primary-500 hover:text-primary-600 font-medium"
              >
                Manage
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Transfer</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  user.transferRestricted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {user.transferRestricted ? 'Restricted' : 'Allowed'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Withdrawal</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  user.withdrawalRestricted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {user.withdrawalRestricted ? 'Restricted' : 'Allowed'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Deposit</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  user.depositRestricted ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                  {user.depositRestricted ? 'Restricted' : 'Allowed'}
                </span>
              </div>
            </div>
            {user.restrictionReason && (
              <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Reason:</strong> {user.restrictionReason}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Account Info & Transactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-lg">
            <h3 className="text-sm opacity-90 mb-2">Account Balance</h3>
            <div className="text-4xl font-bold mb-4">
              ${(user.account?.balance || 0).toFixed(2)}
            </div>
            <div className="text-sm opacity-90">
              <span>Base Currency: {user.account?.baseCurrency || 'USD'}</span>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h3>

            {user.transactions && user.transactions.length > 0 ? (
              <div className="space-y-3">
                {user.transactions.slice(0, 10).map((txn: any) => {
                  const isCredit = txn.transactionType?.includes('credit') || txn.amount > 0
                  return (
                    <div key={txn.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCredit ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            {isCredit ? (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            ) : (
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{txn.category || txn.transactionType}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(txn.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                          {isCredit ? '+' : ''}{txn.currency} {txn.amount.toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          Ref: {txn.reference}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p>No transactions yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Adjust Balance</h3>
              <button
                onClick={() => setShowAdjustModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('amount', {
                    required: 'Amount is required',
                    validate: (value) => value !== 0 || 'Amount cannot be zero'
                  })}
                  type="number"
                  step="0.01"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                  placeholder="Enter amount (positive to add, negative to deduct)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Current balance: ${(user.account?.balance || 0).toFixed(2)}
                </p>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('reason', { required: 'Reason is required' })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                >
                  <option value="">Select reason</option>
                  <option value="Manual Deposit">Manual Deposit</option>
                  <option value="Manual Withdrawal">Manual Withdrawal</option>
                  <option value="Correction">Balance Correction</option>
                  <option value="Refund">Refund</option>
                  <option value="Bonus">Bonus</option>
                  <option value="Penalty">Penalty</option>
                  <option value="Other">Other</option>
                </select>
                {errors.reason && (
                  <p className="mt-1 text-sm text-red-500">{errors.reason.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none"
                  placeholder="Additional notes (optional)"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjustBalanceMutation.isPending}
                  className="flex-1 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {adjustBalanceMutation.isPending ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Restrictions Management Modal */}
      {showRestrictionsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Manage Restrictions</h3>
              <button
                onClick={() => setShowRestrictionsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <RestrictionsForm 
              user={user} 
              onSubmit={(data) => updateRestrictionsMutation.mutate(data)}
              isLoading={updateRestrictionsMutation.isPending}
              onCancel={() => setShowRestrictionsModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// Restrictions Form Component
function RestrictionsForm({ user, onSubmit, isLoading, onCancel }: any) {
  const [restrictions, setRestrictions] = useState({
    transferRestricted: user.transferRestricted || false,
    withdrawalRestricted: user.withdrawalRestricted || false,
    depositRestricted: user.depositRestricted || false,
    restrictionReason: user.restrictionReason || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(restrictions)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            <span className="font-semibold text-gray-900">Restrict Transfers</span>
          </div>
          <input
            type="checkbox"
            checked={restrictions.transferRestricted}
            onChange={(e) => setRestrictions({ ...restrictions, transferRestricted: e.target.checked })}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="font-semibold text-gray-900">Restrict Withdrawals</span>
          </div>
          <input
            type="checkbox"
            checked={restrictions.withdrawalRestricted}
            onChange={(e) => setRestrictions({ ...restrictions, withdrawalRestricted: e.target.checked })}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>

        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="font-semibold text-gray-900">Restrict Deposits</span>
          </div>
          <input
            type="checkbox"
            checked={restrictions.depositRestricted}
            onChange={(e) => setRestrictions({ ...restrictions, depositRestricted: e.target.checked })}
            className="w-5 h-5 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Restriction Reason
        </label>
        <textarea
          value={restrictions.restrictionReason}
          onChange={(e) => setRestrictions({ ...restrictions, restrictionReason: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none"
          placeholder="Enter reason for restrictions (optional)"
        />
        <p className="mt-1 text-xs text-gray-500">
          This reason will be visible to the user
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Restrictions'}
        </button>
      </div>
    </form>
  )
}
