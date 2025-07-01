'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Video, Square, RotateCcw } from 'lucide-react'

interface VideoRecorderProps {
  onVideoRecorded: (blob: Blob) => void
  onCancel: () => void
}

export function VideoRecorder({ onVideoRecorded, onCancel }: VideoRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: true 
      })
      
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      })
      
      const chunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        setRecordedBlob(blob)
        setIsRecording(false)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      
      // Start countdown
      let countdown = 30
      setTimeLeft(countdown)
      
      timerRef.current = setInterval(() => {
        countdown--
        setTimeLeft(countdown)
        
        if (countdown <= 0) {
          if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop()
            if (timerRef.current) {
              clearInterval(timerRef.current)
            }
          }
        }
      }, 1000)
      
    } catch (error) {
      console.error('Video kaydı başlatılamadı:', error)
      alert('Kamera erişimi sağlanamadı. Lütfen kamera iznini kontrol edin.')
    }
  }, [isRecording])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRecording])

  const retakeVideo = useCallback(() => {
    setRecordedBlob(null)
    setTimeLeft(30)
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }, [])

  const saveVideo = useCallback(() => {
    if (recordedBlob) {
      onVideoRecorded(recordedBlob)
    }
  }, [recordedBlob, onVideoRecorded])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Video Yorumu Kaydet</h3>
        <p className="text-sm text-gray-600 mb-4">
          Maksimum 30 saniye video kaydı yapabilirsiniz
        </p>
      </div>

      {!recordedBlob ? (
        <div className="space-y-4">
          <div className="relative bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
            {isRecording ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Square className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-semibold text-red-600">
                  Kayıt: {timeLeft} saniye
                </p>
              </div>
            ) : (
              <div className="text-center">
                <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Kamera hazır</p>
              </div>
            )}
          </div>
          
          <div className="flex justify-center space-x-4">
            {!isRecording ? (
              <Button onClick={startRecording} className="bg-red-600 hover:bg-red-700">
                <Video className="w-4 h-4 mr-2" />
                Kayda Başla
              </Button>
            ) : (
              <Button onClick={stopRecording} variant="outline">
                <Square className="w-4 h-4 mr-2" />
                Kaydı Durdur
              </Button>
            )}
            <Button onClick={onCancel} variant="outline">
              İptal
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <video 
            src={URL.createObjectURL(recordedBlob)} 
            controls 
            className="w-full rounded-lg"
            preload="metadata"
          />
          
          <div className="flex justify-center space-x-4">
            <Button onClick={saveVideo} className="bg-green-600 hover:bg-green-700">
              Videoyu Kaydet
            </Button>
            <Button onClick={retakeVideo} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              Yeniden Çek
            </Button>
            <Button onClick={onCancel} variant="outline">
              İptal
            </Button>
          </div>
        </div>
      )}
    </div>
  )
} 