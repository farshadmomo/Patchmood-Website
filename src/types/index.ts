export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  images: string[]
  category: string
  tags: string[]
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string | null
  created_at: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
}
