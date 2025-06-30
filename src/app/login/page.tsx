'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LoginHeader } from './components/LoginHeader'
import { LoginForm } from './components/LoginForm'
import { LoginFooter } from './components/LoginFooter'
import { SuccessMessage } from './components/SuccessMessage'

export default function LoginPage() {
  const [success, setSuccess] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <LoginHeader />
        <CardContent>
          <LoginForm onSuccess={() => setSuccess(true)} />
          <SuccessMessage show={success} />
          <LoginFooter />
        </CardContent>
      </Card>
    </div>
  )
} 