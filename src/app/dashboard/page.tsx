'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { useDashboard } from './hooks/useDashboard'

// Lazy load components
const DashboardHeader = dynamic(
  () =>
    import('./components/DashboardHeader').then(mod => ({
      default: mod.DashboardHeader,
    })),
  {
    loading: () => <div className='h-16 bg-gray-100 animate-pulse rounded' />,
  }
)

const StatsCards = dynamic(
  () =>
    import('./components/StatsCards').then(mod => ({
      default: mod.StatsCards,
    })),
  {
    loading: () => (
      <div className='grid md:grid-cols-3 gap-6 mb-8'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-32 bg-gray-100 animate-pulse rounded' />
        ))}
      </div>
    ),
  }
)

const TestimonialsList = dynamic(
  () =>
    import('./components/TestimonialsList').then(mod => ({
      default: mod.TestimonialsList,
    })),
  {
    loading: () => (
      <div className='space-y-4'>
        {[1, 2, 3].map(i => (
          <div key={i} className='h-24 bg-gray-100 animate-pulse rounded' />
        ))}
      </div>
    ),
  }
)

const ShareLink = dynamic(
  () =>
    import('./components/ShareLink').then(mod => ({ default: mod.ShareLink })),
  {
    loading: () => <div className='h-12 bg-gray-100 animate-pulse rounded' />,
  }
)

export default function DashboardPage() {
  const {
    user,
    testimonials,
    loading,
    error,
    handleApprove,
    handleReject,
    handleLogout,
  } = useDashboard()

  const copyLink = () => {
    const link = `${window.location.origin}/${user?.user_metadata?.username || 'test'}`
    navigator.clipboard.writeText(link)
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50'>
        <div className='container mx-auto px-4 py-8'>
          <div className='animate-pulse space-y-6'>
            <div className='h-16 bg-gray-200 rounded'></div>
            <div className='grid md:grid-cols-3 gap-6'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-32 bg-gray-200 rounded' />
              ))}
            </div>
            <div className='space-y-4'>
              {[1, 2, 3].map(i => (
                <div key={i} className='h-24 bg-gray-200 rounded' />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>Hata</h1>
          <p className='text-gray-600'>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Suspense fallback={<div className='h-16 bg-gray-100 animate-pulse' />}>
        <DashboardHeader onLogout={handleLogout} />
      </Suspense>

      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Hoş geldin, {user?.user_metadata?.full_name || user?.email}
          </h1>
          <p className='text-gray-600'>
            Müşteri yorumlarınızı yönetin ve performansınızı takip edin
          </p>
        </div>

        <Suspense
          fallback={
            <div className='grid md:grid-cols-3 gap-6 mb-8'>
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className='h-32 bg-gray-100 animate-pulse rounded'
                />
              ))}
            </div>
          }
        >
          <StatsCards testimonials={testimonials} />
        </Suspense>

        <div className='grid lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2'>
            <Suspense
              fallback={
                <div className='space-y-4'>
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className='h-24 bg-gray-100 animate-pulse rounded'
                    />
                  ))}
                </div>
              }
            >
              <TestimonialsList
                testimonials={testimonials}
                onApprove={handleApprove}
                onReject={handleReject}
                onCopyLink={copyLink}
              />
            </Suspense>
          </div>

          <div className='space-y-6'>
            <Suspense
              fallback={
                <div className='h-12 bg-gray-100 animate-pulse rounded' />
              }
            >
              <ShareLink username={user?.user_metadata?.username || ''} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
