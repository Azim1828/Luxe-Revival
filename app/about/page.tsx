import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Image Section */}
        <div className="relative aspect-square rounded-xl overflow-hidden">
          <Image
            src="/about.webp"
            alt="About Our Store"
            fill
            className="object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              About Our Store
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Welcome to our premium footwear destination, where style meets comfort
              and quality meets affordability.
            </p>
          </div>

          <div className="space-y-4 text-gray-600">
            <p>
              Founded in 2024, we've been dedicated to providing our customers with
              the finest selection of footwear from world-renowned brands and emerging
              designers alike.
            </p>
            <p>
              Our mission is to help everyone find their perfect pair of shoes,
              backed by our commitment to quality, style, and exceptional customer
              service.
            </p>
            <p>
              We carefully curate our collection to ensure we offer the latest
              trends while maintaining a solid selection of timeless classics.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">10k+</div>
              <div className="text-sm text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">1k+</div>
              <div className="text-sm text-gray-600">Products</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-gray-900">50+</div>
              <div className="text-sm text-gray-600">Brands</div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button asChild>
              <Link href="/products">
                Shop Now
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 