'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useShopping } from '@/app/contexts/shopping-context'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    basePrice: number
    images: Array<{
      url: string
      alt: string
    }>
    [key: string]: any
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToWishlist, removeFromWishlist, wishlist, addToCart } = useShopping()
  const isInWishlist = wishlist.some(item => item.id === product.id)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isInWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    // Default to smallest size available
    const defaultSize = product.size[0]
    addToCart(product, defaultSize)
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={product.images[0].url}
          alt={product.images[0].alt}
          fill
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
        >
          <Heart
            className={cn(
              "h-5 w-5",
              isInWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            )}
          />
        </button>
      </div>
      <div className="mt-4 space-y-2">
        <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-gray-500">${product.basePrice}</p>
        <div className="flex gap-2">
          <Button 
            onClick={handleAddToCart}
            size="sm" 
            className="w-full"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  )
} 