'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Copy } from 'lucide-react'
import { Testimonial } from '@/types/database'
import { TestimonialCard } from './TestimonialCard'

interface TestimonialsListProps {
  testimonials: Testimonial[]
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onCopyLink: () => void
}

export function TestimonialsList({ 
  testimonials, 
  onApprove, 
  onReject, 
  onCopyLink 
}: TestimonialsListProps) {
  const approvedTestimonials = testimonials.filter(t => t.is_approved)
  const pendingTestimonials = testimonials.filter(t => !t.is_approved)

  if (testimonials.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
          <p className="text-gray-600 mb-4">
            Müşterilerinizden yorum toplamaya başlamak için linkinizi paylaşın
          </p>
          <Button onClick={onCopyLink}>
            <Copy className="w-4 h-4 mr-2" />
            Linki Kopyala
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Yorumlar</h2>
      
      {pendingTestimonials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-600">Bekleyen Yorumlar</h3>
          {pendingTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isPending={true}
              onApprove={onApprove}
              onReject={onReject}
            />
          ))}
        </div>
      )}

      {approvedTestimonials.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-600">Onaylanan Yorumlar</h3>
          {approvedTestimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              testimonial={testimonial}
              isPending={false}
            />
          ))}
        </div>
      )}
    </div>
  )
} 