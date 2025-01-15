import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// Types
interface Product {
  id: string
  name: string
  tags: string[]
  categories: Array<{ id: string; name: string; slug: string }>
  [key: string]: any
}

interface QueryParams {
  page?: number
  limit?: number
  tags?: string[]
  categories?: string[]
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
  search?: string
}

// Helper functions
function filterProducts(products: Product[], params: QueryParams) {
  let filtered = [...products]

  // Filter by tags
  if (params.tags && params.tags.length > 0) {
    filtered = filtered.filter(product =>
      params.tags!.some(tag => product.tags.includes(tag))
    )
  }

  // Filter by categories
  if (params.categories && params.categories.length > 0) {
    filtered = filtered.filter(product =>
      params.categories!.some(categorySlug =>
        product.categories.some(cat => cat.slug === categorySlug)
      )
    )
  }

  // Search by name or description
  if (params.search) {
    const searchTerm = params.search.toLowerCase()
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.shortDescription.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
}

function sortProducts(products: Product[], sort?: string) {
  const sorted = [...products]

  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.basePrice - b.basePrice)
    case 'price_desc':
      return sorted.sort((a, b) => b.basePrice - a.basePrice)
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    default:
      return sorted
  }
}

function paginateProducts(products: Product[], page = 1, limit = 12) {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedProducts = products.slice(startIndex, endIndex)

  return {
    products: paginatedProducts,
    pagination: {
      total: products.length,
      totalPages: Math.ceil(products.length / limit),
      currentPage: page,
      limit,
      hasMore: endIndex < products.length,
    },
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean)
    const categories = searchParams.get('categories')?.split(',').filter(Boolean)
    const sort = searchParams.get('sort') as QueryParams['sort']
    const search = searchParams.get('search') || ''

    // Validate parameters
    if (page < 1 || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      )
    }

    // Read products data
    const filePath = path.join(process.cwd(), 'data', 'products.json')
    const fileData = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(fileData)

    // Apply filters
    let filteredProducts = filterProducts(data.products, {
      tags,
      categories,
      search,
    })

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, sort)

    // Apply pagination
    const result = paginateProducts(filteredProducts, page, limit)

    // Return response with metadata
    return NextResponse.json({
      ...result,
      filters: {
        availableTags: Array.from(
          new Set(data.products.flatMap((p: Product) => p.tags))
        ),
        availableCategories: data.categories,
      },
    })
  } catch (error) {
    console.error('Products API Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
} 