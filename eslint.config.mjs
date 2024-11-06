import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginSecurity from "eslint-plugin-security";

export default [
  {
    ignores: [
      'dist/**/*.ts',
      'dist/**',
      "**/*.mjs",
      "eslint.config.mjs",
      "**/*.js"
    ]
  },
  {
    files: ["./src/**/*.ts"]
  },
  {
    languageOptions: {
      globals: globals.node
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginSecurity.configs.recommended,
  {
    rules: {
      indent: [
        'error',
        2,
        { SwitchCase: 1 }
      ],
      'linebreak-style': [
        'error',
        process.platform === 'win32' ? 'windows' : 'unix'
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
      ],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': [
        'error',
        { max: 1 }
      ],
      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],
      'object-curly-spacing': [
        'error',
        'always'
      ],
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true
        }
      ],
      'space-in-parens': [
        'error',
        'never'
      ],
      'brace-style': [
        'error',
        '1tbs',
        { allowSingleLine: true }
      ],
      'no-empty-function': 'error',
      'no-lonely-if': 'error',
      'no-useless-return': 'error',
      'spaced-comment': [
        'error',
        'always',
        { markers: ['/'] }
      ],
      'func-call-spacing': [
        'error',
        'never'
      ],
      'template-curly-spacing': [
        'error',
        'never'
      ],
      'default-param-last': 'error',
      'newline-before-return': 'error',
      'no-duplicate-imports': [
        'error',
        { includeExports: true }
      ],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'arrow-parens': [
        'error',
        'as-needed'
      ],
      'no-return-assign': 'error',
      'object-shorthand': 'error',
      'func-style': [
        'error',
        'declaration',
        { allowArrowFunctions: true }
      ],
      'array-bracket-spacing': ['error', 'never'],
      'space-infix-ops': 'error',
      'keyword-spacing': [
        'error',
        { before: true, after: true }
      ],
      'no-unneeded-ternary': 'error',
      'no-multi-spaces': 'error',
      'security/detect-object-injection': 'off',
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-unsafe-regex': 'off',
      'security/detect-non-literal-require': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      'no-var': 'off'
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  }
];