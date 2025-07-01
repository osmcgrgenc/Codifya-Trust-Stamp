'use client'

interface SuccessMessageProps {
  show: boolean
}

export function SuccessMessage({ show }: SuccessMessageProps) {
  if (!show) return null

  return (
    <div className='text-green-600 text-sm bg-green-50 p-3 rounded-md'>
      Kayıt başarılı! Yönlendiriliyorsunuz...
    </div>
  )
}
