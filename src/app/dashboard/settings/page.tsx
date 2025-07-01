'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, User, Mail, Shield, Trash2, Save } from 'lucide-react'
import { useDashboard } from '../hooks/useDashboard'

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading } = useDashboard()
  
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    username: user?.user_metadata?.username || '',
    bio: '',
    website: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = async () => {
    // TODO: Implement save functionality
    console.log('Saving settings:', formData)
  }

  const handleDeleteAccount = () => {
    if (confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      // TODO: Implement account deletion
      console.log('Deleting account...')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-32"></div>
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-gray-200 rounded" />)}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Ayarlar</h1>
          <p className="text-gray-600">
            Hesap bilgilerinizi ve tercihlerinizi yönetin
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profil Ayarları */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profil Bilgileri
              </CardTitle>
              <CardDescription>
                Kişisel bilgilerinizi güncelleyin
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="fullName">Ad Soyad</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Adınız ve soyadınız"
                />
              </div>
              
              <div>
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="kullanici-adi"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Bu kullanıcı adı profil URL&apos;inizde kullanılacak
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Hakkımda</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Kendiniz hakkında kısa bir açıklama"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <Button onClick={handleSave} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Değişiklikleri Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Hesap Ayarları */}
          <div className="space-y-6">
            {/* Hesap Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Hesap Bilgileri
                </CardTitle>
                <CardDescription>
                  Temel hesap bilgileriniz
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>E-posta</Label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm">{user?.email}</span>
                    <Badge variant="secondary">Doğrulandı</Badge>
                  </div>
                </div>

                <div>
                  <Label>Hesap Durumu</Label>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                    <span className="text-sm">Aktif</span>
                    <Badge variant="default">Premium</Badge>
                  </div>
                </div>

                <div>
                  <Label>Kayıt Tarihi</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <span className="text-sm">
                      Bilinmiyor
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Güvenlik */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Güvenlik
                </CardTitle>
                <CardDescription>
                  Hesap güvenliğinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">
                  Şifre Değiştir
                </Button>
                <Button variant="outline" className="w-full">
                  İki Faktörlü Doğrulama
                </Button>
              </CardContent>
            </Card>

            {/* Tehlikeli Bölge */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <Trash2 className="w-5 h-5 mr-2" />
                  Tehlikeli Bölge
                </CardTitle>
                <CardDescription>
                  Bu işlemler geri alınamaz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  className="w-full"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hesabı Sil
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 