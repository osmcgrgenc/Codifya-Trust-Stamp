'use client'

import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface DashboardHeaderProps {
  onLogout: () => void
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  const router = useRouter()

  const handleSettingsClick = () => {
    router.push('/dashboard/settings')
  }

  return (
    <header className='bg-white border-b'>
      <div className='container mx-auto px-4 py-4 flex justify-between items-center'>
        <div className='flex items-center space-x-2 h-10'>
          <Image
            src='/logo.png'
            alt='Trustora'
            width={150}
            height={28}
            className='crop-center-sm'
          />
        </div>
        <div className='flex items-center space-x-4'>
          <Button variant='ghost' size='sm' onClick={handleSettingsClick}>
            <Settings className='w-4 h-4 mr-2' />
            Ayarlar
          </Button>
          <Button variant='ghost' size='sm' onClick={onLogout}>
            <LogOut className='w-4 h-4 mr-2' />
            Çıkış
          </Button>
        </div>
      </div>
    </header>
  )
}
