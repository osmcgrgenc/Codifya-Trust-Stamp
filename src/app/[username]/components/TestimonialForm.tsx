'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { testimonialSchema } from '@/lib/validation'
import { Star } from 'lucide-react'
import { VideoRecorder } from './VideoRecorder'
import { UserProfile } from '../types'

interface TestimonialFormProps {
  userProfile: UserProfile
  onSuccess: () => void
}

interface TestimonialFormData {
  customer_name: string
  content: string
  video_url?: string
}

export function TestimonialForm({
  userProfile,
  onSuccess,
}: TestimonialFormProps) {
  const [form, setForm] = useState<TestimonialFormData>({
    customer_name: '',
    content: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showVideoRecorder, setShowVideoRecorder] = useState(false)

  const validateForm = () => {
    try {
      const result = testimonialSchema.parse(form)
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
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const validatedData = validateForm()
    if (!validatedData) {
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.from('testimonials').insert([
        {
          user_id: userProfile.user_id,
          customer_name: validatedData.customer_name,
          content: validatedData.content,
          video_url: validatedData.video_url,
          is_approved: false,
        },
      ])

      if (error) {
        setError(error.message)
      } else {
        onSuccess()
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVideoRecorded = useCallback(async (blob: Blob) => {
    try {
      setLoading(true)
      const fileName = `testimonial-${Date.now()}.webm`
      const { error } = await supabase.storage
        .from('testimonial-videos')
        .upload(fileName, blob)

      if (error) {
        throw error
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('testimonial-videos').getPublicUrl(fileName)

      setForm(prev => ({ ...prev, video_url: publicUrl }))
      setShowVideoRecorder(false)
    } catch (error) {
      console.error('Video upload error:', error)
      setError('Video yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }, [])

  const handleVideoCancel = useCallback(() => {
    setShowVideoRecorder(false)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-2xl'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
              <span className='text-white font-bold text-sm'>GD</span>
            </div>
            <span className='text-xl font-bold text-gray-900'>
              Güven Damgası
            </span>
          </div>
          <CardTitle className='text-2xl'>
            {userProfile.display_name} için Deneyiminizi Anlatın
          </CardTitle>
          <CardDescription>
            Deneyiminizi paylaşarak diğer müşterilere yardımcı olun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='customer_name'>Adınız</Label>
              <Input
                id='customer_name'
                type='text'
                placeholder='Adınızı girin'
                value={form.customer_name}
                onChange={e =>
                  setForm(prev => ({ ...prev, customer_name: e.target.value }))
                }
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='content'>Deneyiminiz</Label>
              <Textarea
                id='content'
                placeholder='Bu hizmet hakkında ne düşünüyorsunuz? Deneyiminizi paylaşın...'
                value={form.content}
                onChange={e =>
                  setForm(prev => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                required
              />
            </div>

            {!showVideoRecorder ? (
              <div className='space-y-2'>
                <Label>Video Yorumu (İsteğe bağlı)</Label>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setShowVideoRecorder(true)}
                  className='w-full'
                >
                  Video Yorumu Ekle
                </Button>
              </div>
            ) : (
              <VideoRecorder
                onVideoRecorded={handleVideoRecorded}
                onCancel={handleVideoCancel}
              />
            )}

            {form.video_url && (
              <div className='p-3 bg-green-50 border border-green-200 rounded-md'>
                <p className='text-green-700 text-sm'>✓ Video yorumu eklendi</p>
              </div>
            )}

            {error && (
              <div className='text-red-500 text-sm bg-red-50 p-3 rounded-md'>
                {error}
              </div>
            )}

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? 'Gönderiliyor...' : 'Yorumu Gönder'}
            </Button>
          </form>

          <div className='mt-6 p-4 bg-blue-50 rounded-md'>
            <div className='flex items-center space-x-2 mb-2'>
              <Star className='w-4 h-4 text-blue-600' />
              <span className='font-semibold text-blue-900'>
                Neden yorum bırakmalısınız?
              </span>
            </div>
            <p className='text-sm text-blue-700'>
              Yorumunuz, diğer müşterilerin doğru karar vermesine yardımcı olur
              ve hizmet sağlayıcısının gelişmesine katkıda bulunur.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
