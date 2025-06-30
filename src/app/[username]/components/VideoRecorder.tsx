'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { validateFileUpload } from '@/lib/validation'
import { Video } from 'lucide-react'

interface VideoRecorderProps {
  onVideoUpload: (videoUrl: string) => void
}

export function VideoRecorder({ onVideoUpload }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>('')

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      const recorder = new MediaRecorder(stream)
      const chunks: Blob[] = []
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }
      
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        
        try {
          const file = new File([blob], 'testimonial.webm', { type: 'video/webm' })
          validateFileUpload(file, 10 * 1024 * 1024, ['video/webm', 'video/mp4'])
          const url = await uploadVideo(blob)
          setVideoUrl(url)
          onVideoUpload(url)
        } catch (error) {
          console.error('Video validation/upload error:', error)
        }
        
        stream.getTracks().forEach(track => track.stop())
      }
      
      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
      
      // 30 saniye sonra otomatik durdur
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop()
          setIsRecording(false)
        }
      }, 30000)
      
    } catch (error) {
      console.error('Video kaydı başlatılamadı:', error)
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const uploadVideo = async (blob: Blob): Promise<string> => {
    const fileName = `testimonial-${Date.now()}.webm`
    const { error } = await supabase.storage
      .from('testimonial-videos')
      .upload(fileName, blob)

    if (error) {
      throw error
    }

    const { data: { publicUrl } } = supabase.storage
      .from('testimonial-videos')
      .getPublicUrl(fileName)

    return publicUrl
  }

  return (
    <div className="space-y-4">
      <Label>Veya 30 saniyelik video yorumu bırakın</Label>
      <div className="flex space-x-4">
        {!isRecording ? (
          <Button
            type="button"
            variant="outline"
            onClick={startVideoRecording}
            className="flex items-center"
          >
            <Video className="w-4 h-4 mr-2" />
            Video Kaydet
          </Button>
        ) : (
          <Button
            type="button"
            variant="destructive"
            onClick={stopVideoRecording}
            className="flex items-center"
          >
            <Video className="w-4 h-4 mr-2" />
            Kaydı Durdur
          </Button>
        )}
        
        {videoUrl && (
          <div className="flex items-center space-x-2 text-green-600">
            <Video className="w-4 h-4" />
            <span className="text-sm">Video yüklendi ✓</span>
          </div>
        )}
      </div>
      
      {isRecording && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            🎥 Video kaydediliyor... 30 saniye sonra otomatik olarak duracak.
          </p>
        </div>
      )}
    </div>
  )
} 