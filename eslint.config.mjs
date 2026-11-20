// @ts-check
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'coverage/**',
      '.lighthouseci/**',
      'public/**',
      'docs/screenshots/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Browser islands and inline scripts in layouts.
    files: ['src/**/*.{ts,astro}', 'tests/**/*.ts', 'playwright.config.ts'],
    languageOptions: {
      globals: { ...globals.browser },
    },
  },
  {
    // Node-side tooling (build scripts, test runner config).
    files: ['scripts/**/*.mjs', 'tests/**/*.ts', 'playwright.config.ts', '*.config.*'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    // CommonJS config consumed by Lighthouse CI.
    files: ['lighthouserc.cjs'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
  {
    files: ['**/*.astro'],
    rules: {
      // Astro templates commonly map over inline objects (nav items, tokens).
      'astro/no-unused-css-selector': 'error',
    },
  },
);
