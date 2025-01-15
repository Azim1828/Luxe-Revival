'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductGrid from '@/app/components/products/ProductGrid'

interface Category {
  id: string
  name: string
  slug: string
}

export default function CategoryPage({
  params,
}: {
  params: { slug: string }
}) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch category')
        const data = await response.json()
        
        const foundCategory = data.filters.availableCategories.find(
          (cat: Category) => cat.slug === params.slug
        )
        
        if (foundCategory) {
          setCategory(foundCategory)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategory()
  }, [params.slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!category) {
    return <div>Category not found</div>
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        <div>
          <Link 
            href="/categories" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            All Categories
          </Link>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            {category.name}
          </h1>
        </div>

        <ProductGrid 
          queryParams={{
            categories: [category.slug],
            limit: 12,
            sort: 'newest'
          }}
        />
      </div>
    </div>
  )
} 