import { useEffect, useState } from 'react'
import ProductGrid from '../products/ProductGrid'

export default function FeaturedProducts() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
          <p className="mt-2 text-gray-600">
            Discover our handpicked selection of premium footwear
          </p>
        </div>
        <ProductGrid 
          queryParams={{
            tags: ['featured'],
            limit: 4,
            sort: 'newest'
          }}
        />
      </div>
    </section>
  )
} 