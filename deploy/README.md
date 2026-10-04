# Déploiement Docker — Wasomi

Stack complète en trois conteneurs :

```
Internet
   │
   ▼
[ web ]  Caddy :80/:443   ← seul service exposé
   │        ├── fichiers statiques (SPA TanStack)
   │        └── /api/* , /uploads/* , /health → reverse proxy
   ▼
[ api ]  Express :3000    ← non exposé
   │
   ▼
[ db ]   MySQL 8.4        ← non exposé
```

Les données persistent dans des volumes Docker nommés :

| Volume         | Contenu                                             |
|----------------|-----------------------------------------------------|
| `wasomi_db_data`    | base MySQL                                      |
| `wasomi_api_uploads`| images / PDF téléversés (`/app/uploads`)        |
| `wasomi_caddy_data` | certificats TLS Let's Encrypt                   |

---

## 1. Pré-requis

- Docker Engine ≥ 24 et le plugin `docker compose`
- Les deux dépôts **côte à côte** :

```
Github/
├── wasomi_site_web/            ← ce dépôt (contient deploy/)
└── wasomi_site_web_backend/    ← l'API
```

Si vos dépôts ne sont pas voisins, définissez `BACKEND_PATH` dans
`deploy/.env` (chemin absolu ou relatif à `deploy/`).

---

## 2. Démarrage rapide (test local)

```bash
cp .env.example .env
```

Éditez `.env` puis, **au minimum**, générez les secrets et le mot de passe
de l'administrateur :

```bash
# Secrets JWT (3 valeurs distinctes)
openssl rand -hex 32   # → ACCESS_TOKEN_SECRET
openssl rand -hex 32   # → REFRESH_TOKEN_SECRET
openssl rand -hex 32   # → CSRF_SECRET

# Mots de passe
openssl rand -hex 16   # → MYSQL_PASSWORD
openssl rand -hex 16   # → MYSQL_ROOT_PASSWORD
```

Laissez pour un test local :

```dotenv
DOMAIN=http://localhost:8080
VITE_API_BASE_URL=http://localhost:8080/api/v1
RUN_SEED=true
```

Puis :

```bash
docker compose up -d --build
```

> ⚠️ `VITE_API_BASE_URL` doit être une **URL absolue**. Le front la valide
> avec zod (`z.string().url()`) : une valeur comme `/api/v1` fait **échouer
> le build**.

Vérifications :

```bash
# 1. les 3 conteneurs sont "healthy"
docker compose ps

# 2. l'API répond et voit la base
curl http://localhost:8080/health
# → {"status":"ok","database":"up"}

# 3. le site est servi
curl -I http://localhost:8080/
```

Ouvrez <http://localhost:8080> puis <http://localhost:8080/app/login>
avec `BOOTSTRAP_ADMIN_EMAIL` / `BOOTSTRAP_ADMIN_PASSWORD`.

### Après le premier démarrage

Repassez **obligatoirement** à :

```dotenv
RUN_SEED=false
```

…puis `docker compose up -d`. Sinon le seed est rejoué à chaque redémarrage.

---

## 3. Mise en production

### a. DNS

Créez un enregistrement `A` (ou `AAAA`) pointant `wasomi.cd` et
`www.wasomi.cd` vers l'IP du serveur. **Caddy obtient le certificat TLS
automatiquement** dès que le DNS pointe correctement et que les ports 80/443
sont ouverts — aucun certbot à installer.

### b. `.env` de production

```dotenv
DOMAIN=wasomi.cd
ACME_EMAIL=votre-email@wasomi.cd

VITE_API_BASE_URL=https://wasomi.cd/api/v1

# Front et API sur le MÊME domaine → SameSite=lax suffit.
COOKIE_SECURE=false
FRONTEND_ORIGINS=https://wasomi.cd

MYSQL_PASSWORD=<secret>
MYSQL_ROOT_PASSWORD=<secret>
ACCESS_TOKEN_SECRET=<secret>
REFRESH_TOKEN_SECRET=<secret>
CSRF_SECRET=<secret>
BOOTSTRAP_ADMIN_PASSWORD=<mot de passe fort>

RUN_SEED=true   # premier déploiement uniquement
```

### c. Pare-feu

Seuls **80** et **443** doivent être ouverts. Ne publiez jamais les ports
3306 (MySQL) et 3000 (API).

### d. Lancer

```bash
docker compose up -d --build
docker compose logs -f web      # Caddy : obtenir le certificat
```

---

## 4. Migrer les données depuis Railway / Render

Le dépôt backend contient un dump `wasomi.sql`. La base doit être importée
**avant** que l'API ne crée ses tables (sinon conflit « table already
exists ») :

```bash
# 1. Démarrer uniquement MySQL
docker compose up -d db
docker compose ps                       # attendre "healthy"

# 2. Importer le dump dans une base encore vide
docker compose exec -T db sh -c \
  'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  < ../../wasomi_site_web_backend/wasomi.sql

# 3. Démarrer le reste (les migrations seront des no-op)
docker compose up -d --build
```

Le dump contient déjà le compte administrateur et les rôles : gardez
`RUN_SEED=false` dans ce cas.

Pour rapatrier un dump **frais** depuis Railway (recommandé, pour ne rien
perdre entre-temps) :

```bash
mysqldump --single-transaction --routines \
  -h <host> -P <port> -u root -p <base> > wasomi-fresh.sql
# puis remplacez wasomi.sql dans la commande ci-dessus
```

---

## 5. Commandes utiles

```bash
docker compose ps                     # état + santé
docker compose logs -f api            # logs API
docker compose logs -f web            # logs Caddy (dont certificats)
docker compose exec db \
  mysql -uwasomi -p wasomi           # shell SQL

docker compose restart api            # redémarrer l'API
docker compose up -d --build          # reconstruire et relancer
docker compose down                   # arrêter (volumes conservés)
docker compose down -v                # TOUT supprimer (base incluse !)
```

Raccourcis depuis le dépôt frontend :

```bash
npm run docker:up
npm run docker:logs
npm run docker:ps
npm run docker:down
```

---

## 6. Sauvegarde / restauration

```bash
# Sauvegarde
docker compose exec -T db sh -c \
  'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' \
  > backup-$(date +%F).sql

# Restauration (écrase les données)
docker compose exec -T db sh -c \
  'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' < backup.sql

# Uploads (volume)
docker run --rm -v wasomi_api_uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-$(date +%F).tar.gz -C /data .
```

---

## 7. Dépannage

| Symptôme | Cause probable / solution |
|---|---|
| Build : `VITE_API_BASE_URL is missing or invalid` | URL relative au lieu d'absolue. Ex : `https://wasomi.cd/api/v1`. |
| Build : `npm ci` → `ETIMEDOUT` | Réseau instable. Relancez : le cache BuildKit reprend le téléchargement. |
| `api` redémarre en boucle | `docker compose logs api`. Vérifiez `DB_HOST=db` (jamais `127.0.0.1`). |
| `/health` renvoie `database: down` | MySQL pas encore prêt, ou identifiants `MYSQL_*` incohérents avec `DB_*`. |
| Caddy n'obtient pas de certificat | DNS pas propagé, ports 80/443 fermés, ou `DOMAIN` avec `http://`. |
| Connexion OK puis déconnexion immédiate | Vérifiez que `ACCESS_TOKEN_SECRET` / `REFRESH_TOKEN_SECRET` sont **définis** (non vides) et que la table `RefreshSession` existe. |
| Erreur 403 `CSRF_INVALID` | `COOKIE_SECURE` incohérent avec le schéma (http/https), ou front et API sur des domaines différents. Utilisez un seul domaine. |
| Les images uploadées disparaissent au redéploiement | Le volume `api_uploads` a été supprimé, ou `UPLOAD_DIR` n'est pas `/app/uploads`. |

---

## 8. Ce qui a été corrigé pour rendre le déploiement fiable

Ces corrections évitaient des pannes **uniquement visibles sur une base
neuve** (donc jamais en local, où la base existante masquait le problème).

### Backend

1. **Tables manquantes** — `RefreshSession`, `PasswordResetToken` et
   `EmailVerificationToken` étaient utilisées par le code
   (`src/middleware/auth.js`) mais absentes de `sql/content_schema.sql`.
   Sans elles, **la connexion échouait** après le premier refresh de token.
2. **Colonnes manquantes** :
   - `User.last_login_at` → **cassait chaque connexion** (`auth.js`).
   - `AuditLog.actor_user_id`, `before_json`, `after_json`, `ip_hash`,
     `request_id` → cassaient le journal d'audit.
   - `Setting.updated_by_user_id` → cassait l'enregistrement des paramètres.
   - `Role.deleted_at`, `AdmissionRequest.*` → alignés sur la production.
3. **Endpoint `/health`** ajouté (utilisé par les healthchecks Docker et Caddy).
4. **`docker-entrypoint.sh`** : attend MySQL, lance les migrations, puis
   l'API — plus de crash-loop au démarrage.

### Frontend

5. **`vite.config.ts`** : le mode Docker (`BUILD_TARGET=docker`) produit un
   build **statique SPA** et désactive le plugin Cloudflare. Le build
   Cloudflare (`npm run deploy`) reste intact.
6. **`Dockerfile` multi-stage** : build Node → runtime Caddy (image finale
   sans Node, légère et sans surface d'attaque).

### Infrastructure

7. **Un seul domaine** via Caddy : supprime la totalité des bugs CORS /
   cookies cross-site / `SameSite=None` / CSRF décrits dans
   `src/api/client.ts`.
8. **TLS automatique** Let's Encrypt : plus de certbot ni de cron de
   renouvellement.
9. **Persistance** : base et uploads dans des volumes nommés.
10. **Ordre de démarrage garanti** (`depends_on: condition: service_healthy`)
    au lieu d'un simple `depends_on`.
