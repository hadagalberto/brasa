# Brasa

**A premium, dark-first, ember-accented multi-purpose theme for Astro.**

Brasa is an open-source (MIT) theme for SaaS and product sites: landing pages,
blogs, docs, pricing and changelogs. It is warm where most themes are cold — a
near-black canvas with a hint of brown, an ember gradient from deep red-orange
to amber, editorial serif display type, and obsessive attention to speed and
accessibility.

Built milestone by milestone against [SPEC.md](./SPEC.md). **Milestone 1**
shipped the OKLCH design system, base layout and living styleguide at
`/styleguide`. **Milestone 2** completed the home page: pointer-reactive ember
glow, an HTML/CSS deploy-dashboard mock, SVG wordmark cloud, spotlight bento
grid, scroll-drawn steps, Expressive Code tabs, count-up metrics, an accessible
testimonial marquee, pricing teaser and animated FAQ. **Milestone 3** added the
blog: index, featured post, tags, authors, pagination, reading-time and TOC,
related posts, share row, RSS and JSON feeds, per-post OG cards and View
Transition morphs. **Milestone 4** added the complete documentation manual and
Pagefind search:

- `/docs` — 11 real pages covering installation, configuration, tokens,
  content authoring, i18n, deployment, accessibility, performance, the full
  component reference, live MDX component examples and FAQ.
- Sidebar with ordered/collapsible groups, current-page state and a modal
  mobile drawer; sticky TOC, breadcrumbs, prev/next, edit links and per-page OG
  images.
- Custom-styled search dialog opened with `Ctrl/⌘+K` or `/`, with a focus trap,
  arrow-key result navigation and a lazily loaded static Pagefind index.

## Quick start

```sh
# inside this repository
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command              | What it does                                                   |
| -------------------- | -------------------------------------------------------------- |
| `npm run dev`        | Start the dev server                                           |
| `npm run build`      | Verify MDX frontmatter, build to `./dist`, index with Pagefind |
| `npm run preview`    | Serve the built site locally                                   |
| `npm run check`      | `astro check` — type and template diagnostics                  |
| `npm run lint`       | ESLint (TS, Astro templates, config files)                     |
| `npm run format`     | Prettier (incl. Astro + Tailwind class sorting)                |
| `npm run test`       | Playwright e2e + axe accessibility suite                       |
| `npm run verify:mdx` | Check every MDX frontmatter block and import boundary          |
| `npm run og`         | Regenerate the default Open Graph image (`public/og.png`)      |

## Stack

- [Astro](https://astro.build) (MIT) — static output, View Transitions, zero-JS pages
- [Tailwind CSS v4](https://tailwindcss.com) (MIT) — CSS-first `@theme` tokens, OKLCH palette
- [MDX](https://mdxjs.com) + [Expressive Code](https://expressive-code.com) (MIT)
- [Fontsource](https://fontsource.org) self-hosted variable fonts:
  [Fraunces](https://github.com/googlefonts/fraunces) (display, OFL),
  [Geist](https://vercel.com/font) and Geist Mono (Vercel, OFL)
- [Playwright](https://playwright.dev) (Apache-2.0) + [axe-core](https://github.com/dequelabs/axe-core) (MPL-2.0)
- [Pagefind](https://pagefind.app) (MIT) — static search index, loaded on demand
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) (Apache-2.0)

## License

MIT — see [LICENSE](./LICENSE). Font files keep their original
open licenses (SIL OFL) inside `src/styles` via Fontsource.
