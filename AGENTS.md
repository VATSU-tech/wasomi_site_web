# AGENTS.md — Smart School Management Portal

## Stack

- React 19 + TypeScript + Vite + TanStack Router
- TailwindCSS v4 + DaisyUI (portail `/app/*` uniquement)
- API v2 : `VITE_SCHOOL_API_BASE_URL` (défaut `http://localhost:8000/api`)
- Référence OpenAPI : `../smart_school_managment/acounts.txt` (v2) et `data.txt` (v1)

## Règles UI (portail `/app`)

1. **Styling exclusif DaisyUI** : `btn`, `card`, `modal`, `input`, `badge`, `table`, `select`, `alert`, `drawer`, etc.
2. **Multi-tenancy transparente** : aucun sélecteur d'école dans l'UI ; résolution via JWT / sous-domaine / header côté API.
3. **Mode Operate** (skill impeccable) : densité ergonomique, lisibilité, feedback systématique.

## Architecture

```
src/api/          → core client JWT, endpoints v2, types
src/context/      → AuthContext (rôles, suspension)
src/features/     → auth, enrollments, teachings, gradings, school
src/layouts/      → AppShell, Sidebar, TopNavbar
src/pages/        → Welcome, Dashboard, AccountSuspended
src/routes/app/   → routes TanStack du portail
```

## Rôles

| Rôle | Slug API | Accès clé |
|------|----------|-----------|
| Préfet | `prefet` | Personnel, paramètres école |
| Proviseur | `proviseur` | Inscriptions, cours, délibération |
| Enseignant | `enseignant` | Affectations, catégories, évaluations |
| Titulaire | `titulaire` | Compilation des résultats |
| Parent | `parent` | Enfants, bulletins |
| Élève | `eleve` | Notes personnelles |

## Auth v2

- Login : `identifier` (email ou téléphone E.164) + `password`
- Tokens JWT : `access` + `refresh` en localStorage
- Suspension : redirection automatique vers `/app/account-suspended`
