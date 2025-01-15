'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import AuthLayout, { Tab } from '@/app/components/auth/AuthLayout'

export default function AuthPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get('tab') as Tab || Tab.LOGIN

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthLayout defaultTab={defaultTab}>
        {defaultTab === Tab.LOGIN ? (
          <LoginForm />
        ) : (
          <RegisterForm />
        )}
      </AuthLayout>
    </Suspense>
  )
}

import LoginForm from '@/app/components/auth/LoginForm'
import RegisterForm from '@/app/components/auth/RegisterForm' 