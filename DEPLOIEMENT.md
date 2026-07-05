# Deploiement reel du portfolio

Ce guide permet d'obtenir :

- une URL back-end pour l'API Express,
- une URL front-end pour le site React,
- une connexion reelle entre le front, le back et MongoDB Atlas.

## 1. Preparer MongoDB Atlas

Dans MongoDB Atlas :

1. Ouvrir le projet `portfolio-dynamique`.
2. Aller dans `Network Access`.
3. Ajouter l'adresse IP de l'hebergeur.
4. Pour un premier deploiement simple, ajouter temporairement `0.0.0.0/0`.
5. Verifier que l'utilisateur MongoDB utilise dans `MONGO_URI` existe encore.

## 2. Mettre le projet sur GitHub

Le deploiement Render/Vercel/Netlify se fait plus simplement depuis GitHub.

Depuis le dossier du projet :

```bash
cd "C:\Users\alber\Documents\Nouveau dossier\portfolio-dynamique"
git init
git add .
git commit -m "Version deploiement portfolio dynamique"
```

Puis creer un depot GitHub vide, par exemple :

```txt
portfolio-dynamique
```

Ensuite lier le depot local au depot GitHub :

```bash
git remote add origin https://github.com/VOTRE-COMPTE/portfolio-dynamique.git
git branch -M main
git push -u origin main
```

## 3. Deployer le back-end sur Render

Dans Render :

1. Cliquer sur `New`.
2. Choisir `Web Service`.
3. Connecter le depot GitHub `portfolio-dynamique`.
4. Configurer :

```txt
Name: portfolio-dynamique-api
Root Directory: back
Runtime: Node
Build Command: npm install
Start Command: npm start
```

5. Ajouter les variables d'environnement :

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://URL-DU-FRONT
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/portfolio-dynamique?retryWrites=true&w=majority&appName=PortfolioCluster
JWT_SECRET=une-cle-tres-longue-et-impossible-a-deviner
JWT_EXPIRES_IN=2h
ADMIN_EMAIL=admin@portfolio.local
ADMIN_PASSWORD=mot-de-passe-admin-fort
```

Au premier deploiement, `CLIENT_URL` peut rester temporairement :

```env
CLIENT_URL=http://localhost:5173
```

Il faudra le remplacer par l'URL finale du front apres le deploiement du front.

6. Lancer le deploiement.
7. Verifier :

```txt
https://URL-DU-BACK/api/health
```

## 4. Initialiser les donnees MongoDB en production

Une fois le back deployee, les scripts de seed doivent etre lances avec le meme `MONGO_URI`.

Depuis votre ordinateur, dans le dossier `back`, avec le fichier `.env` qui pointe vers MongoDB Atlas :

```bash
npm run seed:projects
npm run seed:skills
npm run seed:profile-cv
npm run seed:admin
```

## 5. Deployer le front-end

### Option A - Vercel

Dans Vercel :

1. Cliquer sur `Add New Project`.
2. Importer le depot GitHub.
3. Configurer :

```txt
Root Directory: front
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

4. Ajouter la variable :

```env
VITE_API_URL=https://URL-DU-BACK
```

5. Deployer.

Le fichier `front/vercel.json` gere les routes React au refresh.

### Option B - Netlify

Dans Netlify :

1. Creer un nouveau site depuis GitHub.
2. Configurer :

```txt
Base directory: front
Build command: npm run build
Publish directory: front/dist
```

3. Ajouter la variable :

```env
VITE_API_URL=https://URL-DU-BACK
```

4. Deployer.

Le fichier `front/public/_redirects` gere les routes React au refresh.

## 6. Connecter le back au front final

Apres le deploiement du front :

1. Copier l'URL finale du front.
2. Retourner dans Render.
3. Modifier la variable :

```env
CLIENT_URL=https://URL-DU-FRONT
```

4. Relancer le deploiement du back.

## 7. Verifications finales

Verifier ces URLs :

```txt
https://URL-DU-BACK/api/health
https://URL-DU-FRONT
https://URL-DU-FRONT/projets
https://URL-DU-FRONT/cv
https://URL-DU-FRONT/admin/login
```

Verifier les actions :

- les projets s'affichent depuis MongoDB,
- les competences s'affichent depuis MongoDB,
- le CV s'affiche depuis MongoDB,
- le formulaire contact enregistre un message,
- l'admin peut se connecter,
- l'admin peut modifier un projet,
- l'admin peut consulter les messages.

## Note importante sur les images uploadées

Les images importees via l'admin sont stockees dans le dossier `back/public/uploads`.

Pour une soutenance locale ou une demo simple, cela fonctionne.

Pour une vraie production longue duree, il est preferable d'utiliser un stockage externe comme Cloudinary, S3 ou un stockage persistant fourni par l'hebergeur.
