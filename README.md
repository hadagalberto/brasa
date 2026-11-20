# Brasa

**A premium, dark-first, ember-accented multi-purpose theme for Astro.**

Brasa is an open-source (MIT) theme for SaaS and product sites: landing pages,
blogs, docs, pricing and changelogs. It is warm where most themes are cold — a
near-black canvas with a hint of brown, an ember gradient from deep red-orange
to amber, editorial serif display type, and obsessive attention to speed and
accessibility.

This repository is being built milestone by milestone, following
[SPEC.md](./SPEC.md). **Milestone 1** shipped the Astro scaffold, the full OKLCH
design system, the base layout (sticky translucent header, full-screen mobile
sheet, rich footer, theme toggle, view transitions) and a living styleguide
at `/styleguide`. **Milestone 2** completed the home page: a hero with the
pointer-reactive ember glow and an HTML/CSS deploy-dashboard mock, SVG wordmark
logo cloud, spotlight bento grid, scroll-drawn “how it works” line, Expressive
Code tabs (CLI / config / API), count-up metrics, an accessible testimonial
marquee, a pricing teaser, an animated FAQ and the closing CTA with a copy-to-
clipboard install chip. The remaining milestones (pricing, blog, docs,
changelog, i18n and packaging) build on this foundation.

## Quick start

```sh
# inside this repository
npm install
npm run dev        # http://localhost:4321
```

## Scripts

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `npm run dev`     | Start the dev server                                      |
| `npm run build`   | Build the static site to `./dist`                         |
| `npm run preview` | Serve the built site locally                              |
| `npm run check`   | `astro check` — type and template diagnostics             |
| `npm run lint`    | ESLint (TS, Astro templates, config files)                |
| `npm run format`  | Prettier (incl. Astro + Tailwind class sorting)           |
| `npm run test`    | Playwright e2e + axe accessibility suite                  |
| `npm run og`      | Regenerate the default Open Graph image (`public/og.png`) |

## Stack

- [Astro](https://astro.build) (MIT) — static output, View Transitions, zero-JS pages
- [Tailwind CSS v4](https://tailwindcss.com) (MIT) — CSS-first `@theme` tokens, OKLCH palette
- [MDX](https://mdxjs.com) + [Expressive Code](https://expressive-code.com) (MIT)
- [Fontsource](https://fontsource.org) self-hosted variable fonts:
  [Fraunces](https://github.com/googlefonts/fraunces) (display, OFL),
  [Geist](https://vercel.com/font) and Geist Mono (Vercel, OFL)
- [Playwright](https://playwright.dev) (Apache-2.0) + [axe-core](https://github.com/dequelabs/axe-core) (MPL-2.0)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) (Apache-2.0)

## License

MIT — see [LICENSE](./LICENSE). Font files keep their original
open licenses (SIL OFL) inside `src/styles` via Fontsource.
