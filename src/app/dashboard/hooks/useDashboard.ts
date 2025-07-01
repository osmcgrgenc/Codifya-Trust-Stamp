'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Testimonial } from '@/types/database'

interface User {
  id: string
  email?: string
  user_metadata?: {
    username?: string
    full_name?: string
    bio?: string
    website?: string
  }
}

export function useDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const checkUser = useCallback(async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
    } catch (err) {
      console.error('User check error:', err)
      router.push('/login')
    }
  }, [router])

  const fetchTestimonials = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Yorumlar yüklenirken hata:', error)
        setError('Yorumlar yüklenemedi')
      } else {
        setTestimonials(data || [])
        setError(null)
      }
    } catch (err) {
      console.error('Fetch testimonials error:', err)
      setError('Yorumlar yüklenemedi')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleApprove = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: true })
        .eq('id', id)

      if (error) {
        console.error('Approve error:', error)
        setError('Onaylama işlemi başarısız')
      } else {
        // Optimistic update
        setTestimonials(prev =>
          prev.map(t => (t.id === id ? { ...t, is_approved: true } : t))
        )
        setError(null)
      }
    } catch (err) {
      console.error('Approve error:', err)
      setError('Onaylama işlemi başarısız')
    }
  }, [])

  const handleReject = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_approved: false })
        .eq('id', id)

      if (error) {
        console.error('Reject error:', error)
        setError('Reddetme işlemi başarısız')
      } else {
        // Optimistic update
        setTestimonials(prev =>
          prev.map(t => (t.id === id ? { ...t, is_approved: false } : t))
        )
        setError(null)
      }
    } catch (err) {
      console.error('Reject error:', err)
      setError('Reddetme işlemi başarısız')
    }
  }, [])

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (err) {
      console.error('Logout error:', err)
    }
  }, [router])

  // Memoized computed values
  const stats = useMemo(() => {
    const approved = testimonials.filter(t => t.is_approved).length
    const pending = testimonials.filter(t => !t.is_approved).length
    const total = testimonials.length

    return { approved, pending, total }
  }, [testimonials])

  const approvedTestimonials = useMemo(
    () => testimonials.filter(t => t.is_approved),
    [testimonials]
  )

  const pendingTestimonials = useMemo(
    () => testimonials.filter(t => !t.is_approved),
    [testimonials]
  )

  useEffect(() => {
    checkUser()
  }, [checkUser])

  useEffect(() => {
    if (user) {
      fetchTestimonials()
    }
  }, [user, fetchTestimonials])

  return {
    user,
    testimonials,
    loading,
    error,
    stats,
    approvedTestimonials,
    pendingTestimonials,
    handleApprove,
    handleReject,
    handleLogout,
    refetchTestimonials: fetchTestimonials,
  }
}
