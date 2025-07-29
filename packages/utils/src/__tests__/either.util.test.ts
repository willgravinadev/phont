import { describe, expect, it } from 'vitest'

import { type Either, Failure, failure, Success, success } from '../either.util'

describe('Either', () => {
  describe('Failure class', () => {
    it('should create a Failure instance with the correct value', () => {
      const error = 'Something went wrong'
      const result = new Failure<string, number>(error)

      expect(result.value).toBe(error)
      expect(result.isFailure()).toBe(true)
      expect(result.isSuccess()).toBe(false)
    })

    it('should handle different failure types', () => {
      const stringFailure = new Failure<string, number>('error')
      const numberFailure = new Failure<number, string>(404)
      const objectFailure = new Failure<{ code: number; message: string }, boolean>({
        code: 500,
        message: 'Internal server error'
      })

      expect(stringFailure.value).toBe('error')
      expect(numberFailure.value).toBe(404)
      expect(objectFailure.value).toEqual({ code: 500, message: 'Internal server error' })
    })

    it('should have correct type guards', () => {
      const result: Either<string, number> = new Failure('error')

      expect(result.isFailure()).toBe(true)
      expect(result.isSuccess()).toBe(false)

      if (result.isFailure()) {
        // TypeScript should narrow the type here
        expect(typeof result.value).toBe('string')
        expect(result.value).toBe('error')
      }
    })

    it('should handle null and undefined values', () => {
      const nullFailure = new Failure<null, string>(null)
      const undefinedFailure = new Failure<undefined, string>(undefined)

      expect(nullFailure.value).toBe(null)
      expect(undefinedFailure.value).toBe(undefined)
      expect(nullFailure.isFailure()).toBe(true)
      expect(undefinedFailure.isFailure()).toBe(true)
    })
  })

  describe('Success class', () => {
    it('should create a Success instance with the correct value', () => {
      const data = 42
      const result = new Success<string, number>(data)

      expect(result.value).toBe(data)
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
    })

    it('should handle different success types', () => {
      const stringSuccess = new Success<string, string>('success')
      const numberSuccess = new Success<string, number>(200)
      const objectSuccess = new Success<string, { id: number; name: string }>({
        id: 1,
        name: 'John Doe'
      })
      const arraySuccess = new Success<string, number[]>([1, 2, 3])

      expect(stringSuccess.value).toBe('success')
      expect(numberSuccess.value).toBe(200)
      expect(objectSuccess.value).toEqual({ id: 1, name: 'John Doe' })
      expect(arraySuccess.value).toEqual([1, 2, 3])
    })

    it('should have correct type guards', () => {
      const result: Either<string, number> = new Success(42)

      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)

      if (result.isSuccess()) {
        // TypeScript should narrow the type here
        expect(typeof result.value).toBe('number')
        expect(result.value).toBe(42)
      }
    })

    it('should handle null and undefined values', () => {
      const nullSuccess = new Success<string, null>(null)
      const undefinedSuccess = new Success<string, undefined>(undefined)

      expect(nullSuccess.value).toBe(null)
      expect(undefinedSuccess.value).toBe(undefined)
      expect(nullSuccess.isSuccess()).toBe(true)
      expect(undefinedSuccess.isSuccess()).toBe(true)
    })
  })

  describe('failure factory function', () => {
    it('should create a Failure instance', () => {
      const result = failure<string, number>('error message')

      expect(result).toBeInstanceOf(Failure)
      expect(result.value).toBe('error message')
      expect(result.isFailure()).toBe(true)
      expect(result.isSuccess()).toBe(false)
    })

    it('should work with different types', () => {
      const stringFailure = failure<string, number>('404 Not Found')
      const numberFailure = failure<number, string>(404)
      const objectFailure = failure<{ error: string }, { data: unknown }>({ error: 'Validation failed' })

      expect(stringFailure.value).toBe('404 Not Found')
      expect(numberFailure.value).toBe(404)
      expect(objectFailure.value).toEqual({ error: 'Validation failed' })
    })

    it('should return correct Either type', () => {
      const result: Either<string, number> = failure('error')

      expect(result.isFailure()).toBe(true)
      if (result.isFailure()) {
        expect(result.value).toBe('error')
      }
    })
  })

  describe('success factory function', () => {
    it('should create a Success instance', () => {
      const result = success<string, number>(42)

      expect(result).toBeInstanceOf(Success)
      expect(result.value).toBe(42)
      expect(result.isSuccess()).toBe(true)
      expect(result.isFailure()).toBe(false)
    })

    it('should work with different types', () => {
      const stringSuccess = success<string, string>('Operation completed')
      const numberSuccess = success<string, number>(200)
      const objectSuccess = success<string, { id: number; data: string }>({ id: 1, data: 'test' })
      const arraySuccess = success<string, string[]>(['a', 'b', 'c'])

      expect(stringSuccess.value).toBe('Operation completed')
      expect(numberSuccess.value).toBe(200)
      expect(objectSuccess.value).toEqual({ id: 1, data: 'test' })
      expect(arraySuccess.value).toEqual(['a', 'b', 'c'])
    })

    it('should return correct Either type', () => {
      const result: Either<string, number> = success(42)

      expect(result.isSuccess()).toBe(true)
      if (result.isSuccess()) {
        expect(result.value).toBe(42)
      }
    })
  })

  describe('Either type usage patterns', () => {
    it('should work in function return scenarios', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping -- test
      function divide(a: number, b: number): Either<string, number> {
        if (b === 0) {
          return failure('Division by zero')
        }
        return success(a / b)
      }

      const validResult = divide(10, 2)
      const invalidResult = divide(10, 0)

      expect(validResult.isSuccess()).toBe(true)
      expect(invalidResult.isFailure()).toBe(true)

      if (validResult.isSuccess()) {
        expect(validResult.value).toBe(5)
      }

      if (invalidResult.isFailure()) {
        expect(invalidResult.value).toBe('Division by zero')
      }
    })

    it('should work with async operations', async () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping -- test
      async function fetchUser(id: number): Promise<Either<string, { id: number; name: string }>> {
        if (id <= 0) {
          return failure('Invalid user ID')
        }

        // Simulate async operation
        await new Promise((resolve) => setTimeout(resolve, 1))

        return success({ id, name: `User ${id}` })
      }

      const validUser = await fetchUser(1)
      const invalidUser = await fetchUser(-1)

      expect(validUser.isSuccess()).toBe(true)
      expect(invalidUser.isFailure()).toBe(true)

      if (validUser.isSuccess()) {
        expect(validUser.value).toEqual({ id: 1, name: 'User 1' })
      }

      if (invalidUser.isFailure()) {
        expect(invalidUser.value).toBe('Invalid user ID')
      }
    })

    it('should work with validation scenarios', () => {
      interface ValidationError {
        field: string
        message: string
      }

      interface User {
        email: string
        age: number
      }

      function validateUser(email: string, age: number): Either<ValidationError[], User> {
        const errors: ValidationError[] = []

        if (!email.includes('@')) {
          errors.push({ field: 'email', message: 'Invalid email format' })
        }

        if (age < 18) {
          errors.push({ field: 'age', message: 'Must be at least 18 years old' })
        }

        if (errors.length > 0) {
          return failure(errors)
        }

        return success({ email, age })
      }

      const validUser = validateUser('test@example.com', 25)
      const invalidUser = validateUser('invalid-email', 16)

      expect(validUser.isSuccess()).toBe(true)
      expect(invalidUser.isFailure()).toBe(true)

      if (validUser.isSuccess()) {
        expect(validUser.value).toEqual({ email: 'test@example.com', age: 25 })
      }

      if (invalidUser.isFailure()) {
        expect(invalidUser.value).toHaveLength(2)
        expect(invalidUser.value[0]?.field).toBe('email')
        expect(invalidUser.value[1]?.field).toBe('age')
      }
    })

    it('should work with chaining patterns', () => {
      // eslint-disable-next-line unicorn/consistent-function-scoping -- test
      function parseNumber(str: string): Either<string, number> {
        const num = Number(str)
        if (Number.isNaN(num)) {
          return failure(`"${str}" is not a valid number`)
        }
        return success(num)
      }

      // eslint-disable-next-line unicorn/consistent-function-scoping -- test
      function square(n: number): Either<string, number> {
        return success(n * n)
      }

      function processString(input: string): Either<string, number> {
        const parseResult = parseNumber(input)
        if (parseResult.isFailure()) {
          return parseResult
        }
        return square(parseResult.value)
      }

      const validResult = processString('5')
      const invalidResult = processString('abc')

      expect(validResult.isSuccess()).toBe(true)
      expect(invalidResult.isFailure()).toBe(true)

      if (validResult.isSuccess()) {
        expect(validResult.value).toBe(25)
      }

      if (invalidResult.isFailure()) {
        expect(invalidResult.value).toBe('"abc" is not a valid number')
      }
    })
  })

  describe('type safety', () => {
    it('should maintain type safety with different generic types', () => {
      // Test that TypeScript correctly infers types
      const stringFailure: Either<string, number> = failure('error')
      const numberSuccess: Either<string, number> = success(42)

      // These should work without type errors
      if (stringFailure.isFailure()) {
        const errorMessage: string = stringFailure.value
        expect(typeof errorMessage).toBe('string')
      }

      if (numberSuccess.isSuccess()) {
        const result: number = numberSuccess.value
        expect(typeof result).toBe('number')
      }
    })

    it('should work with complex generic types', () => {
      type ApiError = {
        code: number
        message: string
        details?: unknown
      }

      type ApiResponse<T> = {
        data: T
        timestamp: number
      }

      type UserData = {
        id: number
        name: string
        email: string
      }

      const errorResult: Either<ApiError, ApiResponse<UserData>> = failure({
        code: 404,
        message: 'User not found'
      })

      const successResult: Either<ApiError, ApiResponse<UserData>> = success({
        data: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com'
        },
        timestamp: Date.now()
      })

      expect(errorResult.isFailure()).toBe(true)
      expect(successResult.isSuccess()).toBe(true)

      if (errorResult.isFailure()) {
        expect(errorResult.value.code).toBe(404)
        expect(errorResult.value.message).toBe('User not found')
      }

      if (successResult.isSuccess()) {
        expect(successResult.value.data.id).toBe(1)
        expect(successResult.value.data.name).toBe('John Doe')
        expect(typeof successResult.value.timestamp).toBe('number')
      }
    })
  })
})
