import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params

    if (!username) {
      return new NextResponse('Username gerekli', { status: 400 })
    }

    // Kullanıcı profilini al
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (profileError || !profile) {
      return new NextResponse('Kullanıcı bulunamadı', { status: 404 })
    }

    // Onaylanmış testimonial'ları al
    const { data: testimonials, error: testimonialsError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (testimonialsError) {
      console.error('Testimonial fetch error:', testimonialsError)
      return new NextResponse("Testimonial'lar alınamadı", { status: 500 })
    }

    // HTML widget oluştur
    const widgetHTML = generateWidgetHTML(profile, testimonials || [])

    return new NextResponse(widgetHTML, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300', // 5 dakika cache
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Widget API error:', error)
    return new NextResponse('Sunucu hatası', { status: 500 })
  }
}

interface Profile {
  user_id: string
  display_name: string
  username: string
  bio?: string
  website_url?: string
  avatar_url?: string
}

interface Testimonial {
  id: string
  user_id: string
  customer_name: string
  content: string
  video_url?: string
  is_approved: boolean
  created_at: string
}

function generateWidgetHTML(profile: Profile, testimonials: Testimonial[]) {
  const hasTestimonials = testimonials.length > 0

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.display_name} - Müşteri Yorumları</title>
    <style>
        .testimonial-widget {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 100%;
            margin: 0 auto;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 24px;
            color: white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .widget-header {
            text-align: center;
            margin-bottom: 24px;
        }
        
        .widget-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 8px 0;
            color: white;
        }
        
        .widget-subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
        }
        
        .testimonials-container {
            max-height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.3) transparent;
        }
        
        .testimonials-container::-webkit-scrollbar {
            width: 6px;
        }
        
        .testimonials-container::-webkit-scrollbar-track {
            background: transparent;
        }
        
        .testimonials-container::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
        }
        
        .testimonial-item {
            background: rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
        }
        
        .testimonial-content {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 12px;
            font-style: italic;
        }
        
        .testimonial-author {
            font-size: 12px;
            font-weight: 600;
            opacity: 0.9;
        }
        
        .testimonial-date {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }
        
        .video-testimonial {
            margin-top: 12px;
        }
        
        .video-testimonial video {
            width: 100%;
            border-radius: 6px;
            background: #000;
        }
        
        .no-testimonials {
            text-align: center;
            padding: 32px 16px;
            opacity: 0.8;
        }
        
        .widget-footer {
            text-align: center;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 11px;
            opacity: 0.7;
        }
        
        .widget-footer a {
            color: white;
            text-decoration: none;
        }
        
        .widget-footer a:hover {
            text-decoration: underline;
        }
        
        @media (max-width: 480px) {
            .testimonial-widget {
                padding: 16px;
                border-radius: 8px;
            }
            
            .widget-title {
                font-size: 20px;
            }
            
            .testimonial-item {
                padding: 12px;
            }
        }
    </style>
</head>
<body>
    <div class="testimonial-widget">
        <div class="widget-header">
            <h2 class="widget-title">${profile.display_name}</h2>
            <p class="widget-subtitle">Müşteri Yorumları</p>
        </div>
        
        <div class="testimonials-container">
            ${
              hasTestimonials
                ? testimonials
                    .map(
                      testimonial => `
                <div class="testimonial-item">
                    <div class="testimonial-content">
                        "${testimonial.content}"
                    </div>
                    <div class="testimonial-author">
                        — ${testimonial.customer_name}
                    </div>
                    <div class="testimonial-date">
                        ${new Date(testimonial.created_at).toLocaleDateString('tr-TR')}
                    </div>
                    ${
                      testimonial.video_url
                        ? `
                        <div class="video-testimonial">
                            <video controls preload="metadata">
                                <source src="${testimonial.video_url}" type="video/mp4">
                                Video oynatılamıyor.
                            </video>
                        </div>
                    `
                        : ''
                    }
                </div>
            `
                    )
                    .join('')
                : `
                <div class="no-testimonials">
                    <p>Henüz yorum bulunmuyor.</p>
                    <p>İlk yorumu siz bırakın!</p>
                </div>
            `
            }
        </div>
        
        <div class="widget-footer">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://guvendamgasi.com'}/${profile.username}" target="_blank">
                Yorum bırak →
            </a>
        </div>
    </div>
</body>
</html>
  `.trim()
}

// OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
