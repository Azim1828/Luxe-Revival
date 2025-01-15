'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOrder } from '@/app/contexts/order-context'
import { useShopping } from '@/app/contexts/shopping-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function CheckoutPage() {
  const router = useRouter()
  const { createOrder } = useOrder()
  const { cart, cartTotal } = useShopping()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const shippingAddress = {
      fullName: formData.get('fullName') as string,
      streetAddress: formData.get('streetAddress') as string,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postalCode: formData.get('postalCode') as string,
      country: formData.get('country') as string,
      phone: formData.get('phone') as string,
    }

    try {
      const order = await createOrder(shippingAddress)
      router.push(`/orders/${order.id}`)
    } catch (err) {
      setError('Failed to create order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Checkout
      </h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <Input
                id="fullName"
                name="fullName"
                required
                className="mt-1"
              />
            </div>

            <div>
              <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <Input
                id="streetAddress"
                name="streetAddress"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <Input
                  id="city"
                  name="city"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State
                </label>
                <Input
                  id="state"
                  name="state"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                  Postal Code
                </label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <Input
                  id="country"
                  name="country"
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                className="mt-1"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{cartTotal >= 100 ? 'Free' : '$10'}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total</span>
              <span>${cartTotal >= 100 ? cartTotal : cartTotal + 10}</span>
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </Button>
      </form>
    </div>
  )
} 