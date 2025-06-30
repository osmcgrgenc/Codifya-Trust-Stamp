'use client'

import { useDashboard } from './hooks/useDashboard'
import { DashboardHeader } from './components/DashboardHeader'
import { StatsCards } from './components/StatsCards'
import { ShareLink } from './components/ShareLink'
import { TestimonialsList } from './components/TestimonialsList'

export default function DashboardPage() {
  const {
    user,
    testimonials,
    loading,
    handleApprove,
    handleReject,
    handleLogout
  } = useDashboard()

  const copyLink = () => {
    const link = `${window.location.origin}/${user?.user_metadata?.username || 'test'}`
    navigator.clipboard.writeText(link)
  }

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
      <DashboardHeader onLogout={handleLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <StatsCards testimonials={testimonials} />
        <ShareLink username={user?.user_metadata?.username} />
        <TestimonialsList
          testimonials={testimonials}
          onApprove={handleApprove}
          onReject={handleReject}
          onCopyLink={copyLink}
        />
      </div>
    </div>
  )
} 