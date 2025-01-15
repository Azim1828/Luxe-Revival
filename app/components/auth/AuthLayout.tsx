'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'

type Tab = 'login' | 'register'

interface AuthLayoutProps {
  defaultTab?: Tab
}

export default function AuthLayout({ defaultTab = 'login' }: AuthLayoutProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') as Tab || defaultTab

  const handleTabChange = (tab: Tab) => {
    router.push(`/auth?tab=${tab}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-6">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-6">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}