# AGENTS.md — Wasomi Site Web

## Stack

- React 19 + TypeScript + Vite + TanStack Router / Query
- TailwindCSS v4 + composants UI (shadcn/radix)
- API Node/Express : `VITE_API_BASE_URL` (défaut `/api` via le serveur local `server/`)

## Architecture

```
src/api/          → client HTTP (cookies CSRF)
src/services/     → appels API métier (cms, admin, auth…)
src/components/   → UI site + admin
src/routes/       → pages publiques + /admin + /login
server/           → API Express locale (miroir du backend)
```

## Admin CMS

- `/admin` : dashboard, préinscriptions, messages, formations, carousel hero, avis, classes, blog, galerie, équipe, médias
- Authentification cookie + CSRF ; rôle `super_admin`
