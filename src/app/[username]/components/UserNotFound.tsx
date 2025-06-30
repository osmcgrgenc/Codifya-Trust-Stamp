import { Card, CardContent } from '@/components/ui/card'

export function UserNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-xl font-semibold mb-2">Kullanıcı Bulunamadı</h2>
          <p className="text-gray-600">
            Aradığınız kullanıcı mevcut değil veya hesabı kapatılmış.
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 