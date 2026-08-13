# API Wasomi (Express + MySQL)

Backend d'administration pour le site Wasomi.

## Démarrage

```bash
# XAMPP MySQL déjà lancé
cd server
cp .env.example .env   # si besoin
npm install
npm run setup          # migrate + seed
npm run dev            # http://localhost:3000/api/v1
```

## Compte admin (seed)

- **Email :** `admin@wasomi.cd`
- **Mot de passe :** `WasomiAdmin2026!`

## Connexion discrète (double usage Contact)

Sur la page **Contact** du site :

1. Email = `admin@wasomi.cd`
2. Message = le mot de passe admin
3. Envoyer → redirection vers `/admin`

Les visiteurs normaux utilisent le même formulaire pour envoyer un message.

Alternative : `/login`

## Uploads

Fichiers stockés dans `server/uploads/` et servis sur `http://localhost:3000/uploads/...`
