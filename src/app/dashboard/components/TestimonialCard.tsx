'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { OptimizedAvatar } from '@/components/ui/avatar'
import { Video, Check, X } from 'lucide-react'
import { Testimonial } from '@/types/database'

interface TestimonialCardProps {
  testimonial: Testimonial
  isPending?: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}

export function TestimonialCard({ 
  testimonial, 
  isPending = false, 
  onApprove, 
  onReject 
}: TestimonialCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <OptimizedAvatar
                src={testimonial.avatar_url}
                alt={testimonial.customer_name}
                fallback={testimonial.customer_name.charAt(0).toUpperCase()}
              />
              <div>
                <p className="font-semibold">{testimonial.customer_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                </p>
              </div>
              {!isPending && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Onaylandı
                </Badge>
              )}
            </div>
            <p className="text-gray-700 mb-3">{testimonial.content}</p>
            {testimonial.video_url && (
              <div className="flex items-center space-x-2 text-blue-600">
                <Video className="w-4 h-4" />
                <span className="text-sm">Video yorumu</span>
              </div>
            )}
          </div>
          {isPending && onApprove && onReject && (
            <div className="flex space-x-2">
              <Button
                size="sm"
                onClick={() => onApprove(testimonial.id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReject(testimonial.id)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 