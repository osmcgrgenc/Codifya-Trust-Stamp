'use client'

import { Button } from '@/components/ui/button'
import { Settings, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

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
        <div className='flex items-center space-x-2'>
          <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>GD</span>
          </div>
          <span className='text-xl font-bold text-gray-900'>Güven Damgası</span>
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
