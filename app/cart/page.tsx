'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useShopping } from '@/app/contexts/shopping-context'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, ArrowRight } from 'lucide-react'
import { Input } from '@/components/ui/input'

export default function CartPage() {
  const { cart, removeFromCart, updateCartItemQuantity, cartTotal } = useShopping()

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Your Cart is Empty
          </h1>
          <p className="mt-4 text-gray-500">
            Looks like you haven't added anything to your cart yet.
          </p>
          <Button asChild className="mt-8">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
        Shopping Cart
      </h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <div className="space-y-8">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.size}`}
                className="flex gap-6 py-6 border-b"
              >
                <div className="relative aspect-square w-24 rounded-lg overflow-hidden">
                  <Image
                    src={item.images[0].url}
                    alt={item.images[0].alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Size: {item.size}
                      </p>
                    </div>
                    <p className="text-base font-medium text-gray-900">
                      ${item.basePrice * item.quantity}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600">
                        Qty:
                      </label>
                      <Select
                        value={item.quantity.toString()}
                        onValueChange={(value) => 
                          updateCartItemQuantity(item.id, parseInt(value))
                        }
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 mt-8 lg:mt-0">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-base text-gray-600">Subtotal</span>
                <span className="text-base font-medium text-gray-900">
                  ${cartTotal}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-base text-gray-600">Shipping</span>
                <span className="text-base font-medium text-gray-900">
                  {cartTotal >= 100 ? 'Free' : '$10'}
                </span>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-medium text-gray-900">
                    ${cartTotal >= 100 ? cartTotal : cartTotal + 10}
                  </span>
                </div>
              </div>
            </div>

            <Button className="w-full mt-6" size="lg" asChild>
              <Link href="/checkout">
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 text-center text-sm text-gray-500">
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 