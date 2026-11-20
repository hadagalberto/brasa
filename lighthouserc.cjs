/**
 * Lighthouse CI configuration.
 *
 * Collects results from the built static site in ./dist and asserts a minimum
 * score of 0.98 on all four Lighthouse categories, for both the mobile and the
 * desktop presets (CI runs `autorun` twice, once per preset).
 *
 * Results are written to ./.lighthouseci and never uploaded anywhere.
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      // The 404 page is intentionally noindexed, so its SEO is not audited.
      url: ['index.html', 'styleguide/index.html', 'docs/installation/index.html'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.98 }],
        'categories:accessibility': ['error', { minScore: 0.98 }],
        'categories:best-practices': ['error', { minScore: 0.98 }],
        'categories:seo': ['error', { minScore: 0.98 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.02 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
