# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog ("Data Dave's Blog") built with Hugo using the DoIt theme. Hosted on Netlify with automatic deploys from `main`. GitHub Actions runs a build check and markdown linting on push to `main`.

## Commands

```bash
# Dev server (with full re-renders)
hugo server --disableFastRender

# Production build
hugo --minify

# Markdown linting (matches CI)
npx markdownlint '**/*.md' --disable MD013

# Initialize/update theme submodule
git submodule update --init --recursive
```

## Architecture

- **Theme**: DoIt (git submodule in `themes/DoIt/`). Do not edit theme files directly — use Hugo's override mechanism by placing files in the project-level `layouts/` or `assets/` directories.
- **Content**: Blog posts live in `content/posts/` as Markdown with YAML front matter. The front matter schema is defined in `static/admin/config.yml` (Decap CMS config).
- **Custom shortcodes**: `layouts/shortcodes/` contains interactive HTML shortcodes (e.g., `kreuzungen-globe.html`, `rtree-*.html`, `location-frequency.html`) used in posts via `{{</* shortcode-name */>}}`.
- **Layout overrides**: `layouts/partials/`, `layouts/_default/`, and `layouts/posts/` override the DoIt theme's templates.
- **Static assets**: Media for posts goes in `static/media/<post-slug>/`. GPX data files go in `data/`.
- **Config**: `hugo.toml` — site configuration, menus, params, analytics (Umami).
- **Goldmark**: `unsafe = true` is enabled in the Markdown renderer, so raw HTML in content files is rendered.
