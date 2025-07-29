import type { KnipConfig } from 'knip'

const config: KnipConfig = {
  ignoreDependencies: [
    'sharp',
    // not sure why it can't detect `pnpm with-env tsx ./src/seed.ts` in packages/db/package.json
    'tsx',
    // PostCSS is already installed under Next.js
    'postcss'
  ],
  workspaces: {
    '.': {
      entry: ['turbo/generators/config.ts']
    },
    'apps/docs': {
      entry: ['content-collections.ts', 'src/components/demos/**/*.tsx']
    },
    'apps/web': {
      entry: ['content-collections.ts', 'src/i18n/request.ts', 'src/e2e/**/*.setup.ts', 'src/e2e/**/*.teardown.ts']
    },
    'packages/db': {
      entry: ['src/seed.ts', 'src/reset.ts']
    },
    'packages/ui': {
      ignore: ['src/styles.css']
    },
    'packages/emails': {
      ignoreDependencies: ['tailwindcss'], // for tailwindcss intellisense
      ignore: ['src/styles.css']
    }
  },
  // credit to https://github.com/webpro-nl/knip/issues/1008#issuecomment-2756559038
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)(import|plugin)[^;]+/g)].join('\n').replace('plugin', 'import')
  }
}

export default config
