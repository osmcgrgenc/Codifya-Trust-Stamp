'use client'

import { useState, useCallback, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Play } from 'lucide-react'
import { useTestimonials } from '@/lib/swr'
import { OptimizedAvatar } from '@/components/ui/avatar'

// Lazy load video player
const VideoPlayer = dynamic(
  () => import('./VideoPlayer').then(mod => ({ default: mod.VideoPlayer })),
  {
    loading: () => (
      <div className='aspect-video bg-gray-200 animate-pulse rounded' />
    ),
    ssr: false,
  }
)

interface Testimonial {
  id: string
  customer_name: string
  content: string
  video_url?: string
  created_at: string
  avatar_url?: string
}

interface TestimonialWidgetProps {
  username: string
  maxTestimonials?: number
  showVideos?: boolean
}

export default function TestimonialWidget({
  username,
  maxTestimonials = 5,
  showVideos = true,
}: TestimonialWidgetProps) {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  // SWR ile veri çekme
  const { testimonials, isLoading, error } = useTestimonials(username)

  const handleVideoPlay = useCallback((videoId: string) => {
    setPlayingVideo(videoId)
  }, [])

  const handleVideoClose = useCallback(() => {
    setPlayingVideo(null)
  }, [])

  if (isLoading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-24 bg-gray-100 animate-pulse rounded' />
        ))}
      </div>
    )
  }

  if (error || testimonials.length === 0) {
    return null
  }

  // Maksimum yorum sayısını sınırla
  const limitedTestimonials = testimonials.slice(
    0,
    maxTestimonials
  ) as Testimonial[]

  return (
    <div className='space-y-4'>
      {limitedTestimonials.map((testimonial: Testimonial) => (
        <Card key={testimonial.id} className='overflow-hidden'>
          <CardContent className='p-4'>
            <div className='flex items-start space-x-3'>
              <OptimizedAvatar
                src={testimonial.avatar_url}
                alt={testimonial.customer_name}
                fallback={testimonial.customer_name.charAt(0).toUpperCase()}
              />

              <div className='flex-1 min-w-0'>
                <div className='flex items-center space-x-2 mb-2'>
                  <span className='font-semibold text-sm'>
                    {testimonial.customer_name}
                  </span>
                  <div className='flex items-center'>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className='w-3 h-3 fill-yellow-400 text-yellow-400'
                      />
                    ))}
                  </div>
                </div>

                <p className='text-sm text-gray-600 mb-3'>
                  {testimonial.content}
                </p>

                {testimonial.video_url && showVideos && (
                  <div className='relative'>
                    <button
                      onClick={() => handleVideoPlay(testimonial.id)}
                      className='flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm'
                    >
                      <Play className='w-4 h-4' />
                      <span>Video yorumunu izle</span>
                    </button>
                  </div>
                )}

                <div className='flex items-center justify-between mt-3'>
                  <Badge variant='secondary' className='text-xs'>
                    {new Date(testimonial.created_at).toLocaleDateString(
                      'tr-TR'
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {playingVideo && (
        <Suspense
          fallback={
            <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
              <div className='bg-white p-4 rounded'>Video yükleniyor...</div>
            </div>
          }
        >
          <VideoPlayer
            videoUrl={
              limitedTestimonials.find(
                (t: Testimonial) => t.id === playingVideo
              )?.video_url || ''
            }
            onClose={handleVideoClose}
          />
        </Suspense>
      )}
    </div>
  )
}
