# Portfolio dynamique Albert TAYO

Portfolio web dynamique avec une partie publique et un espace d'administration.

Le projet utilise :

- React et Vite pour le front-end,
- Node.js et Express pour l'API,
- MongoDB Atlas et Mongoose pour les donnees,
- JWT et bcryptjs pour l'authentification administrateur.

## Objectif du projet

Ce portfolio permet de presenter mon profil, mes competences, mon CV, mes projets et un formulaire de contact.

La partie administration permet de gerer les contenus dynamiques sans modifier directement le code :

- ajouter, modifier et supprimer des projets,
- ajouter, modifier et supprimer des competences,
- modifier le contenu du CV en ligne,
- consulter et supprimer les messages recus via le formulaire de contact,
- envoyer une image de projet depuis le tableau de bord admin.

## Maquettes Figma

Les maquettes ne sont pas stockees dans le depot GitHub afin de garder le projet leger.

[Portfolio Dynamique Albert TAYO - maquettes](https://www.figma.com/design/CvMneTGOpQwtZYQuK1APP4/Portfolio-Dynamique-Albert-TAYO---maquettes?node-id=3-2&t=3dhkE5ESfFBwFkrh-1)

## Structure du projet

```txt
portfolio-dynamique/
├── front/   Interface React avec Vite
└── back/    API Express connectee a MongoDB
```

## Technologies utilisees

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

### 1. Lancer le back-end

```bash
cd back
npm install
npm run dev
```

L'API est disponible sur :

```txt
http://localhost:5000
http://localhost:5000/api/health
```

### 2. Lancer le front-end

```bash
cd front
npm install
npm run dev
```

Le site est disponible sur :

```txt
http://localhost:5173
```

## Variables d'environnement

Creer `back/.env` a partir de `back/.env.example`.

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

Creer `front/.env` a partir de `front/.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

En production, `VITE_API_URL` doit pointer vers l'URL Render du back-end.

## Initialiser les donnees

Apres la configuration de MongoDB Atlas, lancer ces commandes dans le dossier `back` :

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

Ces scripts remplissent MongoDB avec les projets, les competences, le profil/CV et le compte administrateur.

## Routes principales de l'API

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
DELETE /api/admin/messages/:id
POST /api/admin/uploads/images
```

## Securite

Le projet applique les protections suivantes :

- le mot de passe administrateur est hache avec `bcryptjs`,
- les routes admin sont protegees par un token JWT,
- les donnees recues par l'API sont validees avant l'enregistrement,
- la connexion admin est limitee contre les essais repetes,
- les secrets sont places dans des variables d'environnement,
- le CORS limite les appels au front-end autorise.

## Deploiement

Le projet est separe en trois services :

- le front-end React est deploye sur Vercel,
- le back-end Express est deploye sur Render,
- la base de donnees est hebergee sur MongoDB Atlas.

### Front-end sur Vercel

Dans Vercel, le dossier racine du projet front est `front`.

Configuration :

```txt
Build Command : npm run build
Output Directory : dist
Environment Variable : VITE_API_URL=https://url-du-back-render
```

Role de `VITE_API_URL` :

- en local, le front appelle `http://localhost:5000`,
- en production, le front appelle l'API Render,
- le fichier `front/src/services/api.js` centralise les appels `fetch`.

### Back-end sur Render

Dans Render, le dossier racine du service back est `back`.

Configuration :

```txt
Build Command : npm install
Start Command : npm start
```

Variables d'environnement a renseigner sur Render :

```env
NODE_ENV=production
CLIENT_URL=https://url-du-front-vercel
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio-dynamique
JWT_SECRET=cle_longue_et_unique
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=email_admin
ADMIN_PASSWORD=mot_de_passe_admin_initial
```

Role de ces variables :

- `CLIENT_URL` autorise le front Vercel a appeler l'API,
- `MONGO_URI` connecte Express a MongoDB Atlas,
- `JWT_SECRET` permet de signer et verifier les tokens admin,
- `ADMIN_EMAIL` et `ADMIN_PASSWORD` servent a creer le compte admin au demarrage des donnees.

### Base de donnees sur MongoDB Atlas

MongoDB Atlas stocke les donnees dynamiques du portfolio :

- projets,
- competences,
- profil/CV,
- messages de contact,
- compte administrateur.

Le back-end communique avec MongoDB grace a Mongoose. Le front-end ne se connecte jamais directement a MongoDB : il passe toujours par l'API Express.

### CI/CD

Le depot GitHub est connecte a Vercel et Render.

Quand une nouvelle version est poussee sur GitHub :

1. Vercel detecte le changement et reconstruit le front-end.
2. Render detecte le changement et redemarre le back-end.
3. Le back-end garde la meme base MongoDB Atlas.
4. Les variables d'environnement restent protegees dans Vercel, Render et MongoDB Atlas.

Cette organisation permet de separer clairement :

- l'interface utilisateur,
- l'API serveur,
- la base de donnees,
- les secrets de production.

## Verification avant mise en production

Avant de publier une version, verifier :

- `npm run lint` dans `front`,
- `npm run build` dans `front`,
- `npm start` dans `back`,
- `GET /api/health` sur l'URL Render,
- `VITE_API_URL` sur Vercel,
- `CLIENT_URL` sur Render,
- `MONGO_URI` sur Render,
- `JWT_SECRET` long et unique.
