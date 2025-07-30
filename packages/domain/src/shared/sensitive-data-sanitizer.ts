export class SensitiveDataSanitizer {
  private readonly sensitiveFields: Set<string>
  private readonly redactionText: string

  private static readonly DEFAULT_SENSITIVE_FIELDS = [
    'password',
    'token',
    'access_token',
    'refresh_token',
    'secret',
    'api_key',
    'private_key',
    'authorization',
    'auth',
    'bearer',
    'credential',
    'credentials',
    'key',
    'pass',
    'pwd',
    'security_token',
    'session_token',
    'csrf_token'
  ] as const

  constructor(
    parameters: {
      redactionText?: string
      additionalSensitiveFields?: readonly string[]
      maxDepth?: number
    } = {}
  ) {
    this.redactionText = parameters.redactionText ?? '[REDACTED]'
    this.sensitiveFields = new Set([
      ...SensitiveDataSanitizer.DEFAULT_SENSITIVE_FIELDS,
      ...(parameters.additionalSensitiveFields ?? [])
    ])
  }

  public sanitize(parameters: { data: unknown }): string {
    try {
      return JSON.stringify(parameters.data, this.createReplacerFunction(), 2)
    } catch {
      return this.sanitizeCircularSafe({ data: parameters.data })
    }
  }

  public isSensitiveField(parameters: { key: string }): boolean {
    const normalizedKey = parameters.key.toLowerCase().trim()
    return this.sensitiveFields.has(normalizedKey) || this.containsSensitivePattern({ key: normalizedKey })
  }

  public addSensitiveField(parameters: { field: string }): void {
    this.sensitiveFields.add(parameters.field.toLowerCase().trim())
  }

  public removeSensitiveField(field: string): void {
    this.sensitiveFields.delete(field.toLowerCase().trim())
  }

  private createReplacerFunction(): (key: string, value: unknown) => unknown {
    const visited = new WeakSet()
    return (key: string, value: unknown): unknown => {
      if (typeof value === 'object' && value !== null) {
        if (visited.has(value)) return '[CIRCULAR_REFERENCE]'
        visited.add(value)
      }
      if (key && this.isSensitiveField({ key })) return this.redactionText
      if (value instanceof Date) return value.toISOString()
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack
        }
      }
      return value
    }
  }

  private containsSensitivePattern(parameters: { key: string }): boolean {
    const sensitivePatterns: RegExp[] = [/password/i, /token/i, /secret/i, /key/i, /auth/i, /credential/i]
    return sensitivePatterns.some((pattern) => pattern.test(parameters.key))
  }

  private sanitizeCircularSafe(parameters: { data: unknown }): string {
    try {
      if (parameters.data === null || parameters.data === undefined) return String(parameters.data)
      if (
        typeof parameters.data === 'string' ||
        typeof parameters.data === 'number' ||
        typeof parameters.data === 'boolean'
      )
        return String(parameters.data)
      if (Array.isArray(parameters.data)) return `[Array with ${parameters.data.length} items]`
      if (typeof parameters.data === 'object') {
        const keys = Object.keys(parameters.data as Record<string, unknown>)
        const sanitizedKeys = keys.filter((key) => !this.isSensitiveField({ key }))
        return `{Object with keys: ${sanitizedKeys.join(', ')}}`
      }
      return '[UNSERIALIZABLE_DATA]'
    } catch {
      return '[SANITIZATION_ERROR]'
    }
  }
}
