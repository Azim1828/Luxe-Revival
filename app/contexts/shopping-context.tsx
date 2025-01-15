'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface Product {
  id: string
  name: string
  basePrice: number
  images: Array<{
    url: string
    alt: string
  }>
  [key: string]: any
}

interface CartItem extends Product {
  quantity: number
  size: number
}

interface ShoppingContextType {
  cart: CartItem[]
  wishlist: Product[]
  addToCart: (product: Product, size: number) => void
  removeFromCart: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  cartItemsCount: number
  wishlistItemsCount: number
  cartTotal: number
}

const ShoppingContext = createContext<ShoppingContextType | undefined>(undefined)

export function ShoppingProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [wishlist, setWishlist] = useState<Product[]>([])

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    const savedWishlist = localStorage.getItem('wishlist')
    
    if (savedCart) setCart(JSON.parse(savedCart))
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist))
  }, [])

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToCart = (product: Product, size: number) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(
        item => item.id === product.id && item.size === size
      )

      if (existingItem) {
        return currentCart.map(item =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...currentCart, { ...product, quantity: 1, size }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== productId))
  }

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const addToWishlist = (product: Product) => {
    setWishlist(currentWishlist => {
      const exists = currentWishlist.some(item => item.id === product.id)
      if (exists) return currentWishlist
      return [...currentWishlist, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setWishlist(currentWishlist =>
      currentWishlist.filter(item => item.id !== productId)
    )
  }

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)
  const wishlistItemsCount = wishlist.length
  const cartTotal = cart.reduce(
    (total, item) => total + item.basePrice * item.quantity,
    0
  )

  return (
    <ShoppingContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        addToWishlist,
        removeFromWishlist,
        cartItemsCount,
        wishlistItemsCount,
        cartTotal,
      }}
    >
      {children}
    </ShoppingContext.Provider>
  )
}

export function useShopping() {
  const context = useContext(ShoppingContext)
  if (context === undefined) {
    throw new Error('useShopping must be used within a ShoppingProvider')
  }
  return context
} 