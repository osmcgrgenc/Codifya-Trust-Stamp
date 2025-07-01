import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { UserProfile } from '../types'

interface SuccessMessageProps {
  userProfile: UserProfile
  onReset: () => void
}

export function SuccessMessage({ userProfile, onReset }: SuccessMessageProps) {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md text-center'>
        <CardContent className='p-8'>
          <div className='text-6xl mb-4'>🎉</div>
          <h2 className='text-xl font-semibold mb-2'>Teşekkürler!</h2>
          <p className='text-gray-600 mb-4'>
            Yorumunuz başarıyla gönderildi. {userProfile.display_name}{' '}
            tarafından onaylandıktan sonra yayınlanacak.
          </p>
          <Button onClick={onReset}>Başka Bir Yorum Bırak</Button>
        </CardContent>
      </Card>
    </div>
  )
}
