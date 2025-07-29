import { coverageConfigDefaults, defineConfig, mergeConfig, type ViteUserConfig } from 'vitest/config'

export const coverageConfig = {
  reporter: ['lcov', 'html', 'text-summary', 'json'],
  all: true,
  provider: 'v8' as const,
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  exclude: [
    ...coverageConfigDefaults.exclude,
    '**/dist/**',
    '**/coverage/**',
    '**/fixtures/**',
    '**/tests/**',
    '**/e2e/**',
    './turbo/**',
    './scripts/**',
    '**/*.config.*',
    '**/*.d.ts',
    '**/index.ts' // Usually just exports
  ]
}

export const baseTestConfig = {
  globals: true,
  environment: 'jsdom' as const,
  setupFiles: [],
  include: ['src/**/__tests__/**/*.{test,spec}.{ts,tsx,js,jsx}', 'src/**/*.{test,spec}.{ts,tsx,js,jsx}'],
  exclude: [
    '**/node_modules/**',
    '**/e2e/**',
    '**/dist/**',
    '**/coverage/**',
    '**/fixtures/**',
    '**/tests/**',
    './turbo/**',
    './scripts/**'
  ],
  pool: 'forks' as const,
  poolOptions: {
    forks: {
      maxForks: 4,
      minForks: 1
    }
  },
  outputFile: {
    json: './coverage/results.json',
    junit: './coverage/junit.xml'
  },
  testTimeout: 20_000,
  hookTimeout: 20_000
}

export const sharedProjectConfig = defineConfig({
  test: {
    ...baseTestConfig,
    coverage: coverageConfig
  }
})

export const nodeProjectConfig = defineConfig({
  test: {
    ...baseTestConfig,
    environment: 'node',
    coverage: coverageConfig
  }
})

export const reactProjectConfig = defineConfig({
  test: {
    ...baseTestConfig,
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
    coverage: coverageConfig
  }
})

export function createProjectConfig(overrides: ViteUserConfig = {}): ViteUserConfig {
  return mergeConfig(
    {
      test: {
        ...baseTestConfig,
        coverage: coverageConfig
      }
    },
    overrides
  )
}
