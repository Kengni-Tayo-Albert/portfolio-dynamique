# Portfolio dynamique avec administration

Projet de portfolio dynamique développé avec React, Node.js, Express et MongoDB Atlas.

L'application présente un portfolio public et un espace d'administration sécurisé permettant de gérer une partie du contenu.

## Objectif du projet

Ce projet répond au besoin d'un portfolio dynamique avec :

- une partie front-end React,
- une API REST Node.js / Express,
- une base de données MongoDB Atlas,
- une authentification administrateur,
- un espace admin pour gérer les projets, les compétences et le profil/CV complet,
- un upload d'images pour les projets depuis l'administration,
- un formulaire de contact enregistré en base de données.

## Structure du projet

```txt
portfolio-dynamique/
├── front/   Application React avec Vite
└── back/    API Express connectée à MongoDB
```

## Technologies utilisées

Front-end :

- React
- React Router
- React Icons
- Vite

Back-end :

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Lancement en local

### 1. Lancer le back-end

Ouvrir un premier terminal :

```bash
cd "C:\Users\alber\Documents\Nouveau dossier\portfolio-dynamique\back"
npm install
npm run dev
```

L'API doit répondre sur :

```txt
http://localhost:5000
http://localhost:5000/api/health
```

### 2. Lancer le front-end

Ouvrir un deuxième terminal :

```bash
cd "C:\Users\alber\Documents\Nouveau dossier\portfolio-dynamique\front"
npm install
npm run dev
```

Le site doit répondre sur une URL de ce type :

```txt
http://localhost:5173
```

Si le port `5173` est déjà utilisé, Vite peut ouvrir `5174`.

## Variables d'environnement

### Back-end

Créer un fichier `back/.env` à partir de `back/.env.example`.

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

### Front-end

Créer un fichier `front/.env` à partir de `front/.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

## Initialisation des données

Après configuration de MongoDB, lancer ces commandes dans le dossier `back` :

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

Ces commandes remplissent MongoDB avec les données nécessaires au projet.

## Compte administrateur local

Le compte administrateur est créé avec :

```bash
npm run seed:admin
```

Les identifiants utilisés viennent du fichier `back/.env` :

```env
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=CHANGE_ME_WITH_A_STRONG_PASSWORD
```

Le mot de passe n'est pas stocké en clair dans MongoDB. Il est hashé avec `bcryptjs`.

## Routes principales

Routes publiques :

```txt
GET /api/health
GET /api/projects
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
POST /api/admin/uploads/images
```

## Déploiement

Un guide complet étape par étape est disponible dans [DEPLOIEMENT.md](DEPLOIEMENT.md).

### Base de données

La base est hébergée sur MongoDB Atlas.

À prévoir :

- créer un cluster Atlas,
- créer un utilisateur de base de données,
- autoriser l'adresse IP du serveur de déploiement,
- récupérer la chaîne `MONGO_URI`,
- vérifier que la base utilisée s'appelle `portfolio-dynamique`.

### Déploiement du back-end

Le back-end peut être déployé sur Render, Railway ou un autre hébergeur Node.js.

Paramètres à renseigner :

```txt
Build command: npm install
Start command: npm start
Root directory: back
```

Variables d'environnement à ajouter sur l'hébergeur :

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

Après le premier déploiement, lancer les scripts de seed depuis l'environnement de l'hébergeur si disponible, ou les lancer localement avec le `MONGO_URI` Atlas.

### Déploiement du front-end

Le front-end peut être déployé sur Vercel, Netlify ou Render Static Site.

Paramètres à renseigner :

```txt
Build command: npm run build
Publish directory: dist
Root directory: front
```

Variable d'environnement à ajouter :

```env
VITE_API_URL=https://url-du-back
```

Important : après avoir modifié `VITE_API_URL`, il faut relancer un nouveau build du front.
