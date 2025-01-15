export interface User {
  id: number
  email: string
  name: string
  token?: string
  phone?: string
  address?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  basePrice: number
  compareAtPrice?: number
  images: Array<{
    url: string
    alt: string
    isMain?: boolean
  }>
  size: number[]
  averageRating?: number
  totalReviews?: number
  categories?: Array<{
    id: string
    name: string
    slug: string
  }>
  tags?: string[]
} 