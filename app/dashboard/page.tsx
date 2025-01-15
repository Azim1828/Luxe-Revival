'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doLogout } from '../actions/auth'
import ProfileUpdateForm from '../components/auth/ProfileUpdateForm'
import { useAuth } from '../contexts/auth-context'

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    if (user?.token) {
      await doLogout(user.token)
      logout()
    }
  }

  if (loading || !user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-gray-900">Profile</h2>
              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Logout
              </button>
            </div>
            <ProfileUpdateForm />
          </div>
        </div>
      </div>
    </div>
  )
} 