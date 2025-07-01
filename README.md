# Güven Damgası (Trust Stamp)

Freelancer'lar ve küçük e-ticaret siteleri için müşteri yorumlarını (testimonial) video veya metin olarak toplamayı, yönetmeyi ve web sitelerinde şık bir şekilde sergilemeyi otomatikleştiren modern bir SaaS platformu.

## 🎯 Proje Hakkında

Güven Damgası, işletmelerin müşteri yorumlarını etkili bir şekilde toplamasını ve sergilemesini sağlayan kapsamlı bir çözümdür. Video yorumları, modern widget'lar ve güçlü yönetim araçları ile sosyal kanıtınızı güçlendirin.

## 🚀 Özellikler

### 📝 Yorum Toplama
- **Kolay Toplama**: Benzersiz link ile müşteri yorumlarını toplayın
- **Video Yorumları**: 30 saniyelik video yorumları ile daha etkileyici deneyimler
- **Metin Yorumları**: Hızlı ve kolay metin yorumları
- **Real-time Kontroller**: Username benzersizlik kontrolü

### 🎛️ Yönetim ve Kontrol
- **Dashboard**: Kapsamlı yönetim paneli
- **Yorum Onaylama**: Yorumları onaylayın veya reddedin
- **İstatistikler**: Görüntüleme ve yorum sayıları
- **Ayarlar Sayfası**: Hesap ve profil yönetimi

### 🌐 Entegrasyon
- **Gömülebilir Widget**: Tek satır kod ile web sitenize modern yorum duvarı ekleyin
- **API Desteği**: RESTful API ile entegrasyon
- **SWR Cache**: Otomatik veri güncelleme ve cache
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm

### 🛡️ Güvenlik ve Performans
- **Rate Limiting**: API endpoint'leri için rate limiting
- **Input Validation**: Zod ile form validasyonu
- **CSP Protection**: Content Security Policy
- **SEO Optimizasyonu**: Meta tags, OpenGraph, Twitter Cards
- **Performance**: Lazy loading, code splitting, font optimizasyonu

## 🛠️ Teknoloji Yığını

### 🎨 Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **State Management**: SWR (React Hooks)
- **Icons**: Lucide React

### 🔧 Backend & Veritabanı
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage (video dosyaları)
- **Payments**: Stripe

### 🚀 Performans & Güvenlik
- **Caching**: SWR + Next.js Cache
- **Rate Limiting**: Upstash Redis
- **Validation**: Zod
- **Security**: CSP, Bot Protection, Input Sanitization
- **SEO**: Next.js Metadata API

### 🛠️ Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Environment**: dotenv

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/your-username/trust-stamp.git
cd trust-stamp
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment değişkenlerini ayarlayın:
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin (detaylar için .env.example dosyasına bakın)

4. Supabase veritabanını kurun:
   - Supabase projesi oluşturun
   - Aşağıdaki tabloları oluşturun:

```sql
-- Kullanıcı profilleri tablosu
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  website_url TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Yorumlar tablosu
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  content TEXT NOT NULL,
  video_url TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) politikaları
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Kullanıcı profilleri için politikalar
CREATE POLICY "Users can view all profiles" ON user_profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Yorumlar için politikalar
CREATE POLICY "Users can view approved testimonials" ON testimonials
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Users can manage own testimonials" ON testimonials
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Anyone can insert testimonials" ON testimonials
  FOR INSERT WITH CHECK (true);
```

5. Supabase Storage bucket'ı oluşturun:
   - Supabase Dashboard'da Storage bölümüne gidin
   - "testimonial-videos" adında bir bucket oluşturun
   - Public access'i etkinleştirin

6. Upstash Redis kurulumu (Rate Limiting için):
   - [Upstash](https://upstash.com/) hesabı oluşturun
   - Redis database oluşturun
   - REST URL ve Token'ı .env.local'e ekleyin

7. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🔧 Environment Variables

Tüm gerekli environment değişkenleri `.env.example` dosyasında tanımlanmıştır:

### Zorunlu Değişkenler
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase proje URL'i
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonim anahtarı
- `STRIPE_SECRET_KEY`: Stripe gizli anahtarı
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe yayınlanabilir anahtarı

### Opsiyonel Değişkenler
- `UPSTASH_REDIS_REST_URL`: Upstash Redis REST URL'i (rate limiting için)
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis token'ı

## 🎯 Kullanım

### 👤 Kullanıcı Yönetimi
- **Kayıt**: `/register` - Yeni hesap oluşturma (username benzersizlik kontrolü)
- **Giriş**: `/login` - Giriş yapma (gelişmiş hata mesajları)
- **Dashboard**: `/dashboard` - Kapsamlı yönetim paneli
- **Ayarlar**: `/dashboard/settings` - Hesap ve profil yönetimi

### 📝 Yorum Toplama
- **Profil Sayfası**: `/{username}` - Müşterilerin yorum bırakabileceği sayfa
- **Video Yorumları**: 30 saniyelik otomatik video kaydı
- **Metin Yorumları**: Hızlı ve kolay metin yorumları
- **Real-time Validation**: Anlık form doğrulama

### 🌐 Widget Entegrasyonu
```html
<!-- Web sitenize ekleyin -->
<div id="testimonial-widget"></div>
<script>
  // Widget'ı yükleyin
  fetch('https://your-domain.com/api/widget/username')
    .then(response => response.text())
    .then(html => {
      document.getElementById('testimonial-widget').innerHTML = html;
    });
</script>
```

### 📊 Dashboard Özellikleri
- **İstatistikler**: Toplam görüntüleme ve yorum sayıları
- **Yorum Yönetimi**: Onaylama/reddetme işlemleri
- **Link Paylaşımı**: Kolay link kopyalama ve paylaşım
- **Ayarlar**: Profil bilgileri ve hesap yönetimi

## 🛡️ Güvenlik ve Performans

### 🔒 Güvenlik Özellikleri
- **Rate Limiting**: API endpoint'leri için rate limiting
- **Input Validation**: Zod ile form validasyonu
- **CSP Protection**: Content Security Policy
- **Bot Protection**: Şüpheli user agent'ları engelleme
- **Input Sanitization**: XSS koruması
- **Environment Validation**: Runtime environment kontrolü
- **Authentication**: Supabase Auth ile güvenli kimlik doğrulama

### ⚡ Performans Optimizasyonları
- **Lazy Loading**: Component'lerin ihtiyaç halinde yüklenmesi
- **Code Splitting**: Bundle boyutunun optimize edilmesi
- **SWR Cache**: Otomatik veri güncelleme ve cache
- **Font Optimization**: Display swap ve preload
- **Image Optimization**: Next.js Image component'i
- **SEO Optimization**: Meta tags, OpenGraph, Twitter Cards

## 💰 Fiyatlandırma

- **Başlangıç Paketi**: ₺19/ay
  - Ayda 10 yeni yorum
  - 5 video yorumu depolama
  - Temel widget özellikleri

- **Profesyonel Paket**: ₺49/ay
  - Sınırsız yorum toplama
  - Sınırsız video depolama
  - Özelleştirilebilir widget
  - Logo kaldırma

## 🚀 Deployment

### Vercel (Önerilen)
1. Vercel hesabı oluşturun
2. GitHub repository'nizi bağlayın
3. Environment değişkenlerini ayarlayın
4. Deploy edin

### Diğer Platformlar
- Netlify
- Railway
- DigitalOcean App Platform

## 📁 Proje Yapısı

```
src/
├── app/
│   ├── [username]/              # Testimonial toplama sayfası
│   │   ├── components/          # Modüler componentler
│   │   │   ├── TestimonialForm.tsx
│   │   │   ├── VideoRecorder.tsx
│   │   │   ├── SuccessMessage.tsx
│   │   │   └── UserNotFound.tsx
│   │   ├── hooks/              # Custom hook'lar
│   │   │   └── useUserProfile.ts
│   │   └── types.ts            # Tip tanımları
│   ├── dashboard/              # Yönetim paneli
│   │   ├── components/         # Dashboard componentleri
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatsCards.tsx
│   │   │   ├── TestimonialsList.tsx
│   │   │   ├── TestimonialCard.tsx
│   │   │   └── ShareLink.tsx
│   │   ├── settings/          # Ayarlar sayfası
│   │   │   └── page.tsx
│   │   ├── hooks/             # Dashboard hook'ları
│   │   │   └── useDashboard.ts
│   │   └── page.tsx
│   ├── login/                 # Giriş sayfası
│   │   ├── components/        # Login componentleri
│   │   └── page.tsx
│   ├── register/              # Kayıt sayfası
│   │   ├── components/        # Register componentleri
│   │   └── page.tsx
│   ├── api/                  # API route'ları
│   │   ├── testimonials/
│   │   │   └── [username]/
│   │   │       └── route.ts
│   │   └── user-profile/
│   │       └── [username]/
│   │           └── route.ts
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Ana sayfa
│   └── globals.css
├── components/               # Genel UI componentleri
│   ├── ui/                  # shadcn/ui componentleri
│   ├── TestimonialWidget.tsx
│   └── VideoPlayer.tsx
├── lib/                     # Utility fonksiyonları
│   ├── env.ts              # Environment validation
│   ├── rate-limit.ts       # Rate limiting
│   ├── validation.ts       # Zod schemas
│   ├── supabase.ts         # Supabase client
│   ├── stripe.ts           # Stripe configuration
│   └── swr.ts              # SWR configuration
├── types/                   # Global tip tanımları
│   └── database.ts
└── middleware.ts           # Security middleware
```

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- Website: [guvendamgasi.com](https://guvendamgasi.com)
- Email: info@guvendamgasi.com
- Twitter: [@guvendamgasi](https://twitter.com/guvendamgasi)

## 🚀 Son Güncellemeler

### v2.0.0 - Performans ve SEO İyileştirmeleri
- **Dashboard Settings**: Kapsamlı ayarlar sayfası eklendi
- **SWR Integration**: Otomatik veri güncelleme ve cache
- **SEO Optimization**: Meta tags, OpenGraph, Twitter Cards
- **Performance**: Lazy loading, code splitting, font optimizasyonu
- **ShareLink Component**: Modern ve responsive tasarım
- **Accessibility**: ARIA labels ve semantic HTML

### v1.0.0 - Temel Özellikler
- **User Authentication**: Supabase Auth entegrasyonu
- **Video Testimonials**: 30 saniyelik video kayıt sistemi
- **Dashboard**: Yorum yönetimi ve istatistikler
- **Widget System**: Gömülebilir testimonial widget'ları
- **Security**: Rate limiting, validation, CSP koruması

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Stripe](https://stripe.com/) - Ödeme işlemleri
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
- [Upstash](https://upstash.com/) - Redis as a Service
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [SWR](https://swr.vercel.app/) - React Hooks for data fetching
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
