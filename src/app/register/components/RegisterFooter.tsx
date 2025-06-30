'use client'

import Link from 'next/link'

export function RegisterFooter() {
  return (
    <>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="font-semibold text-blue-900 mb-2">14 Gün Ücretsiz Deneme</h4>
        <p className="text-sm text-blue-700">
          Kredi kartı bilgisi gerektirmez. İstediğiniz zaman iptal edebilirsiniz.
        </p>
      </div>
    </>
  )
} 