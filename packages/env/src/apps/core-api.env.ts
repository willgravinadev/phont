import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const coreApiENV = createEnv({
  server: {
    ENVIRONMENT: z.enum(['develop', 'production', 'staging', 'tests']),
    PORT: z.int().positive().optional().default(2222)
  },
  runtimeEnv: process.env,

  emptyStringAsUndefined: true
})
