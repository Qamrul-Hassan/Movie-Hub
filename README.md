# Movie Hub

Movie Hub is a cinematic movie discovery app built with Next.js, Redux Toolkit, and TMDB APIs.
It includes trending/popular catalogs, search, trailers, favorites, responsive navigation, and custom animated interactions.

## What this project includes

- Hero-driven home page with featured movie
- Catalog sections:
  - Trending (Today / This Week)
  - Latest Trailers (Popular / In Theaters)
  - Popular Movies
  - Top Rated Movies
- Search page (`/search`) with TMDB multi-search
- Favorites page (`/favorites`) with local persistence
- Support page (`/support`)
- Additional sections:
  - `/discussion`
  - `/leaderboard`
  - Dynamic category pages under `/movies/*`, `/tv/*`, `/people/*`
- Trailer playback buttons from TMDB video endpoints
- Custom cinematic UI animations (favorite fly, remove-to-trash, dropdowns, fades)

## Tech stack

- Next.js 15 (App Router + a Pages route bridge)
- React 18 + TypeScript
- Redux Toolkit + React Redux
- Tailwind CSS v4
- TMDB API (movie data, videos, search)
- React Icons

## Animation approach

This project currently uses:

- CSS keyframes (global and component classes)
- Web Animations API (`element.animate(...)`) for advanced effects

Note: Framer Motion is not used in the current codebase.

## Project structure (key files)

- `src/app/page.tsx` - home page
- `src/app/search/page.tsx` - search experience
- `src/app/favorites/page.tsx` - favorites page
- `src/components/Navbar.tsx` - responsive navbar + mobile toggle panel
- `src/components/MovieRow.tsx` - reusable card grid + interactions
- `src/hooks/useFavorites.ts` - favorites persistence hook
- `src/lib/tmdb.ts` - TMDB fetch helper
- `src/lib/trailer.ts` - trailer playback helper
- `src/store/` - Redux store + movie slice
- `src/pages/_app.tsx` - provider/layout support for pages routes

## Environment variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open:

- `http://localhost:3000`

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - lint with ESLint cache

## Notes

- The app is responsive and optimized for mobile + desktop.
- Reduced-motion preferences are respected for animations.
- Some routes are served via App Router and some via Pages bridge for compatibility.

## GitHub

Repository: `Qamrul-Hassan/Movie-Hub`
