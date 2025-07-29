import { describe, expect, it } from 'vitest'

import { cn } from '../cn.util'
import { Failure, failure, Success, success } from '../either.util'
import { HttpStatusCode } from '../http-status-code.util'
import * as Utils from '../index'

describe('Utils Package Index', () => {
  describe('exports verification', () => {
    it('should export all utilities from cn.util', () => {
      expect(Utils.cn).toBeDefined()
      expect(typeof Utils.cn).toBe('function')
      expect(Utils.cn).toBe(cn)
    })

    it('should export all utilities from either.util', () => {
      expect(Utils.Failure).toBeDefined()
      expect(Utils.Success).toBeDefined()
      expect(Utils.failure).toBeDefined()
      expect(Utils.success).toBeDefined()

      expect(Utils.Failure).toBe(Failure)
      expect(Utils.Success).toBe(Success)
      expect(Utils.failure).toBe(failure)
      expect(Utils.success).toBe(success)

      expect(typeof Utils.failure).toBe('function')
      expect(typeof Utils.success).toBe('function')
    })

    it('should export all utilities from http-status-code.util', () => {
      expect(Utils.HttpStatusCode).toBeDefined()
      expect(typeof Utils.HttpStatusCode).toBe('object')
      expect(Utils.HttpStatusCode).toBe(HttpStatusCode)
    })

    it('should not export any unexpected properties', () => {
      const expectedExports = [
        // From cn.util
        'cn',
        // From either.util
        'Failure',
        'Success',
        'failure',
        'success',
        // From http-status-code.util
        'HttpStatusCode'
      ]

      const actualExports = Object.keys(Utils)

      // Check that all expected exports are present
      for (const exportName of expectedExports) {
        expect(actualExports).toContain(exportName)
      }

      // Check that no unexpected exports are present
      for (const exportName of actualExports) {
        expect(expectedExports).toContain(exportName)
      }

      expect(actualExports.length).toBe(expectedExports.length)
    })
  })

  describe('integration scenarios', () => {
    it('should work with cn and HttpStatusCode together', () => {
      function getStatusClasses(status: Utils.HttpStatusCode): string {
        return Utils.cn('status-badge', {
          'text-green-500 bg-green-100': status === Utils.HttpStatusCode.OK,
          'text-red-500 bg-red-100': status >= Utils.HttpStatusCode.BAD_REQUEST,
          'text-yellow-500 bg-yellow-100':
            status >= Utils.HttpStatusCode.MOVED_PERMANENTLY && status < Utils.HttpStatusCode.BAD_REQUEST
        })
      }

      expect(getStatusClasses(Utils.HttpStatusCode.OK)).toBe('status-badge text-green-500 bg-green-100')

      expect(getStatusClasses(Utils.HttpStatusCode.NOT_FOUND)).toBe('status-badge text-red-500 bg-red-100')

      expect(getStatusClasses(Utils.HttpStatusCode.MOVED_PERMANENTLY)).toBe(
        'status-badge text-yellow-500 bg-yellow-100'
      )
    })

    it('should work with Either and HttpStatusCode together', () => {
      interface ApiError {
        status: Utils.HttpStatusCode
        message: string
      }

      interface ApiSuccess<T> {
        status: Utils.HttpStatusCode
        data: T
      }

      function makeApiCall<T>(shouldSucceed: boolean, data?: T): Utils.Either<ApiError, ApiSuccess<T>> {
        if (shouldSucceed && data) {
          return Utils.success({
            status: Utils.HttpStatusCode.OK,
            data
          })
        }

        return Utils.failure({
          status: Utils.HttpStatusCode.INTERNAL_SERVER_ERROR,
          message: 'Something went wrong'
        })
      }

      const successResult = makeApiCall(true, { id: 1, name: 'Test' })
      const errorResult = makeApiCall(false)

      expect(successResult.isSuccess()).toBe(true)
      expect(errorResult.isFailure()).toBe(true)

      if (successResult.isSuccess()) {
        expect(successResult.value.status).toBe(Utils.HttpStatusCode.OK)
        expect(successResult.value.data).toEqual({ id: 1, name: 'Test' })
      }

      if (errorResult.isFailure()) {
        expect(errorResult.value.status).toBe(Utils.HttpStatusCode.INTERNAL_SERVER_ERROR)
        expect(errorResult.value.message).toBe('Something went wrong')
      }
    })

    it('should work with all utilities together in a complex scenario', () => {
      interface User {
        id: number
        name: string
        email: string
        role: 'admin' | 'user'
      }

      interface ValidationError {
        field: string
        message: string
        code: Utils.HttpStatusCode
      }

      function validateAndStyleUser(
        userData: Partial<User>
      ): Utils.Either<ValidationError[], { user: User; className: string }> {
        const errors: ValidationError[] = []

        // Validation
        if (!userData.id || userData.id <= 0) {
          errors.push({
            field: 'id',
            message: 'Invalid user ID',
            code: Utils.HttpStatusCode.BAD_REQUEST
          })
        }

        if (!userData.name || userData.name.trim().length === 0) {
          errors.push({
            field: 'name',
            message: 'Name is required',
            code: Utils.HttpStatusCode.BAD_REQUEST
          })
        }

        if (!userData.email?.includes('@')) {
          errors.push({
            field: 'email',
            message: 'Valid email is required',
            code: Utils.HttpStatusCode.BAD_REQUEST
          })
        }

        if (!userData.role || !['admin', 'user'].includes(userData.role)) {
          errors.push({
            field: 'role',
            message: 'Role must be admin or user',
            code: Utils.HttpStatusCode.BAD_REQUEST
          })
        }

        if (errors.length > 0) {
          return Utils.failure(errors)
        }

        // Create user and style classes
        const user: User = {
          id: userData.id!,
          name: userData.name!,
          email: userData.email!,
          role: userData.role!
        }

        const className = Utils.cn(
          'user-card p-4 rounded-lg border',
          {
            'border-purple-500 bg-purple-50': user.role === 'admin',
            'border-blue-500 bg-blue-50': user.role === 'user'
          },
          'shadow-sm hover:shadow-md transition-shadow'
        )

        return Utils.success({ user, className })
      }

      // Test successful validation
      const validUser = validateAndStyleUser({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin'
      })

      expect(validUser.isSuccess()).toBe(true)
      if (validUser.isSuccess()) {
        expect(validUser.value.user.id).toBe(1)
        expect(validUser.value.user.name).toBe('John Doe')
        expect(validUser.value.user.role).toBe('admin')
        expect(validUser.value.className).toBe(
          'user-card p-4 rounded-lg border border-purple-500 bg-purple-50 shadow-sm hover:shadow-md transition-shadow'
        )
      }

      // Test failed validation
      const invalidUser = validateAndStyleUser({
        id: -1,
        name: '',
        email: 'invalid-email',
        role: 'invalid' as unknown as 'admin' | 'user'
      })

      expect(invalidUser.isFailure()).toBe(true)
      if (invalidUser.isFailure()) {
        expect(invalidUser.value).toHaveLength(4)
        for (const error of invalidUser.value) {
          expect(error.code).toBe(Utils.HttpStatusCode.BAD_REQUEST)
          expect(typeof error.field).toBe('string')
          expect(typeof error.message).toBe('string')
        }
      }
    })

    it('should work in a REST API response handler scenario', () => {
      interface ApiResponse<T> {
        data?: T
        error?: string
        statusCode: Utils.HttpStatusCode
      }

      function handleApiResponse<T>(response: ApiResponse<T>): {
        result: Utils.Either<string, T>
        statusClass: string
      } {
        const statusClass = Utils.cn('api-status', {
          'text-green-600':
            response.statusCode >= Utils.HttpStatusCode.OK && response.statusCode < Utils.HttpStatusCode.BAD_REQUEST,
          'text-yellow-600':
            response.statusCode >= Utils.HttpStatusCode.BAD_REQUEST &&
            response.statusCode < Utils.HttpStatusCode.INTERNAL_SERVER_ERROR,
          'text-red-600': response.statusCode >= Utils.HttpStatusCode.INTERNAL_SERVER_ERROR
        })

        const result: Utils.Either<string, T> =
          response.statusCode >= Utils.HttpStatusCode.OK &&
          response.statusCode < Utils.HttpStatusCode.BAD_REQUEST &&
          response.data
            ? Utils.success(response.data)
            : Utils.failure(response.error ?? 'Unknown error occurred')

        return { result, statusClass }
      }

      // Test successful response
      const successResponse = handleApiResponse({
        data: { message: 'Success!' },
        statusCode: Utils.HttpStatusCode.OK
      })

      expect(successResponse.result.isSuccess()).toBe(true)
      expect(successResponse.statusClass).toBe('api-status text-green-600')

      // Test error response
      const errorResponse = handleApiResponse({
        error: 'Not found',
        statusCode: Utils.HttpStatusCode.NOT_FOUND
      })

      expect(errorResponse.result.isFailure()).toBe(true)
      expect(errorResponse.statusClass).toBe('api-status text-yellow-600')

      if (errorResponse.result.isFailure()) {
        expect(errorResponse.result.value).toBe('Not found')
      }
    })
  })

  describe('type safety integration', () => {
    it('should maintain proper TypeScript types across utilities', () => {
      // This test ensures TypeScript compilation works correctly
      const statusCode: Utils.HttpStatusCode = Utils.HttpStatusCode.OK
      const eitherResult: Utils.Either<string, number> = Utils.success(42)
      const className: string = Utils.cn('test-class')

      expect(typeof statusCode).toBe('number')
      expect(typeof className).toBe('string')
      expect(eitherResult.isSuccess()).toBe(true)

      // Test complex type composition
      type ApiResult<T> = Utils.Either<
        { code: Utils.HttpStatusCode; message: string },
        { code: Utils.HttpStatusCode; data: T; className: string }
      >

      function createApiResult<T>(data: T, isError: boolean): ApiResult<T> {
        if (isError) {
          return Utils.failure({
            code: Utils.HttpStatusCode.INTERNAL_SERVER_ERROR,
            message: 'Server error'
          })
        }

        return Utils.success({
          code: Utils.HttpStatusCode.OK,
          data,
          className: Utils.cn('success-response', 'bg-green-100')
        })
      }

      const successResult = createApiResult({ id: 1 }, false)
      const errorResult = createApiResult(null, true)

      expect(successResult.isSuccess()).toBe(true)
      expect(errorResult.isFailure()).toBe(true)
    })
  })

  describe('module structure validation', () => {
    it('should have consistent export pattern', () => {
      // Verify that all exports are properly typed and accessible
      const exports = Object.entries(Utils)

      for (const [name, value] of exports) {
        expect(name).toBeTruthy()
        expect(value).toBeDefined()

        // Ensure exports are not accidentally undefined or null
        expect(value).not.toBe(null)
        expect(value).not.toBe(undefined)
      }
    })

    it('should support tree-shaking via named exports', () => {
      expect(cn).toBeDefined()
      expect(success).toBeDefined()
      expect(failure).toBeDefined()
      expect(HttpStatusCode).toBeDefined()

      // Test that individual imports work
      expect(cn('test')).toBe('test')
      expect(success(42).isSuccess()).toBe(true)
      expect(failure('error').isFailure()).toBe(true)
      expect(HttpStatusCode.OK).toBe(200)
    })
  })
})
