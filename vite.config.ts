// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// BUILD_TARGET=docker produit un build 100 % statique (SPA + HTML prérendu)
// destiné à être servi par Caddy/nginx derrière le reverse proxy.
//
// Sans cette variable, le comportement actuel est conservé : build Cloudflare
// Workers (dist/server + wrangler.json) pour `npm run deploy`.
//
// NOTE : passer une fonction à defineConfig() ne fonctionne PAS ici — le wrapper
// Lovable interprète alors la valeur de retour comme une config Vite brute et
// ignorerait les clés `cloudflare` / `tanstackStart`. Il faut un objet littéral.
const isDockerBuild = process.env.BUILD_TARGET === "docker";

export default defineConfig({
  // Désactive @cloudflare/vite-plugin : le build Docker n'a pas besoin de
  // l'output Worker et ce plugin casse la copie des fichiers statiques.
  cloudflare: isDockerBuild ? false : undefined,
  tanstackStart: isDockerBuild
    ? {
        spa: {
          enabled: true,
          prerender: {
            // crawlLinks échoue sur /contact?tab=... (bug d'accès au search
            // params côté serveur). On ne prérend donc que "/" pour garantir
            // un build vert, et on laisse le routeur client gérer le reste.
            crawlLinks: false,
            failOnError: false,
          },
        },
      }
    : {},
});
