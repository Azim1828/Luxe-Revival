'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'

interface RelatedProductsProps {
  currentProductId: string
  categoryIds: string[]
}

export default function RelatedProducts({ 
  currentProductId, 
  categoryIds 
}: RelatedProductsProps) {
  const [products, setProducts] = useState([])

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch related products')
        const data = await response.json()
        
        // Filter related products by category and exclude current product
        const relatedProducts = data.products
          .filter((product: any) => 
            product.id !== currentProductId &&
            product.categories.some((cat: any) => 
              categoryIds.includes(cat.id)
            )
          )
          .slice(0, 4) // Limit to 4 related products
        
        setProducts(relatedProducts)
      } catch (error) {
        console.error('Error fetching related products:', error)
      }
    }

    fetchRelatedProducts()
  }, [currentProductId, categoryIds])

  if (products.length === 0) return null

  return (
    <div className="mt-16 border-t border-gray-200 pt-16">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900">
        Related Products
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
} 