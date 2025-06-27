'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Copy, MessageSquare, Video, Check, X, Settings, LogOut } from 'lucide-react'
import { Testimonial } from '@/types/database'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    fetchTestimonials()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
  }

  const fetchTestimonials = async () => {
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
  }

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

  const copyLink = async () => {
    const link = `${window.location.origin}/${user?.user_metadata?.username || 'test'}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const approvedTestimonials = testimonials.filter(t => t.is_approved)
  const pendingTestimonials = testimonials.filter(t => !t.is_approved)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Güven Damgası</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Yorum</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Onaylanan</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{approvedTestimonials.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
              <X className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{pendingTestimonials.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Share Link */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Yorum Toplama Linkiniz</CardTitle>
            <CardDescription>
              Bu linki müşterilerinize gönderin, yorumlarınızı toplayın
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <div className="flex-1 p-3 bg-gray-100 rounded-md font-mono text-sm">
                {`${window.location.origin}/${user?.user_metadata?.username || 'test'}`}
              </div>
              <Button onClick={copyLink} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Kopyalandı!' : 'Kopyala'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Yorumlar</h2>
          
          {pendingTestimonials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-orange-600">Bekleyen Yorumlar</h3>
              {pendingTestimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar>
                            <AvatarFallback>
                              {testimonial.customer_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.customer_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{testimonial.content}</p>
                        {testimonial.video_url && (
                          <div className="flex items-center space-x-2 text-blue-600">
                            <Video className="w-4 h-4" />
                            <span className="text-sm">Video yorumu</span>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(testimonial.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(testimonial.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {approvedTestimonials.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-green-600">Onaylanan Yorumlar</h3>
              {approvedTestimonials.map((testimonial) => (
                <Card key={testimonial.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <Avatar>
                            <AvatarFallback>
                              {testimonial.customer_name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{testimonial.customer_name}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Onaylandı
                          </Badge>
                        </div>
                        <p className="text-gray-700">{testimonial.content}</p>
                        {testimonial.video_url && (
                          <div className="flex items-center space-x-2 text-blue-600 mt-2">
                            <Video className="w-4 h-4" />
                            <span className="text-sm">Video yorumu</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {testimonials.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
                <p className="text-gray-600 mb-4">
                  Müşterilerinizden yorum toplamaya başlamak için linkinizi paylaşın
                </p>
                <Button onClick={copyLink}>
                  <Copy className="w-4 h-4 mr-2" />
                  Linki Kopyala
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 