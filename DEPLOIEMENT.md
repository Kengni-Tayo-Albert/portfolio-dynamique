# Déploiement du portfolio dynamique

Ce guide décrit les étapes pour publier le front-end, l'API et la base de données.

## 1. Préparer MongoDB Atlas

Dans MongoDB Atlas :

1. Créer ou ouvrir le cluster du projet.
2. Créer un utilisateur de base de données.
3. Autoriser l'adresse IP de l'hébergeur dans `Network Access`.
4. Récupérer la chaîne `MONGO_URI`.
5. Vérifier que la base utilisée s'appelle `portfolio-dynamique`.

Pour une première mise en ligne, `0.0.0.0/0` peut être utilisé temporairement. Il vaut mieux le remplacer ensuite par des adresses plus limitées.

## 2. Mettre le projet sur GitHub

Depuis le dossier racine du projet :

```bash
git add .
git commit -m "Mise a jour portfolio dynamique"
git push
```

Le dépôt GitHub sert ensuite de source pour Render, Vercel ou Netlify.

## 3. Déployer le back-end

Le back-end peut être déployé sur Render, Railway ou un autre hébergeur Node.js.

Configuration conseillée :

```txt
Root directory: back
Build command: npm install
Start command: npm start
```

Variables d'environnement :

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

Après déploiement, vérifier :

```txt
https://url-du-back/api/health
```

## 4. Initialiser les données

Quand `MONGO_URI` est configuré, lancer les scripts depuis le dossier `back` :

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

Ces scripts créent les contenus nécessaires au site public et au tableau de bord.

## 5. Déployer le front-end

Le front-end peut être publié sur Vercel, Netlify ou Render Static Site.

Configuration conseillée :

```txt
Root directory: front
Build command: npm run build
Publish directory: dist
```

Variable d'environnement :

```env
VITE_API_URL=https://url-du-back
```

Après modification de `VITE_API_URL`, relancer un build pour que le front utilise la bonne API.

## 6. Connecter le front et le back

Quand le front est publié :

1. Copier l'URL finale du front.
2. La placer dans `CLIENT_URL` côté back-end.
3. Relancer le déploiement du back-end.

## 7. Vérifications finales

Vérifier les pages et routes suivantes :

```txt
https://url-du-back/api/health
https://url-du-front
https://url-du-front/projets
https://url-du-front/cv
https://url-du-front/contact
https://url-du-front/admin/login
```

Vérifier aussi les actions principales :

- les projets s'affichent,
- les compétences s'affichent,
- le CV se charge,
- le formulaire de contact enregistre un message,
- l'admin peut se connecter,
- l'admin peut modifier un projet,
- l'admin peut consulter et supprimer les messages.

## Images uploadées

Les images importées depuis l'administration sont stockées dans `back/public/uploads`.

Pour une présentation locale ou une démonstration courte, cette solution suffit. Pour une production durable, il est préférable d'utiliser un stockage persistant comme Cloudinary, S3 ou le stockage proposé par l'hébergeur.
