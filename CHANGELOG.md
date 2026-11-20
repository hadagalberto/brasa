# Changelog

All notable changes to Brasa are documented here. The demo product's release
notes also live on the site at `/changelog` (English and `/pt-br/changelog`).

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Full visual review at 375 / 768 / 1440 px in dark and light themes, with
  reference captures saved to `docs/screenshots/` for every page type.
- `README.pt-BR.md`, `CHANGELOG.md`, `CONTRIBUTING.md` and `CREDITS.md`.
- English and Portuguese RSS + JSON feed endpoints.
- Standalone `Organization` JSON-LD node and a configurable contact endpoint.
- Cross-platform CI matrix (Linux, macOS, Windows) with IPv4-pinned test servers.

### Fixed

- Sticky header background now activates for programmatic scrolls and restored
  scroll positions, with regression tests in both themes.
- Pagefind excerpts no longer surface raw code, file trees or JSX prop syntax;
  heading-anchored sub-results are surfaced in the search dialog.
- Full-page captures disable scroll reveals so no section is hidden.

## [2.4.0] — 2026-11-18

### Added

- Comment anchors that survive a rebuild.
- Per-branch links that copy the current viewport.
- Portuguese (Brazil) interface and content.

### Changed

- Preview cards show build provenance.
- Cache keys include the framework version.

## [2.3.2] — 2026-10-29

### Fixed

- Cold builds now reuse cached layers instead of restoring everything.
- Large monorepos no longer time out on the first run.

### Changed

- Build logs stream with tighter batching.

## [2.3.0] — 2026-10-11

### Added

- Commit-level rollback with a visible status timeline.
- Branch-level environment variables.

### Changed

- Deploy queue groups previews by branch.

## [2.2.1] — 2026-09-23

### Fixed

- Stale preview links after a force push.
- Log streaming stopped when a tab was backgrounded.

## [2.2.0] — 2026-09-02

### Added

- Shareable preview links with expiry.
- Build log search and line anchors.

### Changed

- The preview list loads incrementally.

## [2.1.0] — 2026-07-30

### Added

- Preview environments for every pull request.
- Team regions and per-region build status.

[Unreleased]: https://github.com/hadagalberto/brasa/compare/v2.4.0...HEAD
[2.4.0]: https://github.com/hadagalberto/brasa/compare/v2.3.2...v2.4.0
[2.3.2]: https://github.com/hadagalberto/brasa/compare/v2.3.0...v2.3.2
[2.3.0]: https://github.com/hadagalberto/brasa/compare/v2.2.1...v2.3.0
[2.2.1]: https://github.com/hadagalberto/brasa/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/hadagalberto/brasa/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/hadagalberto/brasa/releases/tag/v2.1.0
