/**
 * English UI dictionary — the source of truth for every translated string.
 * `pt-br.ts` is typed from this object, so a missing key is a compile error.
 * Content that lives in collections (blog posts, docs, changelog entries) is
 * translated there; this file owns the chrome and the static page copy.
 */

export const en = {
  common: {
    skipLink: 'Skip to content',
    search: 'Search',
    searchDialog: 'Search the site',
    searchPlaceholder: 'Search docs, guides and notes…',
    searchIntro: 'Start typing to search the whole site.',
    searchIntroTitle: 'Find a guide, a component or a field in the config.',
    searchIntroHint: 'Try a topic — or jump straight to a popular page.',
    searchNoResults: (query: string) => `Nothing matched “${query}”.`,
    searchNoResultsHint: 'Try a shorter term, or browse the documentation.',
    searchBrowseDocs: 'Browse all docs',
    searchSearching: (query: string) => `Searching for “${query}”…`,
    searchNoMatches: (query: string) => `No results for “${query}”`,
    searchMatches: (count: number, query: string) =>
      `${count} result${count === 1 ? '' : 's'} for “${query}”`,
    searchUnavailable: 'Search index unavailable',
    searchUnavailableTitle: 'Search is built with the site.',
    searchUnavailableHint: 'Run npm run build to generate the Pagefind index.',
    searchNavigate: 'navigate',
    searchOpen: 'open',
    searchClose: 'close',
    searchPowered: 'Powered by Pagefind',
    searchOpenLabel: 'Search (Ctrl K)',
    email: 'Email address',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    mainNav: 'Main',
    mainNavMobile: 'Main (mobile)',
    siteMenu: 'Site menu',
    searchMobile: 'Search documentation and notes',
    toggleTheme: 'Switch color theme',
    themeLight: 'Switch to light theme',
    themeDark: 'Switch to dark theme',
    copyLabel: 'Copy install command to clipboard',
    copied: 'Copied to clipboard',
    githubLabel: (name: string) => `${name} on GitHub`,
    language: 'Language',
    onThisPage: 'On this page',
    backToTop: 'Back to top',
    readMore: 'Read more',
    pagination: 'Pagination',
    docsPages: 'Documentation pages',
  },
  dashboard: {
    live: 'live',
    waiting: 'waiting for new pushes',
    build: 'build',
    cache: 'cache hit 97%',
    ago: (time: string) => `push · ${time} ago · 8f2k41`,
    logs: [
      'deps restored from cache · 214 packages',
      'building 214 routes on 4 runners',
      'route data prefetched · gru, iad, fra',
      'smoke tests passing — 18/18',
      'published · preview-8f2k.brasa.cloud',
    ],
  },
  nav: [
    { label: 'Home', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Docs', href: '/docs' },
    { label: 'Blog', href: '/blog' },
  ],
  footer: {
    description:
      'Brasa is an open-source, dark-first theme for Astro: OKLCH design tokens, an ember accent, editorial typography and obsessive speed for SaaS sites, blogs and docs.',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Pricing', href: '/pricing' },
          { label: 'Changelog', href: '/changelog' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Learn',
        links: [
          { label: 'Documentation', href: '/docs' },
          { label: 'Styleguide', href: '/styleguide' },
          { label: 'All essays', href: '/blog' },
          { label: 'Topics', href: '/blog/tags' },
        ],
      },
      {
        title: 'Theme',
        links: [
          { label: 'Installation', href: '/docs/installation' },
          { label: 'Components', href: '/docs/components' },
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
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy', href: '/legal/privacy' },
          { label: 'Terms', href: '/legal/terms' },
          {
            label: 'MIT license',
            href: 'https://github.com/hadagalberto/brasa/blob/main/LICENSE',
            external: true,
          },
          { label: 'RSS feed', href: '/rss.xml' },
        ],
      },
    ],
    newsletter: {
      heading: 'Notes from the forge',
      description:
        'A short letter whenever something ships — new sections, performance notes, the occasional ember screenshot. No tracking, ever.',
      placeholder: 'you@example.com',
      action: 'Subscribe',
      note: 'One email a month. Unsubscribe anytime — we would rather be missed than muted.',
      success: 'You are on the list. See you in the inbox.',
      invalid: 'Enter a valid email address.',
    },
    copyright: (year: number, author: string) =>
      `© ${year} ${author} · Released under the MIT license.`,
    note: 'Brasa is open-source under the MIT license. Built with Astro, warm by design.',
  },
  home: {
    title: 'Brasa — deploy previews for teams',
    description:
      'Brasa Cloud turns every branch into a fast, shareable, SSO-guarded preview. An open-source Astro theme with an ember soul.',
    hero: {
      eyebrow: 'Brasa Cloud · deploy previews for teams',
      title: { before: 'Every push, a ', em: 'living', after: ' preview.' },
      lede: 'Brasa Cloud turns each branch into a fast, shareable site — SSO-guarded, cache-smart and live before your coffee cools. Point your team at a URL, not a screenshot.',
      primary: 'See it in action',
      secondary: 'Star on GitHub',
      micro: 'free for public repos · no credit card · two-minute setup',
      logoCaption: 'Powering weekly release trains at',
    },
    features: {
      eyebrow: 'Why Brasa Cloud',
      title: { before: 'Previews that pull their ', em: 'weight', after: '.' },
      lede: 'Six cards, the whole story — everything that happens between your last git push and a merge you can trust.',
      cards: [
        {
          title: 'A URL for every branch',
          body: 'Each push gets a stable link that stays warm for the life of the branch. Reviewers land on the exact change — never on main, never on a zip file.',
          live: 'live',
          building: 'building',
          production: 'production',
        },
        {
          title: 'Cache that actually hits',
          body: 'Content-addressed caching restores everything that did not change. A 400-route site rebuilds in seconds, not coffee breaks.',
          hit: 'cache hit 97%',
          rebuild: 'rebuild 6.2s',
        },
        {
          title: 'Guarded by default',
          body: 'Previews sit behind your team’s SSO. Need outside eyes? Issue a per-branch password and revoke it with a click.',
          sso: 'SSO · Okta',
          password: 'branch password',
          revoked: 'revoked 2h ago',
        },
        {
          title: 'Comments in context',
          body: 'Designers and PMs comment on the preview itself. Feedback lands where the change lives, not three tools away.',
          comment: 'Hero glow is perfect. Ship it.',
          approvals: '2 approvals · merged 14:02',
        },
        {
          title: 'One-click rollbacks',
          body: 'Every deploy is a snapshot. Restore any preview or production state instantly — no git archaeology required.',
          snapshot: 'v142 → v138 · 4s · zero downtime',
        },
        {
          title: 'Slack, where you already are',
          body: 'The bot posts the preview the moment it is live. Threads, approvals and reactions stay where your team already talks.',
          slack: 'Preview ready — feat/ember-glow · 6.2s',
        },
      ],
    },
    how: {
      eyebrow: 'How it works',
      title: { before: 'Three moves. No new ', em: 'workflow', after: '.' },
      lede: 'Brasa Cloud plugs into the repository you already have. No YAML archaeology, nothing new to teach the team.',
      steps: [
        {
          title: 'Connect your repo',
          body: 'Link GitHub or GitLab in two clicks. Brasa Cloud detects your framework, build graph and environment variables — then never asks again.',
        },
        {
          title: 'Push a branch',
          body: 'Every push triggers an isolated build on shared runners. Logs stream live, and failures point at the exact commit — not the pipeline.',
        },
        {
          title: 'Share the preview',
          body: 'Grab the link, drop it in Slack or the pull request. Comments collect in context, and you merge when it feels right.',
        },
      ],
    },
    code: {
      eyebrow: 'Interface',
      title: { before: 'Three ways to ', em: 'ship', after: '.' },
      lede: 'The same platform behind three idioms — pick the one your workflow already speaks, or wire all three into CI.',
      label: 'Ways to deploy',
    },
    metrics: {
      heading: 'Brasa Cloud in numbers',
      items: [
        { value: 41, suffix: 'k+', label: 'previews served weekly', sub: 'across three regions' },
        {
          value: 99.98,
          decimals: 2,
          suffix: '%',
          label: 'preview uptime',
          sub: 'trailing twelve months',
        },
        {
          value: 4.6,
          decimals: 1,
          suffix: 's',
          label: 'median push-to-live',
          sub: 'p50, all frameworks',
        },
        {
          value: 132,
          label: 'teams shipping daily',
          sub: 'from two-person studios to platform orgs',
        },
      ],
    },
    testimonials: {
      eyebrow: 'Testimonials',
      title: { before: 'Teams that stopped ', em: 'waiting', after: ' on review.' },
      lede: 'Six of the teams shipping with Brasa Cloud every day — hover or focus the row to pause it.',
      label: 'What teams say about Brasa Cloud',
      roles: [
        'Head of Engineering, Alto Labs',
        'Staff Engineer, Fjord & Co',
        'Documentation Lead, Cadence',
        'Platform Lead, Kilnworks',
        'Partner, Studio Halfmoon',
        'Design Director, Northloop',
      ],
      quotes: [
        'Review cycles went from a day to an afternoon. Designers finally comment on the real thing instead of screenshots.',
        'We stopped saying “works on my machine”. The preview is the meeting now.',
        'The cache is honestly rude. Our 400-page docs site rebuilds in seconds flat.',
        'SSO plus per-branch passwords meant legal stopped saying no to sharing builds.',
        'Clients click one warm link and feel the site before we send an invoice.',
        'The first deploy tool our designers open on purpose. That says everything.',
      ],
    },
    pricing: {
      eyebrow: 'Pricing',
      title: { before: 'Start free. Pay when the team ', em: 'grows', after: '.' },
      lede: 'Every plan ships unlimited public previews — the difference is who needs to look at the private ones.',
      noteBefore: 'Plans, seats, limits and invoicing are covered in the',
      noteLink: 'FAQ below',
      tiers: [
        {
          name: 'Starter',
          price: '$0',
          unit: 'forever',
          blurb: 'Public repos, weekend experiments, the side project you still believe in.',
          features: [
            'Unlimited public previews',
            '2 concurrent builds',
            'GitHub & GitLab apps',
            'Community support',
          ],
          cta: 'Start for free',
        },
        {
          name: 'Team',
          price: '$12',
          unit: 'per seat / month',
          blurb: 'For product teams that open a preview before they open a pull request.',
          features: [
            'Everything in Starter',
            'Private previews with SSO',
            'Slack app + notifications',
            '30-day preview retention',
          ],
          cta: 'Try 14 days free',
        },
        {
          name: 'Enterprise',
          price: 'Custom',
          unit: '',
          blurb: 'For platform teams with audit trails, their own regions and a phone number.',
          features: [
            'Everything in Team',
            'SAML SSO + audit logs',
            'Dedicated build regions',
            'Priority queue with SLA',
          ],
          cta: 'Talk to us',
        },
      ],
    },
    faq: {
      eyebrow: 'FAQ',
      title: { before: 'The questions ', em: 'procurement', after: ' always asks.' },
      lede: 'Five minutes of reading before you write to support — or to procurement.',
      items: [
        {
          q: 'How is this different from the previews our CI already generates?',
          a: 'CI artifacts are static bundles you download and host yourself. Brasa previews are running sites: built, seeded with realistic data, guarded by your SSO and served from the region closest to your reviewer. No curling tarballs, no guessing which artifact is newest.',
        },
        {
          q: 'Can people outside our SSO see a preview?',
          a: 'Yes — issue a per-branch password from the dashboard or the CLI. It works for one branch, expires when the branch merges, and you can revoke it in a single click. Outside reviewers never touch your production auth.',
        },
        {
          q: 'What happens when a branch is merged or deleted?',
          a: 'The preview is garbage-collected within the hour, and its URL returns a warm, branded “this branch merged” page instead of a hard 404. Links in old pull requests keep telling the right story.',
        },
        {
          q: 'Do preview builds burn our CI minutes?',
          a: 'No. Builds run on Brasa’s isolated runners, sized per framework, with content-addressed caching that skips anything your last build already produced. Your CI keeps doing what it does best: tests.',
        },
        {
          q: 'Can we self-host Brasa Cloud?',
          a: 'Enterprise plans run single-tenant images inside your own VPC, with your object storage and your SSO. The open-source heart of the platform — including the theme you are looking at — stays MIT.',
        },
      ],
    },
    cta: {
      eyebrow: 'Get started',
      title: { before: 'Give every branch somewhere to ', em: 'glow', after: '.' },
      lede: 'This page is the Brasa theme’s home demo — one accent hue in one config file away from being yours. MIT-licensed, self-host-friendly, zero JS frameworks.',
      primary: 'Get the theme — it’s MIT',
      secondary: 'Explore the styleguide',
    },
  },
  pricing: {
    eyebrow: 'Pricing',
    title: { before: 'Honest prices, ', em: 'warm', after: ' math.' },
    lede: 'Start free on public repos. Upgrade when your team needs private previews, SSO and a faster queue. Every plan includes unlimited public previews.',
    monthly: 'Monthly',
    yearly: 'Yearly',
    save: 'Save 20%',
    perMonth: '/ month',
    billedYearly: 'billed yearly',
    mostPopular: 'Most popular',
    tiers: [
      {
        name: 'Starter',
        monthly: '$0',
        yearly: '$0',
        unit: 'forever',
        blurb: 'For public repos, experiments and the side project that refuses to die.',
        features: [
          'Unlimited public previews',
          '2 concurrent builds',
          'GitHub & GitLab apps',
          'Community support',
          '7-day build logs',
        ],
        cta: 'Start for free',
      },
      {
        name: 'Team',
        monthly: '$12',
        yearly: '$9',
        unit: 'per seat / month',
        blurb: 'For product teams that review in a browser, not a screenshot thread.',
        features: [
          'Everything in Starter',
          'Private previews with SSO',
          'Slack app + notifications',
          '30-day preview retention',
          'Per-branch passwords',
          'Comments on previews',
        ],
        cta: 'Start 14-day trial',
      },
      {
        name: 'Business',
        monthly: '$24',
        yearly: '$19',
        unit: 'per seat / month',
        blurb: 'For growing orgs that need governance without a procurement marathon.',
        features: [
          'Everything in Team',
          'SAML SSO + SCIM',
          'Audit logs',
          'Role-based access',
          '90-day preview retention',
          'Shared build cache',
        ],
        cta: 'Choose Business',
      },
      {
        name: 'Enterprise',
        monthly: 'Custom',
        yearly: 'Custom',
        unit: 'annual contract',
        blurb: 'For platform teams with their own regions, storage and security review.',
        features: [
          'Everything in Business',
          'Single-tenant or VPC deploy',
          'Dedicated build regions',
          'Priority queue with SLA',
          'Custom retention policies',
          'Named support engineer',
        ],
        cta: 'Talk to us',
      },
    ],
    compare: {
      eyebrow: 'Compare plans',
      title: 'Every detail, side by side',
      lede: 'A quiet table, the whole answer. On small screens each tier becomes a card so nothing gets lost sideways.',
      tier: 'Plan',
      groups: ['Builds', 'Collaboration', 'Security & governance', 'Support'],
      rows: [
        {
          label: 'Public preview projects',
          values: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'],
        },
        { label: 'Private preview projects', values: ['—', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { label: 'Concurrent builds', values: ['2', '6', '16', 'Custom'] },
        { label: 'Preview retention', values: ['7 days', '30 days', '90 days', 'Custom'] },
        { label: 'Content-addressed cache', values: [true, true, true, true] },
        { label: 'Comments on previews', values: [false, true, true, true] },
        { label: 'Slack notifications', values: [false, true, true, true] },
        { label: 'Team SSO (OAuth)', values: [false, true, true, true] },
        { label: 'SAML SSO + SCIM', values: [false, false, true, true] },
        { label: 'Audit log', values: [false, false, true, true] },
        { label: 'Deployment regions', values: ['Shared', 'Shared', 'Shared + 1', 'Dedicated'] },
        {
          label: 'Support',
          values: ['Community', 'Email', 'Priority email', 'Named engineer + SLA'],
        },
      ],
      included: 'Included',
      notIncluded: 'Not included',
    },
    faq: {
      eyebrow: 'Questions',
      title: 'Before you pick a tier',
      lede: 'The five we answer most often. Still curious? Write to us — a human replies.',
      items: [
        {
          q: 'Can I switch plans later?',
          a: 'Yes. Upgrades apply immediately and are prorated to the day. Downgrades take effect at the end of the billing period, and nothing already built is removed.',
        },
        {
          q: 'What counts as a seat?',
          a: 'A seat is a person who can start a preview or leave a comment. Viewers who only receive a private link are free on every plan.',
        },
        {
          q: 'Do you offer discounts for open source and education?',
          a: 'Yes — Team is free for maintainers of public open-source projects and for full-time students. Send us a link and we will enable it the same day.',
        },
        {
          q: 'How does yearly billing work?',
          a: 'You pay once for twelve months and the displayed monthly rate is the effective price. The toggle above never moves the cards, only the numbers.',
        },
        {
          q: 'Is there a free trial for private previews?',
          a: 'Fourteen days, no card. You can invite your whole team, connect SSO and keep every preview built during the trial if you upgrade.',
        },
        {
          q: 'What happens if I cancel?',
          a: 'Your data stays exportable for 30 days. Previews stop building, but public links keep working until the end of the period you paid for.',
        },
      ],
    },
    cta: {
      title: { before: 'Still deciding? ', em: 'Try it', after: ' on a real branch.' },
      lede: 'Connect a public repository and see the first preview in under two minutes. No card, no sales call.',
      primary: 'Start for free',
      secondary: 'Talk to us',
    },
  },
  changelog: {
    eyebrow: 'Changelog',
    title: { before: 'What ', em: 'changed', after: ',' },
    lede: 'Every release of Brasa Cloud and the open-source theme, in one honest timeline. Dates are the day the change went live.',
    feed: 'RSS feed',
  },
  about: {
    eyebrow: 'About',
    title: { before: 'Built by people who ', em: 'hated', after: ' waiting for previews.' },
    lede: 'Brasa is a small, independent project about a simple idea: review the thing itself, not a screenshot of it. The theme you are reading is open source and always will be.',
    story: {
      eyebrow: 'The short version',
      title: 'A deploy tool, then a theme',
      paragraphs: [
        'Brasa Cloud started in 2024 as an internal tool for a team tired of arguing about builds that only existed on somebody’s laptop. It did one job: turn a branch into a link anyone could open.',
        'The interface around it became the interesting part. We kept rebuilding the same dark surfaces, warm ember accents and editorial type on every project, so we extracted them into an Astro theme and gave it the same name.',
        'Today the theme is the public heart of the project. It ships with real content, an accessible component library and enough opinions to make a new site feel finished on day one — while staying easy to take apart.',
      ],
    },
    values: {
      eyebrow: 'What we hold onto',
      title: 'Three rules, no posters',
      items: [
        {
          title: 'Fast is a feature',
          body: 'A page that arrives instantly feels expensive. We ship less JavaScript than most icons packs and treat Lighthouse as a floor, not a goal.',
        },
        {
          title: 'Warm, not loud',
          body: 'Dark surfaces layered by lightness, one ember accent, type with a little personality. Restraint does more than another gradient.',
        },
        {
          title: 'Open by default',
          body: 'The theme is MIT. The docs explain the why, not just the how, so you can leave whenever you want — and take the good parts with you.',
        },
      ],
    },
    numbers: {
      heading: 'Brasa in numbers',
      items: [
        { value: 132, label: 'teams shipping daily' },
        { value: 41, suffix: 'k', label: 'previews each week' },
        { value: 12, label: 'chapters in the manual' },
        { value: 100, suffix: '%', label: 'open source' },
      ],
    },
    author: {
      eyebrow: 'The human behind it',
      title: 'Hadagalberto Junior',
      role: 'Designer, developer and keeper of the ember',
      body: 'I design and build interfaces in São Paulo, Brazil. Brasa is what happens when a design system obsession meets an unreasonable tolerance for rewriting CSS at midnight. The Portuguese you read here is native, not a machine afterthought.',
      cta: 'Say hello',
    },
    cta: {
      title: { before: 'Take the theme for a ', em: 'spin', after: '.' },
      lede: 'MIT-licensed, self-host-friendly and one config file away from being yours.',
      primary: 'Read the docs',
      secondary: 'See the styleguide',
    },
  },
  contact: {
    eyebrow: 'Contact',
    title: { before: 'Talk to a ', em: 'human', after: '.' },
    lede: 'Questions about the theme, a billing detail or a preview that misbehaved? Write once — we answer every message, usually within a business day.',
    form: {
      title: 'Send a message',
      description:
        'Fields marked with an asterisk are required. Nothing is tracked; the form has a static endpoint you can swap in config.',
      name: 'Your name',
      namePlaceholder: 'Marina Cole',
      email: 'Email address',
      emailPlaceholder: 'you@company.com',
      topic: 'What is this about?',
      topicPlaceholder: 'Choose a topic',
      topics: [
        'Question about the theme',
        'Pricing and billing',
        'Technical support',
        'Partnership or press',
        'Something else',
      ],
      message: 'Message',
      messagePlaceholder: 'Tell us what you are building — and what is in the way.',
      consent: 'I agree that my message may be stored to answer this conversation.',
      submit: 'Send message',
      sending: 'Sending…',
      successTitle: 'Message sent.',
      successBody:
        'Thanks for writing. We will get back to you at the address you gave us — usually within one business day.',
      reset: 'Send another message',
      errors: {
        name: 'Please enter your name (at least two characters).',
        email: 'Please enter a valid email address.',
        topic: 'Please choose a topic.',
        message: 'Please write at least twenty characters so we can help.',
        consent: 'Please agree before sending your message.',
      },
    },
    details: {
      title: 'Other ways in',
      emailTitle: 'Email',
      emailBody: 'hello@brasa.cloud',
      githubTitle: 'GitHub',
      githubBody: 'Issues, discussions and releases live in the open.',
      responseTitle: 'Response time',
      responseBody: 'Within one business day, in English or Portuguese.',
    },
    faq: {
      eyebrow: 'Before you write',
      title: 'Answers that save a round trip',
      items: [
        {
          q: 'Where do I report a bug in the theme?',
          a: 'Open an issue on GitHub with the smallest reproduction you can manage. Include your Astro and Brasa versions, and a link if the page is public.',
        },
        {
          q: 'Do you offer consulting?',
          a: 'Occasionally, for teams adopting the theme at scale. Tell us about the project and we will be honest about whether we are the right fit.',
        },
        {
          q: 'Can I use the theme commercially?',
          a: 'Yes. The MIT license allows commercial use, modification and redistribution. Keep the license file and you are done.',
        },
      ],
    },
  },
  legal: {
    eyebrow: 'Legal',
    updated: 'Last updated',
    privacy: {
      title: 'Privacy',
      description: 'What Brasa Cloud and this theme collect, why, and how to make it stop.',
      intro:
        'We collect as little as we can. This page describes the data handled by the Brasa Cloud demo service and by this static theme. It is written to be read, not to be skipped.',
      sections: [
        {
          heading: '1. Who is responsible',
          paragraphs: [
            'Brasa Cloud is an independent project maintained by Hadagalberto Junior. For questions about data, write to hello@brasa.cloud.',
          ],
        },
        {
          heading: '2. What we collect',
          paragraphs: [
            'When you contact us, we store the name, email, topic and message you submit so we can reply. When you deploy a preview, we store build logs and the commit metadata needed to show that preview.',
          ],
          list: [
            'Contact form submissions',
            'Build logs and commit references',
            'Aggregate, anonymous page-view counts',
            'Newsletter email address, if you subscribe',
          ],
        },
        {
          heading: '3. What we do not collect',
          paragraphs: [
            'There are no advertising trackers, no third-party analytics scripts and no session recordings on this site. The theme ships with no tracking by default. We do not sell personal data, ever.',
          ],
        },
        {
          heading: '4. Cookies and local storage',
          paragraphs: [
            'The only data stored in your browser is your theme preference (dark or light), kept in local storage so the page does not flash on load. Pagefind runs entirely in your browser and does not phone home with your queries.',
          ],
        },
        {
          heading: '5. How long we keep data',
          paragraphs: [
            'Contact messages are kept for twelve months. Preview logs follow your plan’s retention window. Newsletter addresses stay until you unsubscribe.',
          ],
        },
        {
          heading: '6. Your rights',
          paragraphs: [
            'You can ask for a copy of your data, a correction, or deletion at any time. Write to hello@brasa.cloud and we will answer within thirty days. If you subscribed to the newsletter, every email includes a one-click unsubscribe link.',
          ],
        },
        {
          heading: '7. Changes to this policy',
          paragraphs: [
            'If the policy changes materially, we will note the date above and, when the change affects you, send a direct email. The previous versions remain in the project repository.',
          ],
        },
      ],
    },
    terms: {
      title: 'Terms',
      description: 'The short, readable terms for using Brasa Cloud and the Brasa theme.',
      intro:
        'These terms cover the Brasa Cloud demo service and the use of the open-source theme. The theme itself is licensed under MIT; the service has the practical rules below.',
      sections: [
        {
          heading: '1. Using the service',
          paragraphs: [
            'You may use Brasa Cloud to build and share previews for repositories you own or are authorised to work on. Do not use the service to distribute malware, impersonate others or attack infrastructure.',
          ],
        },
        {
          heading: '2. Your content',
          paragraphs: [
            'You keep ownership of your code, copy and data. You grant us a limited licence to build and serve it solely to provide previews you asked for. We do not use your repositories to train models or for advertising.',
          ],
        },
        {
          heading: '3. Fair use',
          paragraphs: [
            'Free plans are for public repositories and non-commercial experiments. Commercial use of private previews requires a paid plan. We may throttle anomalous build volume, but we will tell you before anything is suspended.',
          ],
        },
        {
          heading: '4. Open-source theme',
          paragraphs: [
            'The Brasa Astro theme is provided under the MIT license, without warranty. You may copy, modify and ship it in commercial projects provided the license notice is retained. Fonts and third-party libraries keep their own licenses.',
          ],
        },
        {
          heading: '5. Availability',
          paragraphs: [
            'We aim for continuous availability but do not guarantee it. Scheduled maintenance is announced in the changelog. Paid plans with an SLA follow the terms in that agreement.',
          ],
        },
        {
          heading: '6. Termination',
          paragraphs: [
            'You can stop using the service at any time. We may suspend an account that repeatedly breaks these terms, with notice where possible. Data export stays available for thirty days after termination.',
          ],
        },
        {
          heading: '7. Contact',
          paragraphs: [
            'Questions about these terms go to hello@brasa.cloud. We answer within one business day and would rather clarify than enforce.',
          ],
        },
      ],
    },
  },
  notFound: {
    title: 'Page not found',
    eyebrow: 'Error 404',
    heading: { before: 'This ember', em: 'burnt out', after: '.' },
    body: 'The page you are after does not exist — it may have moved, or the URL lost a spark. Try the search, or start again from the home page.',
    searchLabel: 'Search the site',
    searchPlaceholder: 'What were you looking for?',
    primary: 'Back home',
    secondary: 'Browse the docs',
    suggestions: 'Popular pages',
  },
  blog: {
    allEssays: 'All essays',
    featured: 'Featured',
    latest: 'Latest writing',
    readTime: (minutes: number) => `${minutes} min read`,
    by: (author: string) => `By ${author}`,
    writtenBy: 'Written by',
    readEssays: (count: number) => (count === 1 ? 'Read their essay' : `Read all ${count} essays`),
    updated: 'Updated',
    tags: 'Topics',
    allTags: 'All topics',
    tagCount: (count: number) => `${count} ${count === 1 ? 'essay' : 'essays'}`,
    authors: 'Authors',
    postsBy: (author: string) => `Essays by ${author}`,
    related: 'Keep reading',
    prev: 'Older essay',
    next: 'Newer essay',
    share: 'Share this essay',
    shareOn: (network: string) => `Share on ${network}`,
    copyLink: 'Copy link',
    linkCopied: 'Link copied to clipboard',
    page: (n: number) => `Page ${n}`,
    prevPage: 'Previous page',
    nextPage: 'Next page',
    onThisPage: 'On this page',
    noPosts: 'No essays here yet.',
    backToBlog: 'Back to all essays',
    pages: {
      eyebrow: 'The forge · essays',
      title: { before: 'Notes from the ', em: 'forge', after: ' ' },
      lede: 'Essays on deploy previews, performance, accessibility and design systems — written while building the Brasa theme, with the receipts attached.',
      description:
        'Notes from the forge — essays on deploy previews, performance, accessibility and design systems, from the team building the Brasa theme.',
      subscribe: 'Subscribe',
      topicsLabel: 'Topics',
      all: 'all',
      featuredLabel: 'Featured essay',
      latestLabel: 'Latest essays',
      tags: {
        eyebrow: 'The forge · topics',
        title: 'Browse by topic',
        lede: (topicCount: number, essayCount: number) =>
          `${topicCount} ${topicCount === 1 ? 'topic' : 'topics'} across ${essayCount} ${essayCount === 1 ? 'essay' : 'essays'}. Every tag page is a complete reading list.`,
        aria: 'All topics',
        description:
          'Every topic on the Brasa blog: deploy previews, performance, accessibility, design systems and engineering culture.',
      },
      tagPage: {
        eyebrow: 'Topic',
        count: (count: number) => `${count} ${count === 1 ? 'essay' : 'essays'}, newest first.`,
        description: (label: string) => `Every essay on the Brasa blog tagged “${label}”.`,
        aria: (label: string) => `Essays tagged ${label}`,
      },
      archive: {
        eyebrow: 'The forge · archive',
        lede: 'The archive, newest first. The front page keeps the featured essay and the latest six.',
        back: 'Back to the front page',
        sectionLabel: (page: number) => `Essays, page ${page}`,
      },
      author: {
        eyebrow: 'Author',
        count: (count: number) => (count === 1 ? 'Their essay' : `All ${count} essays`),
      },
    },
  },
  docs: {
    title: 'Documentation',
    shortTitle: 'Docs',
    indexEyebrow: 'The manual',
    indexTitle: 'Everything Brasa, in one place',
    indexLede:
      'Twelve short chapters that take you from an empty repo to a shipped theme. Start at the top or jump to what you need.',
    updated: 'Updated',
    pageCount: (count: number) => `${count} pages in this manual`,
    browse: 'Browse docs',
    navigation: 'Documentation navigation',
    sections: 'Documentation sections',
    onThisPage: 'On this page',
    backToTop: 'Back to top',
    edit: 'Edit this page',
    previous: 'Previous',
    next: 'Next',
    pages: {
      eyebrow: 'The manual · v0.1',
      title: { before: 'Make it ', em: 'yours', after: ' . Then ship it.' },
      lede: 'Brasa is a complete Astro theme, not a starter with half the wiring missing. This manual covers every surface — tokens, content collections, MDX components, search, accessibility — with examples you can paste into your own project.',
      description:
        'The Brasa manual: installation, configuration, design tokens, content authoring, components, accessibility, performance and deployment.',
      startInstallation: 'Start with installation',
      searchDocs: 'Search the docs',
      stats: { pages: 'Pages', sections: 'Sections', license: 'License' },
      startHere: {
        eyebrow: 'Start here',
        title: 'Three steps to a running site',
        lede: 'Everything after this is optional. These three pages are the path most people take.',
        cards: [
          {
            title: 'Installation',
            description:
              'Scaffold a project, install dependencies and run the local preview in under two minutes.',
            meta: '01 · Start here',
          },
          {
            title: 'Configuration',
            description:
              'The single typed config file: identity, navigation, locales, features and accent hue.',
            meta: '02 · Make it yours',
          },
          {
            title: 'Design tokens',
            description:
              'OKLCH colors, fluid type, radii and motion — and how to override all of them safely.',
            meta: '03 · The palette',
          },
        ],
      },
      groups: {
        'Getting started': 'Getting started',
        Guides: 'Guides',
        Reference: 'Reference',
        Resources: 'Resources',
      },
      groupCopy: {
        'Getting started':
          'Install the theme, set the site-wide config and re-theme the palette in one place.',
        Guides: 'Author content, localize copy and ship the static output anywhere.',
        Reference:
          'Every component, design token and accessibility decision, documented with live examples.',
        Resources: 'Answers to the questions that come up after the first deploy.',
      },
      pagesLabel: (count: number) => `${count} pages`,
      help: {
        eyebrow: 'Still stuck?',
        title: 'Read the FAQ or open an issue',
        lede: 'The FAQ covers the common setup surprises. For everything else, the repository’s discussions are the right place — bugs included.',
        cta: 'Read the FAQ',
      },
    },
  },
  styleguide: {
    title: 'Styleguide',
    description:
      'Every Brasa design token and component, live in both themes: OKLCH colors, fluid type, spacing, shadows, motion and the full component library.',
    intro: {
      eyebrow: 'Design system',
      title: 'Every token, both themes.',
      lede: 'One accent hue drives the whole palette — the swatches below read their live computed values. Pin your theme with the toggle in the header; the panels under Color render both themes side by side.',
      hueLabel: 'Accent hue — live demo',
      hueBodyBefore:
        'Drag to re-derive the ember scale, gradients, glow and syntax colors. It is how',
      hueBodyAfter: 're-themes the site from one number.',
    },
    color: {
      eyebrow: 'Color',
      title: 'OKLCH surfaces, warm ink.',
      lede: 'Dark-first: a near-black canvas with a hint of brown, surfaces layered by lightness, hairlines mixed with ink. Light mode is warm paper with the same ember accent.',
      darkBadge: 'Dark · default',
      lightBadge: 'Light',
      emberScale: 'Ember scale — hue-relative',
      sameBothThemes: 'same in both themes',
      gradientAria: 'The ember gradient, from deep red-orange to amber',
    },
    typography: {
      eyebrow: 'Typography',
      title: 'Editorial serif, precise grotesk.',
      lede: 'Fraunces with optical sizing for display, Geist for UI and body, Geist Mono for code and eyebrows. The scale is fluid (clamp) and tightens tracking as it grows.',
      fontPairing: 'Font pairing',
      pairingBefore: 'Grotesk structure with',
      pairingEm: 'serif emphasis',
      pairingAfter: '— display italic for the words that carry heat.',
      families: 'Families',
      familyFraunces: 'Fraunces Variable — display, opsz 9–144, italic',
      familyGeist: 'Geist Variable — UI & body, wght 100–900',
      familyMono: 'Geist Mono Variable — code, eyebrows, meta',
    },
    space: {
      eyebrow: 'Space, radius, elevation',
      title: 'Generous radii, soft depth.',
      lede: 'A 0.25rem base spacing scale, rounded corners that never exceed 2rem, and shadows layered warm rather than black.',
      spacing: 'Spacing',
      radii: 'Radii',
      shadows: 'Shadows',
    },
    motion: {
      eyebrow: 'Motion',
      title: 'Fast, soft, purposeful.',
      lede: "150–400ms on a custom cubic-bezier ease-out. Hover the tracks to compare curves. This page's headings reveal with animation-timeline: view() — scroll to watch. Everything yields to prefers-reduced-motion.",
      durations: 'Durations: --dur-1 150ms · --dur-2 250ms · --dur-3 400ms',
      texture: 'Texture',
      textureBody:
        'A film-grain overlay (SVG turbulence at very low opacity) sits above every page, and heroes carry a slow ember glow that follows your pointer — try the box below.',
      glowHint: 'move your pointer here',
    },
    a11y: {
      eyebrow: 'Accessibility details',
      title: 'Ember focus, warm selection.',
      lede: 'Focus rings are ember with a 3px offset. Text selection tints with the accent. The scrollbar is thin and warm. Tab through the buttons to see the ring.',
      selectionBody:
        'Try selecting this sentence — the highlight tints with ember and keeps the warm ink readable.',
      tabToMe: 'Tab to me',
      thenMe: 'Then me',
      andMe: 'And me',
    },
    components: {
      eyebrow: 'Components',
      title: 'The core library, live.',
      lede: 'Every component below is the real production markup — the same instances the site renders with. Flip the header toggle to audit both themes.',
      button: {
        label: 'Button',
        primary: 'Primary',
        secondary: 'Secondary',
        ghost: 'Ghost',
        link: 'Link',
        disabled: 'Disabled',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        asAnchor: 'As anchor',
      },
      badge: {
        label: 'Badge',
        ember: 'ember',
        solid: 'solid',
        outline: 'outline',
        neutral: 'neutral',
      },
      card: {
        label: 'Card',
        staticTitle: 'Static card',
        staticBody: 'A quiet surface with a hairline border and the smallest elevation.',
        interactiveTitle: 'Interactive card',
        interactiveBody: 'Hovers lift a step, the border warms up, the shadow deepens.',
      },
      spotlight: {
        label: 'SpotlightCard',
        hoverTitle: 'Spotlight hover',
        hoverBody: 'A radial wash and an ember edge follow your cursor across the card.',
        themesTitle: 'Both themes',
        themesBody:
          'The effect reads the semantic accent, so it re-themes with the hue demo above.',
        reducedTitle: 'Reduced motion',
        reducedBody: 'Transitions collapse to zero for users who prefer reduced motion.',
      },
      heading: {
        label: 'Heading',
        sectionEyebrow: 'Section heading',
        sectionTitle: 'Eyebrow, title, lede.',
        sectionLede:
          'Aligned to the start by default, with a balanced title and a pretty lede at a comfortable measure.',
        centeredEyebrow: 'Centered variant',
        centeredTitle: 'Same parts, centered.',
        centeredLede:
          'For closing CTAs and section pivots — the eyebrow dashes mirror on both sides.',
      },
      icon: { label: 'Icon' },
      prose: {
        label: 'Prose',
        title: 'Prose, for long-form MDX',
        lede: 'Everything a blog post or docs page needs: links that',
        link: 'underline softly',
        strong: 'strong emphasis',
        afterStrong: ' in warm ink,',
        em: 'italic asides',
        afterEm: ', inline ',
        beforeKbd: ', keyboard hints like ',
        tail: ', lists that mark with ember, quotes set in the display italic, and tables with hairline rules.',
        ul: [
          'Unordered items carry a small ember dash,',
          'aligned to the text rhythm,',
          'never the browser default dot.',
        ],
        ol: ['Ordered lists keep the mono numerals,', 'tinted with the accent.'],
        quote: '“The palette is the product. Get the embers right and everything else follows.”',
        figureAria: 'Brasa brand plate: the flame mark over the ember scale',
        svgHue: 'ember · oklch · hue 35',
        caption: 'Figure captions are centered, small and quiet.',
        table: {
          token: 'Token',
          role: 'Role',
          notes: 'Notes',
          canvasRole: 'page background',
          canvasNotes: 'near-black with brown warmth',
          surfaceRole: 'raised layers',
          surfaceNotes: 'lightness, not borders',
          emberRole: 'the accent',
        },
      },
    },
    typeScale: {
      hero: 'Sites that still glow',
      display: 'Deploy previews for teams',
      bodyLg: 'Body copy is set in Geist at a fluid size with generous leading.',
      body: 'Secondary body copy inherits the base 1rem size and a 1.75 rhythm.',
      mono: 'const ember = oklch(0.685 0.19 35);',
    },
  },
};

export type Dictionary = typeof en;
