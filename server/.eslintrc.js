/* eslint-disable linebreak-style */

module.exports = {
  env: {
    node: true,
    es2021: true
  },
  globals: {
    config: 'readonly',
    logger: 'readonly',
    client: 'readonly',
    getWss: 'readonly',
    ActiveSockets: 'readonly'
  },
  extends: 'eslint:recommended',
  overrides: [
    {
      env: {
        node: true
      },
      files: [
        '.eslintrc.{js,cjs}'
      ],
      parserOptions: {
        sourceType: 'module'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    indent: [
      'error',
      2,
      { SwitchCase: 1 }
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    quotes: [
      'error',
      'single'
    ],
    semi: [
      'error',
      'always'
    ],
    'comma-dangle': [
      'error',
      'never'
    ]
  }
};