# Güven Damgası (Trust Stamp)

Freelancer'lar ve küçük e-ticaret siteleri için müşteri yorumlarını (testimonial) video veya metin olarak toplamayı, yönetmeyi ve web sitelerinde şık bir şekilde sergilemeyi otomatikleştiren bir araç.

## 🚀 Özellikler

- **Kolay Toplama**: Benzersiz link ile müşteri yorumlarını toplayın
- **Video Yorumları**: 30 saniyelik video yorumları ile daha etkileyici deneyimler
- **Yönetim Paneli**: Yorumları onaylayın veya reddedin
- **Gömülebilir Widget**: Tek satır kod ile web sitenize modern yorum duvarı ekleyin
- **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm

## 🛠️ Teknoloji Yığını

- **Frontend/Backend**: Next.js 14 (App Router)
- **Veritabanı & Auth**: Supabase
- **Ödemeler**: Stripe
- **UI**: Tailwind CSS + shadcn/ui
- **Dil**: TypeScript

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

`.env.local` dosyasını düzenleyin:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
```

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

6. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

## 🎯 Kullanım

### Kullanıcı Kaydı ve Giriş
- `/register` - Yeni hesap oluşturma
- `/login` - Giriş yapma
- `/dashboard` - Yönetim paneli

### Yorum Toplama
- `/{username}` - Müşterilerin yorum bırakabileceği sayfa
- Metin ve video yorumları desteklenir
- 30 saniyelik otomatik video kaydı

### Widget Entegrasyonu
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

## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Stripe](https://stripe.com/) - Ödeme işlemleri
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI bileşenleri
