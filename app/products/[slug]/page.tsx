'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Star, Truck, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import ProductImageGallery from '@/app/components/products/ProductImageGallery'
import RelatedProducts from '@/app/components/products/RelatedProducts'
import { useShopping } from '@/app/contexts/shopping-context'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  basePrice: number
  compareAtPrice?: number
  images: Array<{
    url: string
    alt: string
    isMain: boolean
  }>
  size: number[]
  averageRating: number
  totalReviews: number
  tags: string[]
  categories: Array<{
    id: string
    name: string
    slug: string
  }>
}

export default function ProductPage({
  params,
}: {
  params: { slug: string }
}) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showSizeError, setShowSizeError] = useState(false)
  const { addToCart, addToWishlist, removeFromWishlist, wishlist } = useShopping()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch product')
        const data = await response.json()
        const foundProduct = data.products.find((p: Product) => p.slug === params.slug)
        if (foundProduct) {
          setProduct(foundProduct)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const isInWishlist = wishlist.some(item => item.id === product.id)
  
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.basePrice) / product.compareAtPrice) * 100)
    : 0

  const handleAddToCart = () => {
    if (!selectedSize) {
      setShowSizeError(true)
      return
    }
    addToCart(product, parseInt(selectedSize))
    setShowSizeError(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link 
          href="/products" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        {/* Product Images */}
        <ProductImageGallery images={product.images} />

        {/* Product Info */}
        <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {product.name}
              </h1>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 text-sm text-gray-500">
                    {product.averageRating} ({product.totalReviews} reviews)
                  </span>
                </div>
                {product.categories.map((category) => (
                  <Badge key={category.id} variant="secondary">
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <span className="text-2xl font-bold text-gray-900">
                  ${product.basePrice}
                </span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      ${product.compareAtPrice}
                    </span>
                    <Badge variant="destructive">
                      {discount}% OFF
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="space-y-6 text-base text-gray-700">
              {product.description}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">Size</h3>
              <Link href="#size-guide" className="text-sm font-medium text-primary hover:text-primary/80">
                Size guide
              </Link>
            </div>

            <Select 
              value={selectedSize} 
              onValueChange={(value) => {
                setSelectedSize(value)
                setShowSizeError(false)
              }}
            >
              <SelectTrigger className={cn(
                "w-full mt-2",
                showSizeError && "border-red-500"
              )}>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.size.map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {showSizeError && (
              <p className="mt-2 text-sm text-red-500">
                Please select a size before adding to cart
              </p>
            )}
          </div>

          <div className="mt-8 space-y-4">
            <Button 
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => isInWishlist ? removeFromWishlist(product.id) : addToWishlist(product)}
            >
              {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </Button>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Truck className="h-5 w-5" />
              <span>Free shipping on orders over $100</span>
            </div>
          </div>

          {/* Product Tags */}
          <div className="mt-8 border-t border-gray-200 pt-8">
            <h3 className="text-sm font-medium text-gray-900">Tags</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        currentProductId={product.id}
        categoryIds={product.categories.map(c => c.id)}
      />
    </div>
  )
} 