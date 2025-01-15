'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { Product } from '@/app/types'

interface ProductGridProps {
  products?: Product[]
  queryParams?: {
    page?: number
    limit?: number
    tags?: string[]
    categories?: string[]
    sort?: string
    search?: string
  }
}

export default function ProductGrid({ products = [], queryParams }: ProductGridProps) {
  const [items, setItems] = useState<Product[]>(products)
  const [loading, setLoading] = useState(!!queryParams)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      if (!queryParams) return

      try {
        // Build query string from params
        const params = new URLSearchParams()
        if (queryParams.page) params.append('page', queryParams.page.toString())
        if (queryParams.limit) params.append('limit', queryParams.limit.toString())
        if (queryParams.tags) params.append('tags', queryParams.tags.join(','))
        if (queryParams.categories) params.append('categories', queryParams.categories.join(','))
        if (queryParams.sort) params.append('sort', queryParams.sort)
        if (queryParams.search) params.append('search', queryParams.search)

        const queryString = params.toString()
        const url = `/api/products${queryString ? `?${queryString}` : ''}`

        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch products')
        
        const data = await response.json()
        setItems(data.products)
      } catch (err) {
        setError('Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [queryParams])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(queryParams?.limit || 8)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 rounded-lg aspect-square"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
} 