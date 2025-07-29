import { defineConfig } from 'vitest/config'

import { coverageConfig } from './vitest.shared'

export default defineConfig({
  test: {
    projects: ['apps/*', 'packages/*', 'configs/*'],

    coverage: {
      ...coverageConfig,
      reportOnFailure: true,
      skipFull: false
    },

    globals: true,
    passWithNoTests: true,

    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: 6,
        minForks: 1
      }
    },

    testTimeout: 30_000,
    hookTimeout: 30_000,

    reporters: ['verbose', 'html', 'json'],
    outputFile: {
      html: './coverage/workspace-report.html',
      json: './coverage/workspace-results.json'
    }
  }
})
