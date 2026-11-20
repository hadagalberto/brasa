/**
 * Brasa theme configuration — the single typed source of truth for site
 * identity, navigation, footer content, locales, colors, fonts and feature
 * toggles. Import `brasa` anywhere in the project (layouts, components,
 * scripts); the Astro config reads it too, so changing `colors.accentHue`
 * here re-themes the whole site, code blocks included.
 */

export interface NavLink {
  /** Visible label. */
  label: string;
  /** Absolute path ("/styleguide") or full URL for external links. */
  href: string;
  /** External links open in a new tab and get an icon. */
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface SocialLink extends NavLink {
  /** Icon name from the Icon component set. */
  icon: 'github' | 'x' | 'discord' | 'rss' | 'mail';
}

export interface LocaleConfig {
  code: string;
  label: string;
  /** HTML lang attribute value. */
  lang: string;
}

export interface BrasaConfig {
  site: {
    name: string;
    tagline: string;
    description: string;
    author: string;
    /** GitHub repository (used for nav links, socials, "edit this page"). */
    github: string;
  };
  logo: {
    /** Wordmark next to the flame mark. */
    text: string;
  };
  nav: NavLink[];
  footer: {
    columns: FooterColumn[];
    socials: SocialLink[];
    note: string;
  };
  locales: {
    default: string;
    available: LocaleConfig[];
  };
  colors: {
    /**
     * Base hue for the ember scale (OKLCH hue). 35 = deep red-orange fading
     * into amber. Everything derived from it: the gradient, accents, syntax
     * highlighting and the OG image.
     */
    accentHue: number;
  };
  fonts: {
    display: string;
    sans: string;
    mono: string;
  };
  features: {
    blog: boolean;
    docs: boolean;
    changelog: boolean;
    search: boolean;
  };
}

export const brasa: BrasaConfig = {
  site: {
    name: 'Brasa',
    tagline: 'A premium, ember-accented theme for Astro.',
    description:
      'Brasa is an open-source, dark-first theme for Astro: OKLCH design tokens, an ember accent, editorial typography and obsessive speed for SaaS sites, blogs and docs.',
    author: 'Hadagalberto Junior',
    github: 'https://github.com/hadagalberto/brasa',
  },
  logo: {
    text: 'brasa',
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Styleguide', href: '/styleguide' },
  ],
  footer: {
    columns: [
      {
        title: 'Theme',
        links: [
          { label: 'Styleguide', href: '/styleguide' },
          {
            label: 'Report an issue',
            href: 'https://github.com/hadagalberto/brasa/issues/new',
            external: true,
          },
          {
            label: 'Releases',
            href: 'https://github.com/hadagalberto/brasa/releases',
            external: true,
          },
          {
            label: 'License (MIT)',
            href: 'https://github.com/hadagalberto/brasa/blob/main/LICENSE',
            external: true,
          },
        ],
      },
      {
        title: 'Stack',
        links: [
          { label: 'Astro', href: 'https://astro.build', external: true },
          { label: 'Tailwind CSS v4', href: 'https://tailwindcss.com', external: true },
          { label: 'Expressive Code', href: 'https://expressive-code.com', external: true },
          { label: 'Fontsource', href: 'https://fontsource.org', external: true },
        ],
      },
      {
        title: 'Project',
        links: [
          { label: 'GitHub', href: 'https://github.com/hadagalberto/brasa', external: true },
          {
            label: 'Discussions',
            href: 'https://github.com/hadagalberto/brasa/discussions',
            external: true,
          },
          {
            label: 'SPEC',
            href: 'https://github.com/hadagalberto/brasa/blob/main/SPEC.md',
            external: true,
          },
        ],
      },
    ],
    socials: [
      { label: 'GitHub', href: 'https://github.com/hadagalberto/brasa', icon: 'github' },
      { label: 'X (Twitter)', href: 'https://x.com/hadagalberto', icon: 'x' },
      { label: 'Discord', href: 'https://discord.gg/brasa', icon: 'discord' },
    ],
    note: 'Brasa is open-source under the MIT license. Built with Astro, warm by design.',
  },
  locales: {
    default: 'en',
    available: [
      { code: 'en', label: 'English', lang: 'en' },
      { code: 'pt-br', label: 'Português (Brasil)', lang: 'pt-BR' },
    ],
  },
  colors: {
    /** 35 — deep red-orange embers fading into amber. */
    accentHue: 35,
  },
  fonts: {
    display: 'Fraunces Variable',
    sans: 'Geist Variable',
    mono: 'Geist Mono Variable',
  },
  features: {
    blog: true,
    docs: true,
    changelog: true,
    search: true,
  },
};
