'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        // Kullanıcı profilini oluştur
        if (data.user) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                user_id: data.user.id,
                display_name: username,
                username: username,
              }
            ])

          if (profileError) {
            console.error('Profil oluşturma hatası:', profileError)
          }
        }

        router.push('/dashboard')
      }
    } catch {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Güven Damgası</span>
          </div>
          <CardTitle className="text-2xl">Hesap Oluştur</CardTitle>
          <CardDescription>
            Müşteri yorumlarınızı yönetmeye başlayın
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                type="text"
                placeholder="kullanici-adi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <p className="text-sm text-gray-500">
                Bu, testimonial linkinizde kullanılacak: guvendamgasi.com/{username}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="En az 6 karakter"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Zaten hesabınız var mı?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Giriş yapın
              </Link>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">14 Gün Ücretsiz Deneme</h4>
            <p className="text-sm text-blue-700">
              Kredi kartı bilgisi gerektirmez. İstediğiniz zaman iptal edebilirsiniz.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 