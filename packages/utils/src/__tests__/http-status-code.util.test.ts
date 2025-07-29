import { describe, expect, it } from 'vitest'

import { HttpStatusCode } from '../http-status-code.util'

describe('HttpStatusCode', () => {
  describe('2xx Success status codes', () => {
    it('should have correct OK status code', () => {
      expect(HttpStatusCode.OK).toBe(200)
    })

    it('should have correct CREATED status code', () => {
      expect(HttpStatusCode.CREATED).toBe(201)
    })

    it('should have correct ACCEPTED status code', () => {
      expect(HttpStatusCode.ACCEPTED).toBe(202)
    })

    it('should have correct NO_CONTENT status code', () => {
      expect(HttpStatusCode.NO_CONTENT).toBe(204)
    })

    it('should include all 2xx success codes', () => {
      const successCodes = [
        HttpStatusCode.OK,
        HttpStatusCode.CREATED,
        HttpStatusCode.ACCEPTED,
        HttpStatusCode.NO_CONTENT
      ]

      for (const code of successCodes) {
        expect(code).toBeGreaterThanOrEqual(200)
        expect(code).toBeLessThan(300)
      }
    })
  })

  describe('3xx Redirection status codes', () => {
    it('should have correct MOVED_PERMANENTLY status code', () => {
      expect(HttpStatusCode.MOVED_PERMANENTLY).toBe(301)
    })

    it('should have correct FOUND status code', () => {
      expect(HttpStatusCode.FOUND).toBe(302)
    })

    it('should have correct SEE_OTHER status code', () => {
      expect(HttpStatusCode.SEE_OTHER).toBe(303)
    })

    it('should have correct NOT_MODIFIED status code', () => {
      expect(HttpStatusCode.NOT_MODIFIED).toBe(304)
    })

    it('should have correct TEMPORARY_REDIRECT status code', () => {
      expect(HttpStatusCode.TEMPORARY_REDIRECT).toBe(307)
    })

    it('should have correct PERMANENT_REDIRECT status code', () => {
      expect(HttpStatusCode.PERMANENT_REDIRECT).toBe(308)
    })

    it('should include all 3xx redirection codes', () => {
      const redirectionCodes = [
        HttpStatusCode.MOVED_PERMANENTLY,
        HttpStatusCode.FOUND,
        HttpStatusCode.SEE_OTHER,
        HttpStatusCode.NOT_MODIFIED,
        HttpStatusCode.TEMPORARY_REDIRECT,
        HttpStatusCode.PERMANENT_REDIRECT
      ]

      for (const code of redirectionCodes) {
        expect(code).toBeGreaterThanOrEqual(300)
        expect(code).toBeLessThan(400)
      }
    })
  })

  describe('4xx Client Error status codes', () => {
    it('should have correct BAD_REQUEST status code', () => {
      expect(HttpStatusCode.BAD_REQUEST).toBe(400)
    })

    it('should have correct UNAUTHORIZED status code', () => {
      expect(HttpStatusCode.UNAUTHORIZED).toBe(401)
    })

    it('should have correct FORBIDDEN status code', () => {
      expect(HttpStatusCode.FORBIDDEN).toBe(403)
    })

    it('should have correct NOT_FOUND status code', () => {
      expect(HttpStatusCode.NOT_FOUND).toBe(404)
    })

    it('should have correct METHOD_NOT_ALLOWED status code', () => {
      expect(HttpStatusCode.METHOD_NOT_ALLOWED).toBe(405)
    })

    it('should have correct NOT_ACCEPTABLE status code', () => {
      expect(HttpStatusCode.NOT_ACCEPTABLE).toBe(406)
    })

    it('should have correct REQUEST_TIMEOUT status code', () => {
      expect(HttpStatusCode.REQUEST_TIMEOUT).toBe(408)
    })

    it('should have correct CONFLICT status code', () => {
      expect(HttpStatusCode.CONFLICT).toBe(409)
    })

    it('should have correct GONE status code', () => {
      expect(HttpStatusCode.GONE).toBe(410)
    })

    it('should have correct UNPROCESSABLE_ENTITY status code', () => {
      expect(HttpStatusCode.UNPROCESSABLE_ENTITY).toBe(422)
    })

    it('should have correct TOO_MANY_REQUESTS status code', () => {
      expect(HttpStatusCode.TOO_MANY_REQUESTS).toBe(429)
    })

    it('should include all 4xx client error codes', () => {
      const clientErrorCodes = [
        HttpStatusCode.BAD_REQUEST,
        HttpStatusCode.UNAUTHORIZED,
        HttpStatusCode.FORBIDDEN,
        HttpStatusCode.NOT_FOUND,
        HttpStatusCode.METHOD_NOT_ALLOWED,
        HttpStatusCode.NOT_ACCEPTABLE,
        HttpStatusCode.REQUEST_TIMEOUT,
        HttpStatusCode.CONFLICT,
        HttpStatusCode.GONE,
        HttpStatusCode.UNPROCESSABLE_ENTITY,
        HttpStatusCode.TOO_MANY_REQUESTS
      ]

      for (const code of clientErrorCodes) {
        expect(code).toBeGreaterThanOrEqual(400)
        expect(code).toBeLessThan(500)
      }
    })
  })

  describe('5xx Server Error status codes', () => {
    it('should have correct INTERNAL_SERVER_ERROR status code', () => {
      expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500)
    })

    it('should have correct NOT_IMPLEMENTED status code', () => {
      expect(HttpStatusCode.NOT_IMPLEMENTED).toBe(501)
    })

    it('should have correct BAD_GATEWAY status code', () => {
      expect(HttpStatusCode.BAD_GATEWAY).toBe(502)
    })

    it('should have correct SERVICE_UNAVAILABLE status code', () => {
      expect(HttpStatusCode.SERVICE_UNAVAILABLE).toBe(503)
    })

    it('should have correct GATEWAY_TIMEOUT status code', () => {
      expect(HttpStatusCode.GATEWAY_TIMEOUT).toBe(504)
    })

    it('should include all 5xx server error codes', () => {
      const serverErrorCodes = [
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        HttpStatusCode.NOT_IMPLEMENTED,
        HttpStatusCode.BAD_GATEWAY,
        HttpStatusCode.SERVICE_UNAVAILABLE,
        HttpStatusCode.GATEWAY_TIMEOUT
      ]

      for (const code of serverErrorCodes) {
        expect(code).toBeGreaterThanOrEqual(500)
        expect(code).toBeLessThan(600)
      }
    })
  })

  describe('enum completeness and type safety', () => {
    it('should be a valid TypeScript enum', () => {
      // Test that HttpStatusCode is an object with the expected properties
      expect(typeof HttpStatusCode).toBe('object')
      expect(HttpStatusCode).toBeDefined()
    })

    it('should have all expected properties', () => {
      const expectedProperties = [
        // 2xx Success
        'OK',
        'CREATED',
        'ACCEPTED',
        'NO_CONTENT',
        // 3xx Redirection
        'MOVED_PERMANENTLY',
        'FOUND',
        'SEE_OTHER',
        'NOT_MODIFIED',
        'TEMPORARY_REDIRECT',
        'PERMANENT_REDIRECT',
        // 4xx Client Errors
        'BAD_REQUEST',
        'UNAUTHORIZED',
        'FORBIDDEN',
        'NOT_FOUND',
        'METHOD_NOT_ALLOWED',
        'NOT_ACCEPTABLE',
        'REQUEST_TIMEOUT',
        'CONFLICT',
        'GONE',
        'UNPROCESSABLE_ENTITY',
        'TOO_MANY_REQUESTS',
        // 5xx Server Errors
        'INTERNAL_SERVER_ERROR',
        'NOT_IMPLEMENTED',
        'BAD_GATEWAY',
        'SERVICE_UNAVAILABLE',
        'GATEWAY_TIMEOUT'
      ]

      for (const property of expectedProperties) {
        expect(HttpStatusCode).toHaveProperty(property)
        expect(typeof HttpStatusCode[property as keyof typeof HttpStatusCode]).toBe('number')
      }
    })

    it('should have unique values for all status codes', () => {
      const values = Object.values(HttpStatusCode)
      const uniqueValues = new Set(values)

      expect(values.length).toBe(uniqueValues.size)
    })

    it('should contain only valid HTTP status code numbers', () => {
      const values = Object.values(HttpStatusCode).filter((value) => typeof value === 'number')

      for (const value of values) {
        expect(typeof value).toBe('number')
        expect(value).toBeGreaterThanOrEqual(200)
        expect(value).toBeLessThan(600)
      }
    })
  })

  describe('practical usage scenarios', () => {
    it('should work in switch statements', () => {
      function getStatusMessage(status: HttpStatusCode): string {
        switch (status) {
          case HttpStatusCode.OK: {
            return 'Success'
          }
          case HttpStatusCode.NOT_FOUND: {
            return 'Resource not found'
          }
          case HttpStatusCode.INTERNAL_SERVER_ERROR: {
            return 'Server error'
          }
          default: {
            return 'Unknown status'
          }
        }
      }

      expect(getStatusMessage(HttpStatusCode.OK)).toBe('Success')
      expect(getStatusMessage(HttpStatusCode.NOT_FOUND)).toBe('Resource not found')
      expect(getStatusMessage(HttpStatusCode.INTERNAL_SERVER_ERROR)).toBe('Server error')
    })

    it('should work with conditional checks', () => {
      function isSuccessStatus(status: HttpStatusCode): boolean {
        return status >= HttpStatusCode.OK && status < HttpStatusCode.BAD_REQUEST
      }

      function isClientError(status: HttpStatusCode): boolean {
        return status >= HttpStatusCode.BAD_REQUEST && status < HttpStatusCode.INTERNAL_SERVER_ERROR
      }

      function isServerError(status: HttpStatusCode): boolean {
        return status >= HttpStatusCode.INTERNAL_SERVER_ERROR && status <= HttpStatusCode.GATEWAY_TIMEOUT
      }

      // Test success codes
      expect(isSuccessStatus(HttpStatusCode.OK)).toBe(true)
      expect(isSuccessStatus(HttpStatusCode.CREATED)).toBe(true)
      expect(isSuccessStatus(HttpStatusCode.NOT_FOUND)).toBe(false)

      // Test client error codes
      expect(isClientError(HttpStatusCode.BAD_REQUEST)).toBe(true)
      expect(isClientError(HttpStatusCode.NOT_FOUND)).toBe(true)
      expect(isClientError(HttpStatusCode.OK)).toBe(false)

      // Test server error codes
      expect(isServerError(HttpStatusCode.INTERNAL_SERVER_ERROR)).toBe(true)
      expect(isServerError(HttpStatusCode.BAD_GATEWAY)).toBe(true)
      expect(isServerError(HttpStatusCode.OK)).toBe(false)
    })

    it('should work with response object patterns', () => {
      interface ApiResponse<T> {
        status: HttpStatusCode
        data?: T
        error?: string
      }

      function createSuccessResponse<T>(data: T): ApiResponse<T> {
        return {
          status: HttpStatusCode.OK,
          data
        }
      }

      function createErrorResponse(status: HttpStatusCode, error: string): ApiResponse<never> {
        return {
          status,
          error
        }
      }

      const successResponse = createSuccessResponse({ id: 1, name: 'Test' })
      const errorResponse = createErrorResponse(HttpStatusCode.NOT_FOUND, 'User not found')

      expect(successResponse.status).toBe(200)
      expect(successResponse.data).toEqual({ id: 1, name: 'Test' })

      expect(errorResponse.status).toBe(404)
      expect(errorResponse.error).toBe('User not found')
    })

    it('should work with HTTP client configurations', () => {
      interface RequestConfig {
        expectedStatuses?: HttpStatusCode[]
        retryOnStatus?: HttpStatusCode[]
      }

      const config: RequestConfig = {
        expectedStatuses: [HttpStatusCode.OK, HttpStatusCode.CREATED, HttpStatusCode.ACCEPTED],
        retryOnStatus: [
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          HttpStatusCode.BAD_GATEWAY,
          HttpStatusCode.SERVICE_UNAVAILABLE
        ]
      }

      expect(config.expectedStatuses).toContain(200)
      expect(config.expectedStatuses).toContain(201)
      expect(config.retryOnStatus).toContain(500)
      expect(config.retryOnStatus).toContain(502)
    })
  })

  describe('edge cases and validation', () => {
    it('should handle enum values as both string keys and numeric values', () => {
      // Test accessing via string key
      expect(HttpStatusCode.OK).toBe(200)
      expect(HttpStatusCode.NOT_FOUND).toBe(404)

      // Test that numeric values match expectations
      expect(HttpStatusCode.OK).toBe(200)
      expect(HttpStatusCode.NOT_FOUND).toBe(404)
    })

    it('should work with Object methods', () => {
      const keys = Object.keys(HttpStatusCode)
      const values = Object.values(HttpStatusCode)
      const entries = Object.entries(HttpStatusCode)

      // Should have both string keys and numeric values due to enum reverse mapping
      expect(keys.length).toBeGreaterThan(0)
      expect(values.length).toBeGreaterThan(0)
      expect(entries.length).toBeGreaterThan(0)

      // Filter to only get string keys (enum names)
      const enumNames = keys.filter((key) => Number.isNaN(Number(key)))
      expect(enumNames).toContain('OK')
      expect(enumNames).toContain('NOT_FOUND')
      expect(enumNames).toContain('INTERNAL_SERVER_ERROR')
    })

    it('should maintain consistent naming convention', () => {
      const enumNames = Object.keys(HttpStatusCode).filter((key) => Number.isNaN(Number(key)))

      for (const name of enumNames) {
        // Should be UPPER_SNAKE_CASE
        expect(name).toMatch(/^[A-Z_]+$/)
        // Should not start or end with underscore
        // eslint-disable-next-line sonarjs/anchor-precedence -- test
        expect(name).not.toMatch(/^_|_$/)
        // Should not have consecutive underscores
        expect(name).not.toMatch(/__/)
      }
    })
  })
})
