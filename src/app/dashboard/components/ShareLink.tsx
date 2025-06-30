'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy } from 'lucide-react'

interface ShareLinkProps {
  username?: string
}

export function ShareLink({ username }: ShareLinkProps) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const link = `${window.location.origin}/${username || 'test'}`
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Yorum Toplama Linkiniz</CardTitle>
        <CardDescription>
          Bu linki müşterilerinize gönderin, yorumlarınızı toplayın
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2">
          <div className="flex-1 p-3 bg-gray-100 rounded-md font-mono text-sm">
            {`${window.location.origin}/${username || 'test'}`}
          </div>
          <Button onClick={copyLink} variant="outline">
            <Copy className="w-4 h-4 mr-2" />
            {copied ? 'Kopyalandı!' : 'Kopyala'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 