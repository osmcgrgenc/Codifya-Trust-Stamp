import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Trustora - Müşteri Yorumları Toplama Platformu',
    template: '%s | Trustora',
  },
  description:
    "Freelancer'lar ve e-ticaret siteleri için müşteri yorumlarını toplamayı, yönetmeyi ve web sitelerinde şık bir şekilde sergilemeyi otomatikleştiren araç. Video yorumları, metin yorumları ve modern widget'lar ile sosyal kanıtınızı güçlendirin.",
  keywords: [
    'müşteri yorumları',
    'video yorumları',
    'sosyal kanıt',
    'e-ticaret',
    'freelancer',
    'widget',
    'testimonial',
    'Trustora',
    'müşteri deneyimi',
    'online satış',
  ],
  authors: [{ name: 'Trustora' }],
  creator: 'Trustora',
  publisher: 'Trustora',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://guvendamgasi.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://guvendamgasi.com',
    title: 'Trustora - Müşteri Yorumları Toplama Platformu',
    description:
      'Müşteri yorumlarınızı güce dönüştürün. Video ve metin yorumları ile sosyal kanıtınızı güçlendirin.',
    siteName: 'Trustora',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Trustora - Müşteri Yorumları Platformu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trustora - Müşteri Yorumları Toplama Platformu',
    description:
      'Müşteri yorumlarınızı güce dönüştürün. Video ve metin yorumları ile sosyal kanıtınızı güçlendirin.',
    images: ['/og-image.jpg'],
    creator: '@guvendamgasi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='tr' suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='dns-prefetch' href='https://guvendamgasi.com' />
        <link rel='dns-prefetch' href='https://api.guvendamgasi.com' />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  )
}
