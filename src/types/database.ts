export interface User {
  id: string
  email: string
  username: string
  created_at: string
  subscription_tier: 'free' | 'starter' | 'professional'
  stripe_customer_id?: string
}

export interface Testimonial {
  id: string
  user_id: string
  customer_name: string
  content: string
  video_url?: string
  is_approved: boolean
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  display_name: string
  bio?: string
  website_url?: string
  avatar_url?: string
  created_at: string
} 