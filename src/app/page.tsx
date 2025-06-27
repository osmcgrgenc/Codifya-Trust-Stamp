import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Video, MessageSquare, Users, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">GD</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Güven Damgası</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">Özellikler</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Fiyatlandırma</Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900">İletişim</Link>
          </nav>
          <div className="flex space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Yeni Özellik: Video Yorumları
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Müşteri Yorumlarınızı
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {' '}Güce Dönüştürün
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Freelancer'lar ve e-ticaret siteleri için müşteri yorumlarını toplamayı, 
            yönetmeyi ve web sitelerinde şık bir şekilde sergilemeyi otomatikleştiren araç.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/register">14 Gün Ücretsiz Dene</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="#demo">Demo İzle</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Neden Güven Damgası?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sosyal kanıt, online satışlarınızı artırmanın en etkili yoludur. 
            Biz bunu sizin için kolaylaştırıyoruz.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Kolay Toplama</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Benzersiz linkinizi müşterilerinize gönderin. 
                Metin veya video yorumlarını kolayca toplayın.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Video className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Video Yorumları</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                30 saniyelik video yorumları ile müşterilerinizin 
                deneyimlerini daha etkileyici bir şekilde paylaşın.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center p-6">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Şık Widget</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Tek satır kod ile web sitenize modern ve 
                kaydırılabilir yorum duvarı ekleyin.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Basit ve Şeffaf Fiyatlandırma
          </h2>
          <p className="text-xl text-gray-600">
            İhtiyacınıza göre seçin, istediğiniz zaman değiştirin
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Başlangıç Paketi</CardTitle>
              <div className="text-4xl font-bold text-gray-900">
                ₺19<span className="text-lg text-gray-500">/ay</span>
              </div>
              <CardDescription>
                Küçük işletmeler için ideal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Ayda 10 yeni yorum</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Sınırsız metin yorumu</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>5 video yorumu depolama</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Temel widget özellikleri</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full" asChild>
                <Link href="/register">Başla</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-8 border-2 border-blue-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-blue-500 text-white">Popüler</Badge>
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Profesyonel Paket</CardTitle>
              <div className="text-4xl font-bold text-gray-900">
                ₺49<span className="text-lg text-gray-500">/ay</span>
              </div>
              <CardDescription>
                Büyüyen işletmeler için
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Sınırsız yorum toplama</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Sınırsız video depolama</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Özelleştirilebilir widget</span>
              </div>
              <div className="flex items-center">
                <CheckIcon className="w-5 h-5 text-green-500 mr-3" />
                <span>Logo kaldırma</span>
              </div>
            </CardContent>
            <div className="p-6 pt-0">
              <Button className="w-full" asChild>
                <Link href="/register">Başla</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">GD</span>
                </div>
                <span className="text-xl font-bold">Güven Damgası</span>
              </div>
              <p className="text-gray-400">
                Müşteri yorumlarınızı güce dönüştürün.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Ürün</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Özellikler</Link></li>
                <li><Link href="#pricing" className="hover:text-white">Fiyatlandırma</Link></li>
                <li><Link href="/demo" className="hover:text-white">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Destek</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/help" className="hover:text-white">Yardım</Link></li>
                <li><Link href="/contact" className="hover:text-white">İletişim</Link></li>
                <li><Link href="/docs" className="hover:text-white">Dokümantasyon</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Şirket</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">Hakkımızda</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Gizlilik</Link></li>
                <li><Link href="/terms" className="hover:text-white">Kullanım Şartları</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Güven Damgası. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}
