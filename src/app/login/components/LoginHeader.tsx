'use client'

import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export function LoginHeader() {
  return (
    <CardHeader className='text-center'>
      <div className='flex items-center justify-center space-x-2 mb-4 h-10'>
        <Image
          src='/logo.png'
          alt='Trustora'
          width={150}
          height={28}
          className='crop-center-sm'
        />
      </div>
      <CardTitle className='text-2xl'>Giriş Yap</CardTitle>
      <CardDescription>
        Hesabınıza erişin ve yorumlarınızı yönetin
      </CardDescription>
    </CardHeader>
  )
}
