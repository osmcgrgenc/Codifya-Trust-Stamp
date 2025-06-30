import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { UserProfile } from '../types'

export function useUserProfile(username: string) {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    setUserProfile(null)

    supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single()
      .then(({ data, error }) => {
        if (!isMounted) return
        if (error) {
          setError(error.message)
        } else {
          setUserProfile(data)
        }
        setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [username])

  return { userProfile, loading, error }
} 