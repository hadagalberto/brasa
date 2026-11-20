/**
 * Brasa themes for Expressive Code, derived from the same OKLCH palette as
 * the site tokens (`src/styles/global.css`) and the accent hue from
 * `src/brasa.config.ts`.
 *
 * The themes are named "dark" and "light" so Expressive Code's default
 * `themeCssSelector` (`[data-theme='<name>']`) matches the `data-theme`
 * attribute our theme toggle sets on <html> — code blocks therefore follow
 * the site theme with zero extra JS.
 */

import { ExpressiveCodeTheme } from 'expressive-code';
import { ember, hex, palette } from './color';

export function brasaEcThemes(accentHue: number): {
  dark: ExpressiveCodeTheme;
  light: ExpressiveCodeTheme;
} {
  const d = palette.dark;
  const l = palette.light;

  const dark = new ExpressiveCodeTheme({
    name: 'dark',
    type: 'dark',
    fg: hex(d.ink),
    bg: hex(d.surface),
    colors: {
      'editor.background': hex(d.surface),
      'editor.foreground': hex(d.ink),
      'editor.selectionBackground': ember(accentHue, 500),
      'editorLineNumber.foreground': hex(d.ink3),
      'editorLineNumber.activeForeground': hex(d.ink2),
      focusBorder: ember(accentHue, 400),
      'menu.selectionBackground': hex(d.surface3),
      'menu.selectionForeground': hex(d.ink),
      'scrollbarSlider.background': hex(d.surface3),
      'scrollbarSlider.hoverBackground': hex(d.ink3),
      'editorGroupHeader.tabsBackground': hex(d.surface2),
      'editorGroupHeader.tabsBorder': hex(d.surface3),
      'tab.activeBackground': hex(d.surface2),
      'tab.activeForeground': hex(d.ink),
      'tab.activeBorderTop': ember(accentHue, 400),
      'tab.activeBorder': ember(accentHue, 600),
      'titleBar.activeBackground': hex(d.surface2),
      'titleBar.activeForeground': hex(d.ink2),
      'titleBar.border': hex(d.surface3),
      'terminal.background': hex(d.surface),
      'terminal.ansiGreen': hex({ l: 0.78, c: 0.09, h: 130 }),
      'widget.shadow': hex(d.canvasDeep),
    },
    settings: [
      {
        scope: [
          'comment',
          'punctuation.definition.comment',
          'punctuation.definition.comment.begin',
          'punctuation.definition.comment.end',
        ],
        settings: { foreground: hex(d.ink3), fontStyle: 'italic' },
      },
      {
        scope: [
          'keyword',
          'keyword.control',
          'keyword.other',
          'storage.type',
          'storage.modifier',
          'support.type',
          'support.class',
          'variable.language',
        ],
        settings: { foreground: ember(accentHue, 400) },
      },
      { scope: ['keyword.operator'], settings: { foreground: hex(d.ink2) } },
      {
        scope: ['string', 'string.quoted', 'string.template', 'string.regexp', 'meta.embedded'],
        settings: { foreground: hex({ l: 0.78, c: 0.09, h: 130 }) },
      },
      {
        scope: ['entity.name.function', 'support.function', 'variable.function'],
        settings: { foreground: hex({ l: 0.85, c: 0.11, h: accentHue + 35 }) },
      },
      {
        scope: ['constant', 'constant.numeric', 'variable.other.constant', 'constant.language'],
        settings: { foreground: hex({ l: 0.82, c: 0.12, h: accentHue + 45 }) },
      },
      {
        scope: [
          'entity.name.type',
          'entity.name.class',
          'support.type.property-name',
          'entity.other.inherited-class',
        ],
        settings: { foreground: hex({ l: 0.83, c: 0.06, h: 100 }) },
      },
      { scope: ['entity.name.tag'], settings: { foreground: ember(accentHue, 300) } },
      {
        scope: ['entity.other.attribute-name'],
        settings: { foreground: hex({ l: 0.8, c: 0.08, h: 100 }) },
      },
      {
        scope: ['variable', 'variable.parameter', 'variable.other', 'meta.definition.variable'],
        settings: { foreground: hex(d.ink) },
      },
      {
        scope: [
          'punctuation',
          'meta.brace',
          'punctuation.definition',
          'punctuation.separator',
          'punctuation.terminator',
        ],
        settings: { foreground: hex(d.ink2) },
      },
      {
        scope: ['heading', 'entity.name.section.markdown', 'markup.heading'],
        settings: { foreground: ember(accentHue, 300), fontStyle: 'bold' },
      },
      { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    ],
    styleOverrides: {
      borderColor: 'rgba(255, 255, 255, 0.09)',
      borderRadius: '0.75rem',
    },
  });

  const light = new ExpressiveCodeTheme({
    name: 'light',
    type: 'light',
    fg: hex(l.ink),
    bg: hex(l.surface),
    colors: {
      'editor.background': hex(l.surface),
      'editor.foreground': hex(l.ink),
      'editor.selectionBackground': ember(accentHue, 600),
      'editorLineNumber.foreground': hex(l.ink3),
      'editorLineNumber.activeForeground': hex(l.ink2),
      focusBorder: ember(accentHue, 600),
      'menu.selectionBackground': hex(l.surface3),
      'menu.selectionForeground': hex(l.ink),
      'scrollbarSlider.background': hex(l.surface3),
      'scrollbarSlider.hoverBackground': hex(l.ink3),
      'editorGroupHeader.tabsBackground': hex(l.surface2),
      'editorGroupHeader.tabsBorder': hex(l.surface3),
      'tab.activeBackground': hex(l.surface2),
      'tab.activeForeground': hex(l.ink),
      'tab.activeBorderTop': ember(accentHue, 600),
      'tab.activeBorder': ember(accentHue, 700),
      'titleBar.activeBackground': hex(l.surface2),
      'titleBar.activeForeground': hex(l.ink2),
      'titleBar.border': hex(l.surface3),
      'terminal.background': hex(l.surface),
      'terminal.ansiGreen': hex({ l: 0.45, c: 0.1, h: 135 }),
      'widget.shadow': hex(palette.light.ink3),
    },
    settings: [
      {
        scope: [
          'comment',
          'punctuation.definition.comment',
          'punctuation.definition.comment.begin',
          'punctuation.definition.comment.end',
        ],
        settings: { foreground: hex(l.ink3), fontStyle: 'italic' },
      },
      {
        scope: [
          'keyword',
          'keyword.control',
          'keyword.other',
          'storage.type',
          'storage.modifier',
          'support.type',
          'support.class',
          'variable.language',
        ],
        settings: { foreground: ember(accentHue, 600) },
      },
      { scope: ['keyword.operator'], settings: { foreground: hex(l.ink2) } },
      {
        scope: ['string', 'string.quoted', 'string.template', 'string.regexp', 'meta.embedded'],
        settings: { foreground: hex({ l: 0.45, c: 0.1, h: 135 }) },
      },
      {
        scope: ['entity.name.function', 'support.function', 'variable.function'],
        settings: { foreground: hex({ l: 0.62, c: 0.14, h: accentHue + 10 }) },
      },
      {
        scope: ['constant', 'constant.numeric', 'variable.other.constant', 'constant.language'],
        settings: { foreground: hex({ l: 0.55, c: 0.13, h: accentHue + 25 }) },
      },
      {
        scope: [
          'entity.name.type',
          'entity.name.class',
          'support.type.property-name',
          'entity.other.inherited-class',
        ],
        settings: { foreground: hex({ l: 0.5, c: 0.09, h: 120 }) },
      },
      { scope: ['entity.name.tag'], settings: { foreground: ember(accentHue, 500) } },
      {
        scope: ['entity.other.attribute-name'],
        settings: { foreground: hex({ l: 0.5, c: 0.1, h: 120 }) },
      },
      {
        scope: ['variable', 'variable.parameter', 'variable.other', 'meta.definition.variable'],
        settings: { foreground: hex(l.ink) },
      },
      {
        scope: [
          'punctuation',
          'meta.brace',
          'punctuation.definition',
          'punctuation.separator',
          'punctuation.terminator',
        ],
        settings: { foreground: hex(l.ink2) },
      },
      {
        scope: ['heading', 'entity.name.section.markdown', 'markup.heading'],
        settings: { foreground: ember(accentHue, 500), fontStyle: 'bold' },
      },
      { scope: ['markup.bold'], settings: { fontStyle: 'bold' } },
      { scope: ['markup.italic'], settings: { fontStyle: 'italic' } },
    ],
    styleOverrides: {
      borderColor: 'rgba(56, 42, 28, 0.16)',
      borderRadius: '0.75rem',
    },
  });

  return { dark, light };
}
