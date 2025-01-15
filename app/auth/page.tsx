import { Suspense } from 'react'
import AuthLayout from '../components/auth/AuthLayout'


export default function AuthPage({
  searchParams,
}: {
  searchParams: { tab?: string }
}) {
  const defaultTab = searchParams.tab === 'register' ? 'register' : 'login'

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout defaultTab={defaultTab as 'login' | 'register'} />
    </Suspense>
  )
} 