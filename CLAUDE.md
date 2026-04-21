# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio site for Les John Paul Oliver — a single-page Next.js 16 (App Router) app with a Tron-style WebGL hero, GSAP-driven section reveals, a custom cursor, and one secondary route (`/pandora`) showcasing a Three.js scene. The root `README.md` is a GitHub profile README, not project documentation — ignore it when reasoning about this codebase.

## Commands

```bash
npm run dev       # next dev — local development server
npm run build     # next build — production build
npm run start     # next start — run the production build
npm run lint      # eslint (flat config in eslint.config.mjs)
```

There is no test runner configured. Do not invent one.

### Node version

`package.json` does not pin an engines field, but the dependency tree (Next 16, React 19, Astro/Vite toolchains pulled in transitively by some scripts) expects **Node 20.3+ or 22+**. Node 21 triggers `EBADENGINE` warnings and can crash on install. If you see such warnings, confirm the Node version with the user before retrying — don't blindly re-run.

## Architecture

### Rendering model
- **App Router** with a single root layout (`src/app/layout.tsx`) + the landing page (`src/app/page.tsx`).
- `page.tsx` is a server component that stacks section components; the heavy interactive ones mark themselves `"use client"` internally.
- WebGL / Three.js components are imported via `next/dynamic` with `ssr: false` (see `HeroGrid` in `src/components/sections/hero-section.tsx`). Keep it that way — SSR'ing `@react-three/fiber` will break hydration.
- `src/app/layout.tsx` injects two `application/ld+json` blocks (Person + WebSite schema) and preconnects to `api.fontshare.com` for the Clash Display / Satoshi fonts. Any metadata/SEO change goes here.

### Data flow
- `src/data/portfolio-data.ts` is the single source of truth for personal info, stats, skills, experience, projects, and credentials. Section components import from it — they do not hardcode content. Resumes in `docs/Resume/*.docx` are the upstream source, and the file's top-of-file comment asserts every number is defensible against them.

### Styling / design tokens
- **Tailwind CSS v4** using the PostCSS plugin (`postcss.config.mjs` → `@tailwindcss/postcss`). There is no `tailwind.config.*` — configuration lives in `src/app/globals.css` under `@theme inline { ... }`.
- **shadcn/ui** configured as `style: "new-york"`, `baseColor: "neutral"`, icon library `lucide`, aliases in `components.json`. Primitives live in `src/components/ui/`.
- Brand accent is gold `#d4af37` (see `hero-grid.tsx`, exposed via `--color-gold` CSS vars). Fonts: Clash Display (display), Satoshi (body, via Fontshare CDN), JetBrains Mono (mono, via `next/font`).
- `globals.css` forces `cursor: none !important` globally and relies on `<CustomCursor />` in the root layout. Touch devices re-enable the system cursor via a `@media (hover: none) and (pointer: coarse)` override. Don't add per-element `cursor-*` utilities expecting them to win.

### Theming
- `ThemeProvider` in `src/components/layout/theme-provider.tsx` is a hand-rolled `"dark" | "light" | "system"` provider that toggles a class on `<html>`, persists to `localStorage["portfolio-theme"]`, and hides children until mounted to avoid FOUC. It is **not** `next-themes`. Use `useTheme()` from this file, not from a library.

### Animation layer
- All GSAP logic is centralized in `src/hooks/useGSAP.ts`: `useScrollReveal`, `useHeroAnimation`, `useMagneticEffect`, `useParallax`, `useTextScramble`, `useCountUp`. Register `ScrollTrigger` lazily (the file already guards `typeof window !== "undefined"`).
- The hero animation selector-targets DOM via `data-hero-title`, `data-hero-subtitle`, `data-hero-text`, `data-hero-cta`, `data-hero-stat`, `data-hero-image`, `data-hero-badge`, `data-hero-decoration`. If you add hero elements that should animate in, tag them with the matching `data-hero-*` attribute rather than writing a new timeline.
- `useScrollReveal` animates any descendant with `data-reveal`, falling back to the container itself — use the attribute for staggered lists.

### 3D scenes
- `src/components/three/` holds `@react-three/fiber` canvases (`hero-grid.tsx`, `credentials-text.tsx`, `pandora-core.tsx`). They clamp `dpr` to `[1, 2]`, respect `prefers-reduced-motion`, and are dynamically imported by their consuming section. Preserve those performance guards when editing.

### Path alias
`@/*` → `./src/*` (see `tsconfig.json`). Use it for all internal imports.

## Conventions specific to this repo

- **TypeScript is strict.** No `any` escapes; preserve generic signatures in hooks like `useScrollReveal<T extends HTMLElement>`.
- **Client vs server:** add `"use client"` at the top of any file using hooks, browser APIs, GSAP, or Three.js. Sections composed on `page.tsx` (server) stay server unless they need interactivity.
- **Don't edit the README.md.** It's a GitHub *profile* README that renders on the user's GitHub homepage. Project-level docs belong in `docs/` or here.
- **Resume files** (`docs/Resume/*.docx`) are the upstream source of portfolio truth. When updating claims in `portfolio-data.ts`, cross-check against them — the top-of-file comment makes this a hard invariant.
