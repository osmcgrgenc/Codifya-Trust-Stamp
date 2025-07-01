'use client'

import Link from 'next/link'

export function LoginFooter() {
  return (
    <div className='mt-6 text-center'>
      <p className='text-sm text-gray-600'>
        Hesabınız yok mu?{' '}
        <Link href='/register' className='text-blue-600 hover:underline'>
          Ücretsiz hesap oluşturun
        </Link>
      </p>
    </div>
  )
}
