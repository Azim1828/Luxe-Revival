'use client'

import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { doUserUpdate } from '@/app/actions/auth'
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from '@/app/contexts/auth-context'
import { User } from '@/app/types'

export default function ProfileUpdateForm() {
  const { user, updateUser } = useAuth()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    if (!user?.token) {
      setError('Not authenticated')
      setLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    const updateData = {
      token: user.token,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
    }

    try {
      const result = await doUserUpdate(updateData)
      setSuccess('Profile updated successfully')
      updateUser(result as User)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    }

    setLoading(false)
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            Loading...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert variant="default" className="border-green-500 text-green-700 bg-green-50">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            defaultValue={user.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            defaultValue={user.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            type="tel"
            name="phone"
            id="phone"
            defaultValue={user.phone}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            name="address"
            id="address"
            defaultValue={user.address}
            rows={3}
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  )
}