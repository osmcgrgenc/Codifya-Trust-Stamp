'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { Video, MessageSquare, Star } from 'lucide-react'

interface TestimonialForm {
  customer_name: string
  content: string
  video_url?: string
}

export default function TestimonialPage({ params }: { params: { username: string } }) {
  const [form, setForm] = useState<TestimonialForm>({
    customer_name: '',
    content: ''
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  useEffect(() => {
    fetchUserProfile()
  }, [params.username])

  const fetchUserProfile = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', params.username)
      .single()

    if (error) {
      console.error('Kullanıcı profili bulunamadı:', error)
    } else {
      setUserProfile(data)
    }
  }

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        await uploadVideo(blob)
        stream.getTracks().forEach(track => track.stop())
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      
      // 30 saniye sonra otomatik durdur
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop()
          setIsRecording(false)
        }
      }, 30000)
      
    } catch (err) {
      console.error('Video kaydı başlatılamadı:', err)
      setError('Kamera erişimi sağlanamadı. Lütfen izin verdiğinizden emin olun.')
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const uploadVideo = async (blob: Blob) => {
    try {
      const fileName = `testimonial-${Date.now()}.webm`
      const { data, error } = await supabase.storage
        .from('testimonial-videos')
        .upload(fileName, blob)

      if (error) {
        throw error
      }

      const { data: { publicUrl } } = supabase.storage
        .from('testimonial-videos')
        .getPublicUrl(fileName)

      setForm(prev => ({ ...prev, video_url: publicUrl }))
    } catch (err) {
      console.error('Video yükleme hatası:', err)
      setError('Video yüklenirken bir hata oluştu.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!userProfile) {
      setError('Kullanıcı bulunamadı.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([
          {
            user_id: userProfile.user_id,
            customer_name: form.customer_name,
            content: form.content,
            video_url: form.video_url,
            is_approved: false
          }
        ])

      if (error) {
        setError(error.message)
      } else {
        setSubmitted(true)
        setForm({ customer_name: '', content: '' })
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">😕</div>
            <h2 className="text-xl font-semibold mb-2">Kullanıcı Bulunamadı</h2>
            <p className="text-gray-600">
              Aradığınız kullanıcı mevcut değil veya hesabı kapatılmış.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold mb-2">Teşekkürler!</h2>
            <p className="text-gray-600 mb-4">
              Yorumunuz başarıyla gönderildi. {userProfile.display_name} tarafından onaylandıktan sonra yayınlanacak.
            </p>
            <Button onClick={() => setSubmitted(false)}>
              Başka Bir Yorum Bırak
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Güven Damgası</span>
          </div>
          <CardTitle className="text-2xl">
            {userProfile.display_name} için Deneyiminizi Anlatın
          </CardTitle>
          <CardDescription>
            Deneyiminizi paylaşarak diğer müşterilere yardımcı olun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer_name">Adınız</Label>
              <Input
                id="customer_name"
                type="text"
                placeholder="Adınızı girin"
                value={form.customer_name}
                onChange={(e) => setForm(prev => ({ ...prev, customer_name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Deneyiminiz</Label>
              <Textarea
                id="content"
                placeholder="Bu hizmet hakkında ne düşünüyorsunuz? Deneyiminizi paylaşın..."
                value={form.content}
                onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                required
              />
            </div>

            {/* Video Recording Section */}
            <div className="space-y-4">
              <Label>Veya 30 saniyelik video yorumu bırakın</Label>
              <div className="flex space-x-4">
                {!isRecording ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={startVideoRecording}
                    className="flex items-center"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Video Kaydet
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={stopVideoRecording}
                    className="flex items-center"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Kaydı Durdur
                  </Button>
                )}
                
                {form.video_url && (
                  <div className="flex items-center space-x-2 text-green-600">
                    <Video className="w-4 h-4" />
                    <span className="text-sm">Video yüklendi ✓</span>
                  </div>
                )}
              </div>
              
              {isRecording && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-sm">
                    🎥 Video kaydediliyor... 30 saniye sonra otomatik olarak duracak.
                  </p>
                </div>
              )}
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-900">Neden yorum bırakmalısınız?</span>
            </div>
            <p className="text-sm text-blue-700">
              Yorumunuz, diğer müşterilerin doğru karar vermesine yardımcı olur ve 
              hizmet sağlayıcısının gelişmesine katkıda bulunur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 