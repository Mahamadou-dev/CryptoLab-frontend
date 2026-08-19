# Déploiement — frontend CryptoLab

## Le principe

Le déploiement est piloté par GitHub Actions, pas par l'intégration Git de
Vercel. Un build rouge ne peut donc pas atteindre la production.

```
push sur main
   │
   ├─► CI ──── typecheck TypeScript + build Next.js
   │
   └─► si et seulement si la CI est verte :
         Deploy ──► vercel build --prod ──► vercel deploy ──► vérification HTTP 200
```

Les pull requests obtiennent une URL de prévisualisation, également après CI verte.

## Mise en place, une seule fois

### 1. Couper le déploiement automatique de Vercel

Sans cela, Vercel déploie dès le push, sans attendre la CI.

> Dashboard Vercel → projet → **Settings** → **Git** →
> décocher **Automatic deployments from Git**

### 2. Récupérer les identifiants du projet

```bash
npx vercel link
cat .vercel/project.json
```

Le fichier contient `orgId` et `projectId`. Le token se crée ici :

> Vercel → **Account Settings** → **Tokens** → **Create Token**

### 3. Enregistrer les secrets GitHub

> GitHub → dépôt → **Settings** → **Secrets and variables** → **Actions**

| Nom | Source |
|---|---|
| `VERCEL_TOKEN` | le token créé à l'étape 2 |
| `VERCEL_ORG_ID` | `orgId` dans `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | `projectId` dans `.vercel/project.json` |

Et, dans l'onglet **Variables** (facultatif) :

| Nom | Valeur |
|---|---|
| `SITE_URL` | `https://cryptolaboratory.vercel.app` |

> `.vercel/` est déjà ignoré par git — ne le committez pas.

### 4. Variable d'environnement côté Vercel

> Dashboard Vercel → projet → **Settings** → **Environment Variables**

| Clé | Valeur | Environnements |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://cryptolab-backend.onrender.com` | Production, Preview |

Cette URL doit figurer dans le `CRYPTOLAB_ALLOWED_ORIGINS` du backend, sinon
le navigateur bloquera les appels au titre du CORS.

## Déclencher un déploiement à la main

> GitHub → **Actions** → **Deploy** → **Run workflow**

## En local

```bash
pnpm install
pnpm typecheck     # les mêmes vérifications que la CI
pnpm build
pnpm dev           # http://localhost:3000
```

`.env.local` doit contenir :

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```
