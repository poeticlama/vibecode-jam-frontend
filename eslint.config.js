import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import tsPrefixer from 'eslint-config-ts-prefixer';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores([
      'dist',
      'eslint.config.js',
      'prettier.config.js',
      'vite.config.ts',
  ]),

  {
    files: ['**/*.{ts,tsx,js,jsx}'],

    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      tsPrefixer,
    ],

    plugins: {
      'jsx-a11y': jsxA11y,
      '@stylistic': stylistic,
      prettier: prettier,
    },

    languageOptions: {
      ecmaVersion: 2020,
      parser: tseslint.parser,
      globals: {
        ...globals.browser,
      },
    },

    rules: {
      'react-hooks/rules-of-hooks': 'error',

      'prettier/prettier': [
        'error',
        {
          semi: true,
          endOfLine: 'auto',
        },
      ],

      '@typescript-eslint/promise-function-async': [
        'error',
        {
          checkArrowFunctions: false,
        },
      ],

      curly: ['error', 'all'],
      'prefer-const': 'error',
      'no-var': 'error',
      'no-shadow-restricted-names': 'error',
      'no-console': 'warn',

      '@stylistic/padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
        { blankLine: 'always', prev: '*', next: ['enum', 'interface', 'type'] },
        { blankLine: 'always', prev: ['enum', 'interface', 'type'], next: '*' },
      ],
    },
  },
]);
