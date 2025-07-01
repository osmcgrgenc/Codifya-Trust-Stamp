'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Copy, Link, Share2, CheckCircle } from 'lucide-react'

interface ShareLinkProps {
  username?: string
}

export function ShareLink({ username }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const profileLink = `${window.location.origin}/${username || 'test'}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileLink)
      setCopied(true)
      setShowSuccess(true)
      setTimeout(() => {
        setCopied(false)
        setShowSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Link kopyalanamadı:', error)
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Güven Damgası - Müşteri Yorumları',
          text: 'Müşteri yorumlarımı görüntülemek için bu linke tıklayın:',
          url: profileLink,
        })
      } catch (error) {
        console.error('Paylaşım iptal edildi:', error)
      }
    } else {
      // Fallback: copy to clipboard
      copyLink()
    }
  }

  return (
    <Card className='overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Link className='w-5 h-5 text-blue-600' />
            </div>
            <div>
              <CardTitle className='text-lg font-semibold text-gray-900'>
                Yorum Toplama Linkiniz
              </CardTitle>
              <CardDescription className='text-sm text-gray-600 mt-1'>
                Bu linki müşterilerinize gönderin, yorumlarınızı toplayın
              </CardDescription>
            </div>
          </div>
          <Badge variant='secondary' className='bg-blue-100 text-blue-700'>
            Aktif
          </Badge>
        </div>
      </CardHeader>

      <CardContent className='space-y-4'>
        {/* Link Display */}
        <div className='relative'>
          <div className='flex items-center space-x-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm'>
            <Link className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-mono text-gray-700 truncate'>
                {profileLink}
              </p>
            </div>
          </div>

          {/* Success Animation */}
          {showSuccess && (
            <div className='absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center'>
              <div className='flex items-center space-x-2 text-green-700'>
                <CheckCircle className='w-5 h-5' />
                <span className='font-medium'>Link kopyalandı!</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
          <Button
            onClick={copyLink}
            variant='outline'
            className='w-full bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 transition-all duration-200'
            disabled={copied}
          >
            <Copy className='w-4 h-4 mr-2' />
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </Button>

          <Button
            onClick={shareLink}
            className='w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 shadow-sm hover:shadow-md'
          >
            <Share2 className='w-4 h-4 mr-2' />
            Paylaş
          </Button>
        </div>

        {/* Stats */}
        <div className='grid grid-cols-2 gap-4 pt-4 border-t border-gray-100'>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-900'>0</p>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              Toplam Görüntüleme
            </p>
          </div>
          <div className='text-center'>
            <p className='text-2xl font-bold text-gray-900'>0</p>
            <p className='text-xs text-gray-500 uppercase tracking-wide'>
              Toplam Yorum
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className='bg-blue-50 rounded-lg p-3 border border-blue-100'>
          <p className='text-xs text-blue-700'>
            💡 <strong>İpucu:</strong> Bu linki sosyal medya profillerinize,
            e-posta imzanıza veya web sitenize ekleyerek daha fazla müşteri
            yorumu toplayabilirsiniz.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
