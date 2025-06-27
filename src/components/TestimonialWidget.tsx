'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, Play } from 'lucide-react'

interface TestimonialWidgetProps {
  username: string
  theme?: 'light' | 'dark'
  showLogo?: boolean
  maxTestimonials?: number
}

interface Testimonial {
  id: string
  customer_name: string
  content: string
  video_url?: string
  created_at: string
}

export default function TestimonialWidget({ 
  username, 
  theme = 'light', 
  showLogo = true,
  maxTestimonials = 5 
}: TestimonialWidgetProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [username])

  const fetchTestimonials = async () => {
    try {
      // Bu kısım gerçek API endpoint'iniz ile değiştirilecek
      const response = await fetch(`/api/testimonials/${username}`)
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data.testimonials.slice(0, maxTestimonials))
      } else {
        setError('Yorumlar yüklenemedi')
      }
    } catch {
      setError('Bağlantı hatası')
    } finally {
      setLoading(false)
    }
  }

  const playVideo = (videoUrl: string, testimonialId: string) => {
    setPlayingVideo(testimonialId)
  }

  const stopVideo = () => {
    setPlayingVideo(null)
  }

  if (loading) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <div className={`testimonial-widget ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="space-y-4">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.id} className={`${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className={`${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100'}`}>
                    {testimonial.customer_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {testimonial.customer_name}
                    </h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                    {testimonial.content}
                  </p>
                  
                  {testimonial.video_url && (
                    <div className="relative">
                      {playingVideo === testimonial.id ? (
                        <div className="relative">
                          <video
                            controls
                            className="w-full rounded-lg"
                            onEnded={stopVideo}
                            autoPlay
                          >
                            <source src={testimonial.video_url} type="video/webm" />
                            Tarayıcınız video oynatmayı desteklemiyor.
                          </video>
                          <button
                            onClick={stopVideo}
                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => playVideo(testimonial.video_url!, testimonial.id)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Play className="w-5 h-5 text-blue-600 ml-1" />
                          </div>
                          <span className="text-sm font-medium">Video yorumunu izle</span>
                        </button>
                      )}
                    </div>
                  )}
                  
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>
                    {new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showLogo && (
        <div className="mt-4 text-center">
          <Badge variant="outline" className="text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded"></div>
              <span>Güven Damgası ile güçlendirilmiştir</span>
            </div>
          </Badge>
        </div>
      )}
    </div>
  )
}

// X icon component
function X(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
} 