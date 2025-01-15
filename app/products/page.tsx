'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, SlidersHorizontal } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ProductFilters from '../components/products/ProductFilters'
import ProductGrid from '../components/products/ProductGrid'

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Update URL with search query
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearchQuery) {
      params.set('search', debouncedSearchQuery)
    } else {
      params.delete('search')
    }
    router.push(`/products?${params.toString()}`)
  }, [debouncedSearchQuery, router, searchParams])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            All Products
          </h1>
          <p className="mt-4 text-base text-gray-500">
            Browse through our collection of premium footwear
          </p>
        </div>

        {/* Search and Mobile Filter Button */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <ProductFilters className="mt-4" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <ProductGrid
            queryParams={{
              search: debouncedSearchQuery,
              categories: searchParams.getAll('category'),
              tags: searchParams.getAll('tag'),
              sort: searchParams.get('sort') as any,
              page: Number(searchParams.get('page')) || 1,
              limit: 12,
            }}
          />
        </div>
      </div>
    </div>
  )
} 