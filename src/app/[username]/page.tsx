'use client'

import { useState, useEffect } from 'react'
import { useUserProfile } from './hooks/useUserProfile'
import { TestimonialForm } from './components/TestimonialForm'
import { SuccessMessage } from './components/SuccessMessage'
import { UserNotFound } from './components/UserNotFound'

interface PageProps {
  params: Promise<{ username: string }>
}

export default function TestimonialPage({ params }: PageProps) {
  const [username, setUsername] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  // Resolve params promise
  useEffect(() => {
    params.then(resolvedParams => {
      setUsername(resolvedParams.username)
      setIsLoading(false)
    })
  }, [params])

  const { userProfile, loading, error } = useUserProfile(username)
  const [submitted, setSubmitted] = useState(false)

  if (isLoading || loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        Yükleniyor...
      </div>
    )
  }

  if (error || !userProfile) {
    return <UserNotFound />
  }

  if (submitted) {
    return (
      <SuccessMessage
        userProfile={userProfile}
        onReset={() => setSubmitted(false)}
      />
    )
  }

  return (
    <TestimonialForm
      userProfile={userProfile}
      onSuccess={() => setSubmitted(true)}
    />
  )
}
