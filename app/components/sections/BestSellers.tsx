import ProductGrid from '../products/ProductGrid'

export default function BestSellers() {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Best Sellers</h2>
          <p className="mt-2 text-gray-600">
            Our most popular and highly rated footwear choices
          </p>
        </div>
        <ProductGrid 
          queryParams={{
            tags: ['bestSeller','premium'],
            limit: 4,
            sort: 'newest'
          }}
        />
      </div>
    </section>
  )
} 