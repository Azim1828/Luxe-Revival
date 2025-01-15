'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useShopping } from './shopping-context'

interface OrderAddress {
  fullName: string
  streetAddress: string
  city: string
  state: string
  postalCode: string
  country: string
  phone: string
}

interface OrderItem {
  productId: string
  name: string
  size: number
  quantity: number
  price: number
  image: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: OrderAddress
  createdAt: string
}

interface OrderContextType {
  orders: Order[]
  createOrder: (shippingAddress: OrderAddress) => Promise<Order>
  getOrders: () => Promise<void>
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const { cart, cartTotal } = useShopping()

  const createOrder = async (shippingAddress: OrderAddress): Promise<Order> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            size: item.size,
            quantity: item.quantity,
            price: item.basePrice,
            image: item.images[0].url,
          })),
          shippingAddress,
          subtotal: cartTotal,
          shipping: cartTotal >= 100 ? 0 : 10,
          total: cartTotal >= 100 ? cartTotal : cartTotal + 10,
        }),
      })

      if (!response.ok) throw new Error('Failed to create order')
      
      const order = await response.json()
      setOrders(prev => [order, ...prev])
      return order
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  }

  const getOrders = async () => {
    try {
      const response = await fetch('/api/orders')
      if (!response.ok) throw new Error('Failed to fetch orders')
      const data = await response.json()
      setOrders(data.orders)
    } catch (error) {
      console.error('Error fetching orders:', error)
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  return (
    <OrderContext.Provider value={{ orders, createOrder, getOrders }}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
} 