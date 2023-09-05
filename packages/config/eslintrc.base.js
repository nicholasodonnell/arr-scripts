module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: './',
  },
  ignorePatterns: [
    '.eslintrc.js',
    'node_modules/*',
    'prettier.config.js',
  ],
  plugins: [
    '@typescript-eslint/eslint-plugin',
    'import',
    'perfectionist',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'always-multiline',
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'import/newline-after-import': ['error', { count: 1 }],
    'import/no-anonymous-default-export': 'off',
    'import/no-cycle': 1,
    'import/no-self-import': 1,
    'import/order': [
      'error',
      {
        alphabetize: {
          caseInsensitive: true,
          order: 'asc',
        },
        groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
    'no-unused-expressions': 2,
    'object-curly-spacing': ['error', 'always'],
    'perfectionist/sort-objects': [
      'error',
      {
        order: 'asc',
        type: 'natural',
      },
    ],
    'prettier/prettier': ['error'],
    quotes: ['error', 'single', { allowTemplateLiterals: true }],
    semi: ['error', 'never'],
  },
}
