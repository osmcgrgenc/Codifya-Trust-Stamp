type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
  environment: string
}

class Logger {
  private isProduction = process.env.NODE_ENV === 'production'

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown
  ): LogEntry {
    return {
      level,
      message,
      data: this.sanitizeData(data),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    }
  }

  private sanitizeData(data: unknown): unknown {
    if (!data) return data

    // Production'da hassas verileri gizle
    if (this.isProduction && typeof data === 'object') {
      const sanitized = { ...data } as Record<string, unknown>

      // Hassas alanları gizle
      const sensitiveFields = [
        'password',
        'token',
        'secret',
        'key',
        'authorization',
        'cookie',
        'session',
        'email',
        'phone',
        'address',
      ]

      for (const field of sensitiveFields) {
        if (field in sanitized) {
          sanitized[field] = '[REDACTED]'
        }
      }

      return sanitized
    }

    return data
  }

  error(message: string, data?: unknown): void {
    const entry = this.createLogEntry('error', message, data)

    if (this.isProduction) {
      // Production'da structured logging
      console.error(JSON.stringify(entry))
    } else {
      // Development'ta readable logging
      console.error(`[ERROR] ${message}`, data)
    }
  }

  warn(message: string, data?: unknown): void {
    const entry = this.createLogEntry('warn', message, data)

    if (this.isProduction) {
      console.warn(JSON.stringify(entry))
    } else {
      console.warn(`[WARN] ${message}`, data)
    }
  }

  info(message: string, data?: unknown): void {
    const entry = this.createLogEntry('info', message, data)

    if (this.isProduction) {
      console.info(JSON.stringify(entry))
    } else {
      console.info(`[INFO] ${message}`, data)
    }
  }

  debug(message: string, data?: unknown): void {
    // Production'da debug logları gösterme
    if (this.isProduction) return

    this.createLogEntry('debug', message, data)
    console.debug(`[DEBUG] ${message}`, data)
  }
}

export const logger = new Logger()
