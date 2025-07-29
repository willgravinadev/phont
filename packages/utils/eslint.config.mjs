import eslintConfig from '@phont/eslint-config'

export default eslintConfig(
  {
    project: './tsconfig.json',
    tsconfigRootDir: import.meta.dirname,
    turbo: true,
    typescript: true
  },
  {
    rules: {
      '@typescript-eslint/no-unnecessary-condition': 'off'
    }
  }
)
