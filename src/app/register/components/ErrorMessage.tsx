'use client'

interface ErrorMessageProps {
  error: string
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null

  return (
    <div className='text-red-500 text-sm bg-red-50 p-3 rounded-md'>{error}</div>
  )
}
