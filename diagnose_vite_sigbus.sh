#!/usr/bin/env bash
set -euo pipefail

PROJECT_PATH="${1:-$PWD}"
HOME_CLONE="${HOME}/wasomi_site_web"
LOG_DIR="${PROJECT_PATH}/.diag-vite-sigbus"
MINIMAL_HOME="${HOME}/vite-sigbus-test"
MINIMAL_MEDIA="/media/work/Scripts/Github/vite-sigbus-test"

mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/run-$(date +%Y%m%d-%H%M%S).log"
exec > >(tee -a "$LOG_FILE") 2>&1

step() { echo; echo "========== $* =========="; }
warn() { echo "[WARN] $*"; }
info() { echo "[INFO] $*"; }

step "0) Contexte"
info "Date UTC: $(date -u)"
info "Projet: $PROJECT_PATH"
info "Log: $LOG_FILE"

if [[ ! -f "$PROJECT_PATH/package.json" ]]; then
  echo "[ERROR] package.json introuvable dans $PROJECT_PATH" >&2
  exit 1
fi

cd "$PROJECT_PATH"

step "1) Diagnostic système"
uname -a || true
node -v || true
npm -v || true
file "$(command -v node)" || true
node -p "process.platform + ' ' + process.arch" || true
mount | grep -E '/media/work|type ntfs|type exfat' || true
df -Th "$PROJECT_PATH" || true
dmesg | tail -100 || true

step "2) Nettoyage local"
rm -rf node_modules .vite dist .wrangler package-lock.json
npm cache clean --force || true

step "3) Réinstallation + rebuild natif"
npm install
npm rebuild esbuild rollup || true

step "4) Vérification dépendances natives"
node -e "console.log('node ok')"
node -e "require('esbuild'); console.log('esbuild require ok')"
node -e "require('rollup'); console.log('rollup require ok')"
npx esbuild --version
npx vite --version

step "5) Test Vite dans le projet courant"
if timeout 25s npm run dev; then
  info "npm run dev a démarré sans crash dans $PROJECT_PATH"
  CURRENT_OK=1
else
  warn "npm run dev a échoué/crashé dans $PROJECT_PATH"
  CURRENT_OK=0
fi

step "6) Test hors /media/work -> ~/wasomi_site_web"
mkdir -p "$HOME_CLONE"
rsync -a --delete "$PROJECT_PATH/" "$HOME_CLONE/"
cd "$HOME_CLONE"
rm -rf node_modules package-lock.json .vite dist .wrangler
npm cache clean --force || true
npm install

if timeout 25s npm run dev; then
  info "npm run dev OK dans $HOME_CLONE"
  HOME_OK=1
else
  warn "npm run dev échoue aussi dans $HOME_CLONE"
  HOME_OK=0
fi

step "7) Projet Vite minimal - HOME"
rm -rf "$MINIMAL_HOME"
npm create vite@latest "$MINIMAL_HOME" -- --template react
cd "$MINIMAL_HOME"
npm install
if timeout 25s npm run dev; then
  info "Vite minimal OK dans HOME"
  MIN_HOME_OK=1
else
  warn "Vite minimal KO dans HOME"
  MIN_HOME_OK=0
fi

step "8) Projet Vite minimal - /media/work (si dispo)"
MIN_MEDIA_OK=-1
if [[ -d /media/work/Scripts/Github ]]; then
  rm -rf "$MINIMAL_MEDIA"
  mkdir -p "$MINIMAL_MEDIA"
  cd "$MINIMAL_MEDIA"
  npm create vite@latest . -- --template react
  npm install
  if timeout 25s npm run dev; then
    info "Vite minimal OK dans /media/work"
    MIN_MEDIA_OK=1
  else
    warn "Vite minimal KO dans /media/work"
    MIN_MEDIA_OK=0
  fi
else
  warn "/media/work/Scripts/Github introuvable; test minimal media ignoré"
fi

step "9) Verdict automatique"
echo "Résultats: CURRENT_OK=$CURRENT_OK HOME_OK=$HOME_OK MIN_HOME_OK=$MIN_HOME_OK MIN_MEDIA_OK=$MIN_MEDIA_OK"

if [[ "$CURRENT_OK" -eq 0 && "$HOME_OK" -eq 1 ]]; then
  echo "VERDICT: cause probable = filesystem/mount de /media/work (NTFS/exFAT ou options)."
elif [[ "$MIN_HOME_OK" -eq 0 ]]; then
  echo "VERDICT: cause probable = stack Node/npm globale ou OS (pas le repo)."
elif [[ "$CURRENT_OK" -eq 0 && "$HOME_OK" -eq 0 ]]; then
  echo "VERDICT: cause probable = dépendance native/Node incompatibles pour ce projet."
else
  echo "VERDICT: environnement actuellement stable; crash non reproduit."
fi

cat <<'USAGE'

Prochaines actions recommandées:
1) Si /media/work est en cause: développer depuis ~/wasomi_site_web.
2) Si crash persistant partout: basculer Node 20 LTS avec nvm puis refaire nettoyage/install.
3) Utiliser le log généré dans .diag-vite-sigbus/ pour post-mortem.
USAGE
