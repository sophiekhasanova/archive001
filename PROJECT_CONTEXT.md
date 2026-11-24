# ARCHIVE 001: Project Context

Read this before resuming work.

## Status
- 2026-11-24: First full prototype built. Home, Archive, product overlay, cart drawer and page transitions work.
- Run with `npm run dev` (port 5173). Build with `npm run build`.
- Static hosting needs an SPA fallback so `/archive` serves `index.html`.

## Scope
Two pages: Home, Archive. Product overlay, cart drawer, local data and state (cart persists in localStorage).
Out of scope: auth, backend, payments, checkout.

## Stack
React, Vite, TypeScript, GSAP (ScrollTrigger, ScrollSmoother, SplitText, Flip, CustomEase), plain CSS, Fontsource.
No Three.js, UI kit, router library or state library.

## Key files
- `src/data/images.ts`: **only place image URLs live**. Set `local: '/objects/x.jpg'` on an entry to replace a photo.
- `src/data/objects.ts`: 29 sample objects and 6 collections. Names, provenance and prices are fictional.
- `src/lib/motion.ts`: eases, ScrollSmoother, shared reveals, named scroll locks.
- `src/lib/router.tsx`: small history router and shutter transition.
- `src/store/store.tsx`: cart, drawer and active object.
- `src/components/`: `Chrome` (Nav, Shutter, Cursor, Footer, Link), `Media`, `ObjectCard`, `ObjectOverlay`, `CartDrawer`.
- `src/pages/`: `Home.tsx`, `Archive.tsx`.
- `src/styles/global.css`: tokens and all styles.

## Design system
- Colors: graphite `#0D0D0C`, carbon `#161615`, line `#2A2926`, bone `#E8E3D9`, ash `#8B877E`, oxide `#C4411F` for catalogue marks only.
- Type: Bodoni Moda (display), Hanken Grotesk (body), IBM Plex Mono (catalogue data).
- Never set prices in Bodoni: its hairline "4" reads like "1".
- Layout: asymmetric 12-column grid, museum-label captions, accession numbers (`A001-0042`) as the motif.

## Architecture notes
- `#smooth-wrapper` lives in `index.html` and ScrollSmoother starts before React, so page ScrollTriggers register after it. Pages render through a portal into `#smooth-content`.
- Fixed UI (nav, overlay, drawer, cursor, shutter) must stay outside `#smooth-content`.
- `prefers-reduced-motion` disables smoothing, pins and reveals.

## Next ideas
- Replace Unsplash images with owned photography.
- Self-host final images before launch.
