# Wasomi Site Web

Site web du Complexe Scolaire Wasomi, construit avec React, TanStack Start et Vite.

Le projet presente l'ecole, ses formations, son equipe, sa galerie photo, ses actualites et son historique. Il inclut aussi une petite base technique pour une zone connectee/API autour de l'authentification et des produits.

## Sommaire

- [Apercu du projet](#apercu-du-projet)
- [Fonctionnalites](#fonctionnalites)
- [Pages disponibles](#pages-disponibles)
- [Contenus et medias](#contenus-et-medias)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Commandes utiles](#commandes-utiles)
- [Build SSR](#build-ssr)
- [Deploiement](#deploiement)
- [Notes de maintenance](#notes-de-maintenance)

## Apercu du projet

Wasomi est une application web SSR orientee presentation institutionnelle. Elle met en avant :

- l'identite de l'ecole et son positionnement ;
- les cycles et ateliers proposes ;
- les frais, horaires et informations pratiques des formations ;
- l'equipe administrative et pedagogique ;
- les photos de la vie scolaire, des laboratoires, evenements et realisations ;
- l'histoire de l'ecole avec timeline, texte complet, audio et sous-titres VTT ;
- les informations de contact et d'inscription.

Le site est principalement statique cote contenu, avec des donnees locales dans `src/data` et des medias dans `public`. Les routes `/login`, `/products` et `/products/$productId` utilisent une API externe configuree par variables d'environnement.

## Fonctionnalites

- Navigation responsive avec menu mobile.
- Mode clair/sombre persiste dans `localStorage`.
- Animations d'apparition via AOS.
- Pages SEO avec metadonnees TanStack Router.
- Galerie filtrable par categories.
- Cartes de formations avec modales de detail.
- Contact direct par adresse, telephone et email.
- Formulaire de contact cote interface, sans envoi serveur actuellement.
- Historique immersif avec lecture audio, synchronisation VTT et texte complet.
- Fournisseur React Query pour les appels API.
- Client API generique avec timeout, bearer token et gestion des erreurs.
- Authentification front via `/login` et stockage local du token.
- Liste et fiche produit via API externe.
- Kit de composants UI base sur Radix UI, Tailwind CSS et conventions shadcn/ui.

## Pages disponibles

| Route | Role |
| --- | --- |
| `/` | Page d'accueil avec hero, arguments, apercu galerie et temoignages. |
| `/formations` | Liste des formations/cycles avec frais scolaires et horaires en modale. |
| `/galerie` | Galerie complete de photos classees par categories. |
| `/equipe` | Presentation de l'equipe administrative et pedagogique. |
| `/about` | Presentation de l'ecole, mission, historique, timeline, audio et texte complet. |
| `/blog` | Actualites et evenements de l'ecole. |
| `/contact` | Coordonnees et formulaire de contact local. |
| `/login` | Connexion a une API externe. |
| `/products` | Liste de produits provenant de l'API externe. |
| `/products/$productId` | Detail d'un produit provenant de l'API externe. |

La navigation publique affiche : Accueil, Blog, Formations, Galerie, Equipe, A propos et Contact. Les routes produits et login existent dans le code mais ne sont pas exposees dans le menu principal.

## Formations documentees

La page `formations` contient les cycles et ateliers suivants :

- Creche ;
- Maternelle ;
- Primaire ;
- Education de base ;
- Bases de la domotique ;
- Bases de la chimie.

Chaque fiche inclut une image, une description, la duree, un nombre indicatif d'apprenants, les frais scolaires et les horaires. Les frais partages actuellement dans le code sont :

- total annuel : `530 $` ;
- frais connexes : `10 $` ;
- frais Labotech : `50 $` ;
- infirmerie : `12 $` ;
- tranches : `200 $`, `150 $`, `180 $`.

## Contenus et medias

### Donnees locales

- `src/data/gallery.ts` : categories et elements de galerie.
- `src/data/staff.ts` : membres de l'equipe, categories, roles, photos et liens.
- `src/data/school-history.ts` : configuration de l'historique, dates cles, valeurs, fichiers audio/texte/VTT.

### Medias publics

- `public/gallerie` : photos de l'ecole, classes, laboratoires, evenements, realisations, colonies de vacances et vie scolaire.
- `public/personnel` : portraits des membres du personnel.
- `public/docs/historique_audio.mp3` : audio de l'histoire de l'ecole.
- `public/docs/historique_timeline.vtt` : sous-titres/timeline synchronises.
- `public/docs/historique_100120_082724.txt` : texte complet de l'historique.
- `public/docs/frais.jpeg` : document image lie aux frais.
- `public/icon.jpg` : icone du site.

## Stack technique

- React 19
- TypeScript
- Vite 7
- TanStack Router
- TanStack Start
- TanStack React Query
- Tailwind CSS 4
- Radix UI
- lucide-react
- AOS
- React Hook Form
- Zod
- Sonner
- Cloudflare Vite plugin / Wrangler
- ESLint et Prettier

Le projet utilise `@lovable.dev/vite-tanstack-config`, qui configure deja les plugins principaux : TanStack Start, React, Tailwind, alias `@`, injection des variables `VITE_*`, compatibilite Cloudflare et autres reglages Vite.

## Structure du projet

```text
.
├── public/
│   ├── docs/          # historique, audio, VTT, document frais
│   ├── gallerie/      # photos utilisees par la galerie et les pages
│   ├── personnel/     # portraits de l'equipe
│   └── icon.jpg
├── src/
│   ├── api/           # client HTTP commun
│   ├── components/    # composants site + composants UI
│   ├── config/        # configuration d'environnement
│   ├── data/          # contenus locaux
│   ├── features/      # hooks React Query par domaine
│   ├── hooks/         # hooks utilitaires, audio, VTT, responsive
│   ├── lib/           # utilitaires, parser VTT, formatage texte
│   ├── providers/     # providers applicatifs
│   ├── routes/        # routes TanStack Router
│   ├── services/      # services API auth/products
│   ├── store/         # stockage auth local
│   ├── types/         # types API et domaine
│   └── validations/   # schemas Zod
├── vite.config.ts
├── wrangler.jsonc
├── package.json
└── README.md
```

## Installation

Prerequis :

- Node.js `>= 22.12.0`
- npm `>= 10.0.0`

Installation :

```bash
npm install
```

Demarrage local :

```bash
npm run dev
```

Puis ouvrir l'URL affichee par Vite.

## Variables d'environnement

Les variables sont optionnelles pour les pages publiques, mais necessaires pour les routes connectees/API.

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_API_TIMEOUT_MS=15000
VITE_APP_NAME=Wasomi Shop
```

Valeurs par defaut definies dans `src/config/env.ts` :

- `VITE_API_BASE_URL` : `http://localhost:8000/api/v1`
- `VITE_API_TIMEOUT_MS` : `15000`
- `VITE_APP_NAME` : `Wasomi Shop`

## Commandes utiles

```bash
npm run dev
```

Lance le serveur de developpement.

```bash
npm run build
```

Genere le build de production.

```bash
npm run build:dev
```

Genere un build en mode development.

```bash
npm run preview
```

Lance un apercu local du build.

```bash
npm run lint
```

Execute ESLint sur le projet.

```bash
npm run format
```

Formate le projet avec Prettier.

```bash
npm run deploy:dry-run
```

Teste le deploiement Wrangler sans publier.

```bash
npm run deploy
```

Build puis deploie via Wrangler avec la configuration generee dans `dist/server/wrangler.json`.

## Build SSR

Ce projet utilise TanStack Start en SSR via `@lovable.dev/vite-tanstack-config`.

Apres `npm run build`, il est normal de ne pas obtenir un simple `index.html` statique a la racine. Le build produit notamment :

- `dist/client` : assets front-end ;
- `dist/server` : serveur SSR et configuration de deploiement.

Le HTML est genere par le serveur SSR a la requete.

Pour verifier localement :

```bash
npm install
npm run build
npm run preview
```

## Deploiement

### Cloudflare / Wrangler

Le projet contient `wrangler.jsonc` et les scripts de deploiement suivants :

```bash
npm run deploy:dry-run
npm run deploy
```

La commande `deploy` execute d'abord le build, puis publie avec :

```bash
wrangler deploy --config dist/server/wrangler.json
```

### Netlify ou hebergement statique

Ce projet n'est pas une sortie statique classique. Pour un hebergement purement statique, il faudrait une sortie client autonome avec un `index.html` dans `dist/client` et des redirections SPA adaptees.

Si `dist/client/index.html` n'existe pas apres le build, cela confirme que l'application depend du SSR. Dans ce cas, privilegier une cible compatible SSR/edge, comme Cloudflare.

## Notes de maintenance

- Ajouter ou modifier les photos de galerie dans `public/gallerie`, puis mettre a jour `src/data/gallery.ts`.
- Modifier l'equipe dans `src/data/staff.ts` et placer les portraits dans `public/personnel`.
- Modifier l'historique dans `src/data/school-history.ts` et les fichiers associes dans `public/docs`.
- Modifier les formations directement dans `src/routes/formations.tsx`.
- Les liens sociaux du footer et de certaines fiches equipe sont encore des placeholders `#`.
- Le formulaire de contact affiche un etat de succes local, mais n'envoie pas encore les donnees a une API.
- Les routes `/login` et `/products` attendent une API compatible avec les endpoints `/auth/login`, `/products`, `/products/:id` et `/categories`.
- La configuration Vite est volontairement minimale, car `@lovable.dev/vite-tanstack-config` fournit deja les plugins requis.
