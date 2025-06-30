'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types/database'

interface User {
  id: string
  email?: string
  user_metadata?: {
    username?: string
    full_name?: string
  }
}

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const checkUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
  }, [router])

  const fetchTestimonials = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Yorumlar yüklenirken hata:', error)
    } else {
      setTestimonials(data || [])
    }
    setLoading(false)
  }, [])

  const handleApprove = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: true })
      .eq('id', id)

    if (!error) {
      fetchTestimonials()
    }
  }

  const handleReject = async (id: string) => {
    const { error } = await supabase
      .from('testimonials')
      .update({ is_approved: false })
      .eq('id', id)

    if (!error) {
      fetchTestimonials()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  useEffect(() => {
    checkUser()
    fetchTestimonials()
  }, [checkUser, fetchTestimonials])

  return {
    user,
    testimonials,
    loading,
    handleApprove,
    handleReject,
    handleLogout,
    refetchTestimonials: fetchTestimonials
  }
} 