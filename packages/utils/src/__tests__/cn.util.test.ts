import { describe, expect, it } from 'vitest'

import { cn } from '../cn.util'

describe('cn', () => {
  describe('basic functionality', () => {
    it('should handle a single class string', () => {
      expect(cn('px-4')).toBe('px-4')
    })

    it('should handle multiple class strings', () => {
      expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
    })

    it('should handle empty inputs', () => {
      expect(cn()).toBe('')
      expect(cn('')).toBe('')
      expect(cn(null)).toBe('')
      expect(cn()).toBe('')
    })

    it('should filter out falsy values', () => {
      expect(cn('px-4', false, 'py-2', null, undefined, '')).toBe('px-4 py-2')
    })
  })

  describe('conditional classes', () => {
    it('should handle conditional classes with boolean conditions', () => {
      const isActive = true
      const isDisabled = false

      expect(cn('base', isActive && 'active', isDisabled && 'disabled')).toBe('base active')
    })

    it('should handle object syntax for conditional classes', () => {
      expect(
        cn({
          'px-4': true,
          'py-2': false,
          'text-blue-500': true
        })
      ).toBe('px-4 text-blue-500')
    })

    it('should handle mixed conditional patterns', () => {
      const condition = true
      expect(
        cn('base-class', condition && 'conditional-class', { 'object-class': true, 'disabled-class': false }, [
          'array-class'
        ])
      ).toBe('base-class conditional-class object-class array-class')
    })
  })

  describe('Tailwind CSS merging', () => {
    it('should merge conflicting Tailwind classes correctly', () => {
      // Later classes should override earlier ones
      expect(cn('px-2 px-4')).toBe('px-4')
      expect(cn('text-blue-500 text-red-500')).toBe('text-red-500')
      expect(cn('bg-blue-500 bg-red-500')).toBe('bg-red-500')
    })

    it('should merge responsive variants correctly', () => {
      expect(cn('px-2 px-4 md:px-6')).toBe('px-4 md:px-6')
    })

    it('should merge pseudo-class variants correctly', () => {
      expect(cn('text-green-500 text-red-500 hover:text-blue-500')).toBe('text-red-500 hover:text-blue-500')
    })

    it('should handle complex merging scenarios', () => {
      expect(cn('bg-red-500 px-4 py-2', 'px-6 text-white', 'bg-blue-500')).toBe('py-2 px-6 text-white bg-blue-500')
    })
  })

  describe('array inputs', () => {
    it('should handle array of strings', () => {
      expect(cn(['px-4', 'py-2', 'text-white'])).toBe('px-4 py-2 text-white')
    })

    it('should handle nested arrays', () => {
      expect(cn(['px-4', ['py-2', ['text-white']]])).toBe('px-4 py-2 text-white')
    })

    it('should filter falsy values in arrays', () => {
      expect(cn(['px-4', false, 'py-2', null, undefined, ''])).toBe('px-4 py-2')
    })
  })

  describe('complex scenarios', () => {
    it('should handle component-like usage pattern', () => {
      const variant = 'primary'
      const size = 'lg'
      const disabled = false

      const result = cn('btn', {
        'btn-primary': variant === 'primary',
        'btn-lg': size === 'lg',
        'cursor-not-allowed opacity-50': disabled
      })

      expect(result).toBe('btn btn-primary btn-lg')
    })

    it('should handle utility-first CSS patterns', () => {
      const result = cn(
        // Base styles
        'inline-flex items-center justify-center rounded-md text-sm font-medium',
        // Size variants
        'h-10 px-4 py-2',
        // Color variants with merging
        'bg-slate-900 text-slate-50 hover:bg-slate-800',
        'bg-blue-600' // This should override bg-slate-900
      )

      expect(result).toBe(
        'inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 text-slate-50 hover:bg-slate-800 bg-blue-600'
      )
    })

    it('should handle form control patterns', () => {
      const hasError = true
      const isDisabled = false

      const result = cn(
        'w-full rounded-md border px-3 py-2',
        hasError ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-blue-500',
        isDisabled && 'cursor-not-allowed opacity-50'
      )

      expect(result).toBe('w-full rounded-md border px-3 py-2 border-red-500 focus:border-red-500')
    })
  })

  describe('edge cases', () => {
    it('should handle very long class strings', () => {
      const longClassString = Array.from({ length: 100 }).fill('px-1').join(' ')
      expect(cn(longClassString)).toBe('px-1')
    })

    it('should handle special characters in class names', () => {
      expect(cn('w-1/2', 'h-1/3')).toBe('w-1/2 h-1/3')
    })

    it('should handle numeric class names', () => {
      expect(cn('z-10', 'z-20')).toBe('z-20')
    })

    it('should handle deeply nested objects and arrays', () => {
      const result = cn(
        'base',
        {
          nested: {
            deep: true,
            deeper: false
          }
        },
        [
          'array-item',
          {
            'array-object': true
          }
        ]
      )

      expect(result).toBe('base nested array-item array-object')
    })
  })
})
