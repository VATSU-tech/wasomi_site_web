# syntax=docker/dockerfile:1

# ============================================================================
# Frontend Wasomi — build statique (SPA) servi par Caddy
# ============================================================================
# L'app est un TanStack Start SANS server function ni loader : le rendu côté
# serveur n'apporte rien. On produit donc un bundle statique + le HTML
# prérendu de "/", servi par Caddy (voir deploy/docker-compose.yml).
# ============================================================================

# ---------- Stage 1 : build ----------
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Dépendances d'abord : la couche est réutilisée tant que package.json
# ne change pas, ce qui rend les rebuilds quasi instantanés.
COPY package.json package-lock.json ./

# Le cache BuildKit évite de retélécharger tous les paquets si `npm ci`
# échoue à mi-parcours (réseau instable) : la reprise est quasi gratuite.
# Les réglages de retry absorbent les timeouts transitoires vers le registre.
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-retries 5 \
 && npm config set fetch-retry-mintimeout 20000 \
 && npm config set fetch-retry-maxtimeout 180000 \
 && npm config set fetch-timeout 600000 \
 && npm ci --no-audit --no-fund --prefer-offline

COPY . .

# Les variables VITE_* sont PUBLICES : elles sont inlinées dans le bundle
# livré au navigateur. Ne jamais y mettre de secret.
ARG VITE_API_BASE_URL
ARG VITE_SCHOOL_API_BASE_URL=""
ARG VITE_APP_NAME=Wasomi
ARG VITE_API_TIMEOUT_MS=15000

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_SCHOOL_API_BASE_URL=$VITE_SCHOOL_API_BASE_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_API_TIMEOUT_MS=$VITE_API_TIMEOUT_MS \
    NODE_ENV=production \
    BUILD_TARGET=docker \
    CI=true \
    npm_config_update_notifier=false

# BUILD_TARGET=docker active le mode SPA + désactive le plugin Cloudflare
# (cf. vite.config.ts). Le build échoue volontairement si une variable
# VITE_* requise est absente : mieux vaut un build rouge qu'un bundle cassé.
RUN npm run build:docker

# En mode SPA, TanStack Start produit une coquille nommée `_shell.html` et
# NON `index.html`. Tous les hébergeurs statiques (Caddy, nginx, Netlify…)
# attendent `index.html` comme point d'entrée : sans ce renommage, la racine
# "/" et le fallback SPA renvoient 404.
# Si un prérendu a réellement produit un index.html, on le conserve.
RUN if [ ! -f dist/client/index.html ] && [ -f dist/client/_shell.html ]; then \
      mv dist/client/_shell.html dist/client/index.html; \
    fi \
 && test -f dist/client/index.html \
 && test -d dist/client/assets


# ---------- Stage 2 : runtime Caddy ----------
FROM caddy:2.8-alpine AS runtime

# Caddy obtient et renouvelle automatiquement le certificat TLS Let's Encrypt.
# Aucun certbot, aucune cron de renouvellement, aucun certificat à versionner.
COPY --from=build /app/dist/client /srv
COPY deploy/Caddyfile /etc/caddy/Caddyfile

# Le contenu de /srv et le Caddyfile sont montés en volume au runtime :
# l'image reste ainsi réutilisable entre staging et production.
VOLUME /srv /data /config

EXPOSE 80 443

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:2019/config/ >/dev/null 2>&1 || exit 1

CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]