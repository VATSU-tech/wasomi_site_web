# Wasomi Site Web

## Pourquoi `npm run build` ne génère pas de fichier `index.html` ?

Ce projet utilise **TanStack Start** (SSR) via la config `@lovable.dev/vite-tanstack-config`.
Dans ce mode, le build produit :

- `dist/client` : les assets front (`.js`, `.css`, etc.)
- `dist/server` : le serveur SSR (c'est lui qui génère le HTML à la requête)

Donc c'est **normal** de ne pas voir un `index.html` statique à la racine du build.

## Vérifier le build localement

```bash
npm install
npm run build
npm run preview
```

Puis ouvre l'URL affichée par `npm run preview`.

## Déployer sur Netlify

> Important : ce projet est orienté SSR (avec sortie serveur), pas un simple site statique HTML.

Tu as 2 options :

### Option A (recommandée) — Déployer sur une plateforme SSR compatible

Comme le projet sort un bundle serveur (`dist/server`), une plateforme orientée SSR/edge (ex. Cloudflare) est généralement plus directe.

### Option B — Publier sur Netlify en statique

Possible seulement si ton app peut fonctionner sans rendu serveur.

1. Build :
   ```bash
   npm run build
   ```
2. Dans Netlify, configure :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist/client`
3. Ajoute une règle de redirection SPA (si routing côté client) via `netlify.toml` :

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

⚠️ Si `dist/client/index.html` n'existe pas, cela confirme que l'app dépend bien du SSR : dans ce cas, il faut un déploiement SSR (ou refactorer pour une vraie sortie statique).

## Résumé rapide

- Pas de `index.html` après build : **normal en SSR**.
- Pour Netlify statique, il faut une sortie statique complète.
- Sinon, déploie sur une cible SSR.
