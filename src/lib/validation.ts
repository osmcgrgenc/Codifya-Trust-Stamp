import { z } from 'zod'

// Username validation
export const usernameSchema = z
  .string()
  .min(3, 'Kullanıcı adı en az 3 karakter olmalıdır')
  .max(20, 'Kullanıcı adı en fazla 20 karakter olabilir')
  .regex(/^[a-z0-9-]+$/, 'Sadece küçük harf, rakam ve tire kullanabilirsiniz')
  .transform(val => val.toLowerCase().trim())

// Email validation
export const emailSchema = z
  .string()
  .email('Geçerli bir e-posta adresi giriniz')
  .transform(val => val.toLowerCase().trim())

// Password validation
export const passwordSchema = z
  .string()
  .min(8, 'Şifre en az 8 karakter olmalıdır')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Şifre en az bir büyük harf, bir küçük harf ve bir rakam içermelidir'
  )

// Testimonial validation
export const testimonialSchema = z.object({
  customer_name: z
    .string()
    .min(2, 'İsim en az 2 karakter olmalıdır')
    .max(50, 'İsim en fazla 50 karakter olabilir')
    .transform(val => val.trim().replace(/[<>]/g, '')), // XSS koruması

  content: z
    .string()
    .min(10, 'Yorum en az 10 karakter olmalıdır')
    .max(1000, 'Yorum en fazla 1000 karakter olabilir')
    .transform(val => val.trim().replace(/[<>]/g, '')), // XSS koruması

  video_url: z.string().url("Geçerli bir video URL'si giriniz").optional(),
})

// Registration form validation
export const registrationSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
})

// Login form validation
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Şifre gereklidir'),
})

// Sanitize HTML content
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
}

// Validate file upload
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB
  allowedTypes: z.array(z.string()).default(['video/webm', 'video/mp4']),
})

export function validateFileUpload(
  file: File,
  maxSize = 10 * 1024 * 1024,
  allowedTypes = ['video/webm', 'video/mp4']
) {
  if (file.size > maxSize) {
    throw new Error('Dosya boyutu çok büyük')
  }

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Desteklenmeyen dosya türü')
  }

  return true
}
