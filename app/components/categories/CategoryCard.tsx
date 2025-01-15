import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface CategoryCardProps {
  category: {
    id: string
    name: string
    slug: string
    productCount?: number
  }
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {category.name}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {category.productCount} Products
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-gray-900 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
} 