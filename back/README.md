# Back-end du portfolio dynamique

API REST Node.js / Express du portfolio dynamique.

## Installation

```bash
npm install
```

Si Windows bloque le cache npm avec une erreur `EPERM`, utiliser :

```bash
npm install --cache .npm-cache
```

## Configuration

Creer un fichier `.env` a partir de `.env.example`.

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio-dynamique?retryWrites=true&w=majority&appName=PortfolioCluster
JWT_SECRET=remplacer_par_une_cle_tres_longue_aleatoire_de_32_caracteres_minimum
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=MonMotDePasseAdmin2026!
```

Important :

- `MONGO_URI` doit pointer vers la base `portfolio-dynamique`,
- `JWT_SECRET` doit contenir au moins 32 caracteres et etre difficile a deviner,
- `JWT_EXPIRES_IN` definit la duree de validite de la session admin,
- `ADMIN_PASSWORD` sert seulement a creer le compte admin, puis il est hashe dans MongoDB.

## Securite

Le serveur applique plusieurs protections :

- en-tetes HTTP de securite,
- CORS limite a `CLIENT_URL` en production,
- validation obligatoire d'un `JWT_SECRET` solide en production,
- expiration du token admin,
- blocage temporaire apres 5 tentatives de connexion admin echouees,
- controle de robustesse du mot de passe admin au moment du seed.

## Lancement en developpement

```bash
npm run dev
```

Le serveur doit repondre sur :

```txt
http://localhost:5000
http://localhost:5000/api/health
```

## Lancement en production

```bash
npm start
```

## Scripts de donnees

Importer les projets :

```bash
npm run seed:projects
```

Importer les competences :

```bash
npm run seed:skills
```

Importer le profil/CV :

```bash
npm run seed:profile-cv
```

Creer ou mettre a jour le compte admin :

```bash
npm run seed:admin
```

## Routes disponibles

Routes publiques :

```txt
GET /
GET /api/health
GET /api/projects
GET /api/projects/:id
GET /api/skills
GET /api/profile-cv
POST /api/contact
```

Routes d'authentification :

```txt
POST /api/auth/login
GET /api/auth/me
```

Routes admin protegees :

```txt
GET /api/admin/projects
POST /api/admin/projects
PUT /api/admin/projects/:id
DELETE /api/admin/projects/:id

GET /api/admin/skills
POST /api/admin/skills
PUT /api/admin/skills
DELETE /api/admin/skills

GET /api/admin/profile
PUT /api/admin/profile
GET /api/admin/messages
POST /api/admin/uploads/images
```

Les routes `/api/admin/...` necessitent un token JWT.

## Validation des donnees

Les routes sensibles valident les donnees recues avant d'appeler les controleurs :

- email valide pour la connexion et le contact,
- champs obligatoires pour les projets, competences et profil,
- URLs valides pour GitHub et les demos,
- identifiants MongoDB valides pour les modifications/suppressions,
- erreurs JSON/Mongoose converties en reponses API lisibles.

## Deploiement

Le back-end peut etre deploye sur Render, Railway ou un autre hebergeur Node.js.

Parametres conseilles :

```txt
Root directory: back
Build command: npm install
Start command: npm start
```

Variables d'environnement a configurer :

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://url-du-front
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio-dynamique?retryWrites=true&w=majority&appName=PortfolioCluster
JWT_SECRET=une-cle-longue-et-secrete-de-32-caracteres-minimum
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=mot-de-passe-admin-fort
```

Apres deploiement, verifier :

```txt
https://url-du-back/api/health
```

La reponse doit indiquer :

```json
{
  "status": "ok",
  "api": "portfolio-dynamique",
  "database": "connectee"
}
```
