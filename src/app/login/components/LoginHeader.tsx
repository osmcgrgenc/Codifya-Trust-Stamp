'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function LoginHeader() {
  return (
    <CardHeader className='text-center'>
      <div className='flex items-center justify-center space-x-2 mb-4'>
        <div className='w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center'>
          <span className='text-white font-bold text-sm'>GD</span>
        </div>
        <span className='text-xl font-bold text-gray-900'>Trustora</span>
      </div>
      <CardTitle className='text-2xl'>Giriş Yap</CardTitle>
      <CardDescription>
        Hesabınıza erişin ve yorumlarınızı yönetin
      </CardDescription>
    </CardHeader>
  )
}
