// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import expressiveCode from 'astro-expressive-code';
import tailwindcss from '@tailwindcss/vite';

import { brasa } from './src/brasa.config';
import { brasaEcThemes } from './src/lib/ec-themes';

const SITE_URL = process.env.SITE_URL ?? 'https://hadagalberto.github.io/brasa';
const BASE_PATH = process.env.PAGES_BASE_PATH ?? '/';

const ecThemes = brasaEcThemes(brasa.colors.accentHue);

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,
  integrations: [
    expressiveCode({
      // Named "dark"/"light" so the default themeCssSelector
      // (`[data-theme='<name>']`) matches the theme attribute on <html>.
      themes: [ecThemes.dark, ecThemes.light],
      // Theme switching is manual (data-theme attribute), not OS-based.
      useDarkModeMediaQuery: false,
      styleOverrides: {
        borderRadius: '0.75rem',
        codeFontSize: '0.875rem',
        codeLineHeight: '1.7',
        codePaddingBlock: '1rem',
        codePaddingInline: '1.25rem',
      },
    }),
    mdx(),
  ],
  markdown: {
    // Expressive Code handles all code highlighting.
    syntaxHighlight: false,
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
