'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RegisterHeader } from './components/RegisterHeader'
import { RegisterForm } from './components/RegisterForm'
import { RegisterFooter } from './components/RegisterFooter'
import { SuccessMessage } from './components/SuccessMessage'
import { ErrorMessage } from './components/ErrorMessage'

export default function RegisterPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <RegisterHeader />
        <CardContent>
          <RegisterForm
            onSuccess={() => setSuccess(true)}
            onError={error => setError(error)}
          />
          <ErrorMessage error={error} />
          <SuccessMessage show={success} />
          <RegisterFooter />
        </CardContent>
      </Card>
    </div>
  )
}
