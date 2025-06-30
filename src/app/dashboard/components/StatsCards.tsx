'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Check, X } from 'lucide-react'
import { Testimonial } from '@/types/database'

interface StatsCardsProps {
  testimonials: Testimonial[]
}

export function StatsCards({ testimonials }: StatsCardsProps) {
  const approvedTestimonials = testimonials.filter(t => t.is_approved)
  const pendingTestimonials = testimonials.filter(t => !t.is_approved)

  return (
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
  )
} 