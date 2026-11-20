# Brasa — SPEC

**Brasa** is an open-source (MIT, "Hadagalberto Junior") premium multi-purpose theme for **Astro** (latest stable),
for SaaS/product sites: landing page, blog, docs, pricing, changelog. It must look like a $200 agency template,
not like generic AI output. Speed and accessibility are features: Lighthouse 100/100/100/100 on every page type.

This is NOT a toy. No lorem-ipsum walls, no placeholder sections, no TODOs, no half-done pages, no broken links.
Demo content is realistic copy for a fictional product ("Brasa Cloud — deploy previews for teams"), in English and pt-BR.

## Stack

- Astro (latest stable, static output), TypeScript strict, Tailwind CSS v4 (CSS-first config with `@theme` tokens), MDX,
  Content Collections with Zod schemas, `astro:assets` for images, View Transitions (`<ClientRouter />`).
- Zero JS frameworks for UI. Interactivity = small vanilla TS islands (`<script>`), each < 3 KB gzipped.
- Code blocks: Expressive Code (themes matching light/dark tokens). Search: Pagefind (static index, custom styled UI).
- OG images generated at build time (satori + resvg) per blog post and doc page, using the theme fonts and colors.
- Fonts self-hosted (Fontsource, variable fonts, subset latin + latin-ext, `font-display: swap`, preload the display face).
- Package manager npm. Node ≥ 20.
- Tests: Playwright (e2e on built site via `astro preview`), @axe-core/playwright on every route (zero violations),
  Lighthouse CI (`@lhci/cli`) with assertions ≥ 0.98 on all four categories for home, a blog post, a docs page, pricing.
  `astro check` with zero errors/warnings, ESLint + Prettier (with astro plugins).
- GitHub Actions: CI (check, lint, build, Playwright, axe, LHCI) + deploy workflow to GitHub Pages (base path configurable).

## Art direction (follow it — this is what makes it "foda")

- **Dark-first**, warm. Background near-black with a hint of brown (`oklch(0.16 0.01 40)`), surfaces layered by lightness, not by borders.
  Signature accent: **ember** — a gradient from deep red-orange to amber (`oklch(0.65 0.21 35)` → `oklch(0.82 0.16 75)`),
  used sparingly: primary CTA, focus rings, key highlights, the hero glow. Light mode is a warm paper (`oklch(0.98 0.01 80)`) with ink text — equally polished, not an afterthought.
- All colors as OKLCH tokens in `@theme`; contrast AA minimum (AAA for body text). No pure #000/#fff.
- **Typography**: an editorial display face for headlines (e.g. "Instrument Serif" or "Fraunces" variable with optical sizing)
  paired with a precise grotesk for UI/body (e.g. "Geist", "Inter Tight" or "Manrope") and a mono (e.g. "Geist Mono"/"JetBrains Mono").
  Fluid type scale with `clamp()`, tight tracking on large display sizes, `text-wrap: balance` for headings and `pretty` for paragraphs.
  Hero headline huge (up to ~9rem on desktop), mixing serif italic words with the grotesk.
- **Texture & depth**: subtle film grain overlay (SVG noise, very low opacity), a slow radial ember glow behind the hero that reacts to the pointer
  (CSS custom properties updated by a tiny script, disabled with `prefers-reduced-motion`), hairline borders using `color-mix()`,
  soft layered shadows. Bento grid feature section with cards that have a spotlight hover (radial gradient following the cursor).
- **Motion**: purposeful and fast (150–400 ms, custom cubic-bezier ease-out). Scroll-driven reveal animations with CSS
  `animation-timeline: view()` (progressive enhancement, with `@supports` fallback = no animation, content visible).
  View Transitions between pages with shared-element morph for blog card → post header. Everything honours `prefers-reduced-motion`.
- **Details**: custom focus-visible rings (ember), styled text selection, custom scrollbar, smooth anchor scrolling with header offset,
  sticky header that turns translucent with `backdrop-filter` after scrolling, mobile menu as a full-screen sheet with staggered links,
  theme toggle with no flash (inline script in head), copy-button on code blocks, keyboard shortcut `/` or `Ctrl+K` opens search.
- Avoid AI-template clichés: no purple gradients, no generic 3-column icon grid with emoji, no "Unlock the power of", no stock hero illustration.
  Visuals are built with CSS/SVG (product UI mock in the hero rendered as real HTML/CSS: a fake deploy dashboard with live-looking log lines).

## Pages & sections

1. **Home**: hero (headline, sub, 2 CTAs, product UI mock, logo cloud of fictional companies as SVG wordmarks), bento features (6 cards, varied sizes),
   "how it works" 3-step with animated connecting line, code sample tabs (CLI / config / API) with Expressive Code, metrics band with count-up numbers
   (only when visible, reduced-motion → static), testimonials (marquee with pause on hover/focus, accessible), pricing teaser, FAQ (native `<details>`
   with animated height via `interpolate-size`/fallback), final CTA, rich footer (sitemap columns, newsletter form (static, `action` configurable), socials, locale switch).
2. **Pricing**: 3 tiers + enterprise, monthly/yearly toggle (no layout shift), feature comparison table (responsive: becomes stacked on mobile, sticky header on desktop), FAQ.
3. **Blog**: index with featured post + grid, tag pages, pagination, author pages, reading time, RSS (`/rss.xml`), JSON feed, related posts,
   table of contents (sticky, highlights current section via IntersectionObserver), prev/next, share links, ≥ 6 realistic MDX posts using all components.
4. **Docs**: sidebar from collection (groups, ordering, collapsible, current page highlight, mobile drawer), TOC, breadcrumbs, prev/next,
   "edit this page" link, callouts (note/tip/warning/danger), tabs, steps, file tree, cards; ≥ 10 doc pages that document THE THEME ITSELF
   (installation, configuration, customizing tokens, components reference, content authoring, i18n, deployment, accessibility, performance, FAQ).
5. **Changelog**: timeline from a collection, version badges, anchors.
6. **About**, **Contact** (accessible form with client-side validation, static endpoint configurable), **404** (on-brand, with search), **Legal** (privacy/terms templates).
7. **i18n**: English default + pt-BR (Astro i18n routing, `/pt-br/...`), all UI strings in dictionaries, hreflang + locale switcher keeping the current page.

## Components library (`src/components/`) — documented in docs with live examples

Button (variants/sizes/as-link), Badge, Card, SpotlightCard, Bento, Section, Container, Heading (eyebrow + title + lede), Icon (inline SVG set, tree-shaken),
Tabs, Accordion, Callout, Steps, FileTree, CodeTabs, Marquee, CountUp, Avatar, Testimonial, PricingCard, ComparisonTable, LogoCloud,
Newsletter, ThemeToggle, LocaleSwitcher, SearchDialog (Pagefind), Toc, Breadcrumbs, Pagination, Prose (typography for MDX), SEO (meta, OG, Twitter, JSON-LD
Organization/WebSite/BlogPosting/BreadcrumbList), Analytics slot (no tracking by default).

## Configuration

Single `src/brasa.config.ts` (typed): site name, logo, nav, footer, socials, locales, colors (accent hue override recalculates the ember scale via OKLCH),
fonts, features toggles (blog/docs/changelog/search), base path. Changing the accent hue in one place must re-theme the whole site.

## Quality bar

- `npm run build` clean; `astro check` 0 errors 0 warnings 0 hints; lint clean.
- Playwright: every route renders, no console errors, no 404 links (crawl all internal links), theme toggle persists with no flash,
  mobile menu, search opens with Ctrl+K and returns results, pricing toggle, i18n switch keeps page, reduced-motion disables animations.
- axe: 0 violations on every route in both themes. Keyboard-only navigation works everywhere (skip link, focus traps in dialogs).
- Lighthouse CI assertions ≥ 0.98 all categories (desktop and mobile presets). CLS < 0.02. Total JS per page < 20 KB gzipped (assert in a test).
- Visual check: Playwright screenshots of every page type at 375, 768, 1440 widths in both themes saved to `docs/screenshots/` and used in README.
- README.md (English) + README.pt-BR.md: hero screenshot, feature list, quick start (`npm create astro@latest -- --template hadagalberto/brasa`), configuration, deployment
  (GitHub Pages, Vercel, Netlify, Cloudflare Pages), credits for fonts/libraries with licenses. CHANGELOG.md, CONTRIBUTING.md, LICENSE.

## Hard constraints

- Never run `git push`, `gh`, `npm publish`, or deploy anything. Commit locally after each milestone (conventional commits).
- Stay inside this repository directory. Only use assets you create or that have permissive licenses (fonts via Fontsource are OFL — fine). No external image hotlinks.
