# Portfolio dynamique Albert TAYO

Ce projet est un portfolio web complet avec une partie publique et un espace d'administration. Il a été développé avec React pour l'interface, Node.js / Express pour l'API, et MongoDB Atlas pour les données dynamiques.

## Maquettes Figma

Les maquettes ne sont pas stockées dans le dépôt GitHub afin de garder le projet léger et lisible. Elles sont consultables ici :

[Portfolio Dynamique Albert TAYO - maquettes](https://www.figma.com/design/CvMneTGOpQwtZYQuK1APP4/Portfolio-Dynamique-Albert-TAYO---maquettes?node-id=3-2&t=3dhkE5ESfFBwFkrh-1)

## Objectif

L'objectif est de présenter mon profil, mes compétences, mon CV et mes projets dans une application claire, maintenable et administrable.

Le projet contient :

- un site public responsive,
- une API REST Express,
- une base MongoDB Atlas,
- une authentification administrateur avec JWT,
- un tableau de bord pour gérer les projets, les compétences, le profil/CV et les messages,
- un formulaire de contact enregistré en base de données,
- un système d'upload d'images pour les projets.

## Structure

```txt
portfolio-dynamique/
├── front/   Interface React avec Vite
└── back/    API Express connectée à MongoDB
```

## Technologies

Front-end :

- React
- React Router
- React Icons
- Vite
- CSS responsive

Back-end :

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Lancer le projet en local

### Back-end

```bash
cd back
npm install
npm run dev
```

L'API répond sur :

```txt
http://localhost:5000
http://localhost:5000/api/health
```

### Front-end

```bash
cd front
npm install
npm run dev
```

Le site s'ouvre généralement sur :

```txt
http://localhost:5173
```

## Variables d'environnement

Créer `back/.env` à partir de `back/.env.example`.

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

Créer `front/.env` à partir de `front/.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

Si `VITE_API_URL` est vide, le front peut utiliser les fichiers JSON statiques dans `front/public/api`. Cela permet de présenter le site même sans API active.

## Initialiser les données

Après configuration de MongoDB, lancer ces commandes dans le dossier `back` :

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

Ces scripts remplissent la base avec les projets, les compétences, le profil/CV et le compte administrateur.

## Routes principales

Routes publiques :

```txt
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

Routes admin protégées :

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
DELETE /api/admin/messages/:id
POST /api/admin/uploads/images
```

## Sécurité

Le projet applique plusieurs protections :

- mot de passe administrateur hashé avec `bcryptjs`,
- token JWT pour protéger les routes admin,
- limitation des tentatives de connexion,
- validation des données reçues par l'API,
- configuration CORS contrôlée,
- en-têtes HTTP de sécurité simples.

## Déploiement

Le guide de déploiement est dans [DEPLOIEMENT.md](DEPLOIEMENT.md).

Avant une mise en ligne, vérifier :

- `VITE_API_URL` pointe vers l'URL réelle du back-end,
- `CLIENT_URL` contient l'URL réelle du front-end,
- `MONGO_URI` pointe vers MongoDB Atlas,
- `JWT_SECRET` est long et unique,
- les scripts de seed ont été lancés si la base est vide.
