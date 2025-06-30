'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UsernameInputProps {
  username: string
  onChange: (value: string) => void
  onCheck: (value: string) => void
  checkingUsername: boolean
  usernameAvailable: boolean | null
  validationError?: string
}

export function UsernameInput({
  username,
  onChange,
  onCheck,
  checkingUsername,
  usernameAvailable,
  validationError
}: UsernameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="username">Kullanıcı Adı</Label>
      <div className="relative">
        <Input
          id="username"
          type="text"
          placeholder="kullanici-adi"
          value={username}
          onChange={async (e) => {
            onChange(e.target.value)
            if (e.target.value.length >= 3) {
              onCheck(e.target.value)
            }
          }}
          required
          className={validationError ? 'border-red-500' : ''}
        />
        {checkingUsername && (
          <span className="absolute right-2 top-2 text-xs text-gray-400">Kontrol ediliyor...</span>
        )}
        {usernameAvailable === true && !validationError && (
          <span className="absolute right-2 top-2 text-xs text-green-600">Kullanılabilir ✓</span>
        )}
        {usernameAvailable === false && (
          <span className="absolute right-2 top-2 text-xs text-red-500">Kullanılamaz</span>
        )}
      </div>
      {validationError && (
        <p className="text-red-500 text-sm">{validationError}</p>
      )}
      <p className="text-sm text-gray-500">
        Bu, testimonial linkinizde kullanılacak: guvendamgasi.com/{username}
      </p>
    </div>
  )
} 