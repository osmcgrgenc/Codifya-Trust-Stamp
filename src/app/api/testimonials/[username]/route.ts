import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    // Kullanıcı profilini bul
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('user_id')
      .eq('username', params.username)
      .single()

    if (profileError || !userProfile) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      )
    }

    // Onaylanmış yorumları getir
    const { data: testimonials, error } = await supabase
      .from('testimonials')
      .select('*')
      .eq('user_id', userProfile.user_id)
      .eq('is_approved', true)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Yorumlar getirilirken hata:', error)
      return NextResponse.json(
        { error: 'Yorumlar yüklenemedi' },
        { status: 500 }
      )
    }

    return NextResponse.json({ testimonials: testimonials || [] })
  } catch (error) {
    console.error('API hatası:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 