# Back-end du portfolio

API REST Node.js / Express du portfolio dynamique.

## Rôle du back

Le back-end fournit :

- les projets affichés sur le site,
- les compétences,
- le profil et le CV,
- l'enregistrement des messages de contact,
- l'authentification administrateur,
- les routes protégées du tableau de bord,
- l'upload d'images pour les projets.

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example`.

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

Points importants :

- `MONGO_URI` pointe vers MongoDB Atlas,
- `JWT_SECRET` doit contenir au moins 32 caractères,
- `ADMIN_PASSWORD` sert à créer le compte admin puis il est hashé,
- `CLIENT_URL` doit correspondre à l'URL du front en production.

## Lancement

```bash
npm run dev
```

L'API répond sur :

```txt
http://localhost:5000
http://localhost:5000/api/health
```

## Données de départ

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

Ces scripts remplissent MongoDB avec les contenus utilisés par le site.

## Vérification

```bash
npm start
```

La route `/api/health` permet de contrôler rapidement l'état de l'API et de la base.

## Sécurité

L'API protège les routes admin avec un token JWT, valide les données reçues, limite les tentatives de connexion et masque les informations sensibles avant de répondre au front.
