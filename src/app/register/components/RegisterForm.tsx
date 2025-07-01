'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { registrationSchema } from '@/lib/validation'
import { useRouter } from 'next/navigation'
import { UsernameInput } from './UsernameInput'

interface RegisterFormProps {
  onSuccess: () => void
  onError: (error: string) => void
}

export function RegisterForm({ onSuccess, onError }: RegisterFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  const [checkingUsername, setCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const router = useRouter()

  const validateForm = () => {
    try {
      const result = registrationSchema.parse({ email, password, username })
      setValidationErrors({})
      return result
    } catch (error: unknown) {
      const errors: Record<string, string> = {}
      if (error && typeof error === 'object' && 'errors' in error) {
        const zodError = error as {
          errors: Array<{ path: string[]; message: string }>
        }
        zodError.errors?.forEach(err => {
          errors[err.path[0]] = err.message
        })
      }
      setValidationErrors(errors)
      return null
    }
  }

  // Username benzersizliğini kontrol et
  const checkUsername = async (value: string) => {
    setCheckingUsername(true)
    setUsernameAvailable(null)
    if (!value) {
      setCheckingUsername(false)
      return
    }
    const { data } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('username', value)
      .single()
    if (data) {
      setUsernameAvailable(false)
    } else {
      setUsernameAvailable(true)
    }
    setCheckingUsername(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    onError('')

    // Form validation
    const validatedData = validateForm()
    if (!validatedData) {
      setLoading(false)
      return
    }

    // Username benzersiz mi kontrolü
    await checkUsername(validatedData.username)
    if (usernameAvailable === false) {
      setValidationErrors({ username: 'Bu kullanıcı adı zaten alınmış.' })
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            username: validatedData.username,
          },
        },
      })

      if (error) {
        onError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.')
      } else {
        // Kullanıcı profilini oluştur
        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                display_name: validatedData.username,
                username: validatedData.username,
              },
            ])

          if (profileError) {
            onError('Profil oluşturulurken hata oluştu.')
          }
        }
        onSuccess()
        setTimeout(() => {
          router.push('/dashboard')
        }, 1200)
      }
    } catch {
      onError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleRegister} className='space-y-4'>
      <UsernameInput
        username={username}
        onChange={value => {
          setUsername(value)
          setUsernameAvailable(null)
          setValidationErrors(prev => ({ ...prev, username: '' }))
        }}
        onCheck={checkUsername}
        checkingUsername={checkingUsername}
        usernameAvailable={usernameAvailable}
        validationError={validationErrors.username}
      />

      <div className='space-y-2'>
        <Label htmlFor='email'>E-posta</Label>
        <Input
          id='email'
          type='email'
          placeholder='ornek@email.com'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={validationErrors.email ? 'border-red-500' : ''}
        />
        {validationErrors.email && (
          <p className='text-red-500 text-sm'>{validationErrors.email}</p>
        )}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Şifre</Label>
        <div className='relative'>
          <Input
            id='password'
            type={showPassword ? 'text' : 'password'}
            placeholder='En az 8 karakter'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={validationErrors.password ? 'border-red-500' : ''}
          />
          <button
            type='button'
            tabIndex={-1}
            className='absolute right-2 top-2 text-gray-500 hover:text-gray-700'
            onClick={() => setShowPassword(v => !v)}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.364-2.364A9.956 9.956 0 0022 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.636-1.364'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.828-2.828A9.956 9.956 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.896-4.21 2.343-5.657'
                />
              </svg>
            )}
          </button>
        </div>
        {validationErrors.password && (
          <p className='text-red-500 text-sm'>{validationErrors.password}</p>
        )}
      </div>

      <Button type='submit' className='w-full' disabled={loading}>
        {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
      </Button>
    </form>
  )
}
