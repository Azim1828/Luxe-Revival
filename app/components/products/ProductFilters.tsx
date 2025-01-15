'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface FiltersData {
  availableTags: string[]
  availableCategories: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface ProductFiltersProps {
  className?: string
}

const sortOptions = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
  { label: 'Name: Z to A', value: 'name_desc' },
]

export default function ProductFilters({ className }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<FiltersData | null>(null)

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) throw new Error('Failed to fetch filters')
        const data = await response.json()
        setFilters({
          availableTags: data.filters.availableTags,
          availableCategories: data.filters.availableCategories,
        })
      } catch (error) {
        console.error('Error fetching filters:', error)
      }
    }

    fetchFilters()
  }, [])

  const updateFilters = (type: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    const currentValues = params.getAll(type)
    
    if (currentValues.includes(value)) {
      params.delete(type)
      currentValues.filter(v => v !== value).forEach(v => params.append(type, v))
    } else {
      params.append(type, value)
    }
    
    router.push(`/products?${params.toString()}`)
  }

  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set('sort', value)
    router.push(`/products?${params.toString()}`)
  }

  if (!filters) return null

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <Select
          value={searchParams.get('sort') || 'newest'}
          onValueChange={handleSort}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={["categories", "tags"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {filters.availableCategories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={category.slug}
                    checked={searchParams.getAll('category').includes(category.slug)}
                    onCheckedChange={() => updateFilters('category', category.slug)}
                  />
                  <label
                    htmlFor={category.slug}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              {filters.availableTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={searchParams.getAll('tag').includes(tag)}
                    onCheckedChange={() => updateFilters('tag', tag)}
                  />
                  <label
                    htmlFor={tag}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
} 