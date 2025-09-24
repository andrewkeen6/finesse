# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Astro project for a Professional Car & Marine detailing service in New York. 
The website should:
- Be responsive, fast, and purely informational
- Contain information about services performed, gallery of pictures of past work, and offer contact / location information
- Be styled with a modern clean approach. Can use tailwind or CSS modules as long as styles / colors are centralized.

## Architecture

- **Framework**: Astro v5.13.10 with TypeScript
- **Build System**: Astro's built-in build system (Vite-based)
- **TypeScript Configuration**: Extends `astro/tsconfigs/strict` for strict type checking
- **Project Structure**: Standard Astro layout with `src/pages/` for routes, `src/components/` for components, and `public/` for static assets

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server at localhost:4321 |
| `npm run build` | Build production site to `./dist/` |
| `npm run preview` | Preview production build locally |
| `npm run astro` | Run Astro CLI commands |

## Key Files and Directories

- `src/pages/` - File-based routing (`.astro` and `.md` files)
- `src/components/` - Reusable Astro/React/Vue/Svelte components
- `public/` - Static assets served directly
- `astro.config.mjs` - Astro configuration (currently using defaults)
- `tsconfig.json` - TypeScript configuration with strict settings