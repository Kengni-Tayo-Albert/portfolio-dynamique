# Front-end du portfolio

Interface React du portfolio dynamique.

## Rôle du front

Le front affiche :

- l'accueil du portfolio,
- la page À propos,
- le CV en ligne,
- les compétences,
- les projets,
- le formulaire de contact,
- l'espace d'administration.

Les maquettes sont consultables dans Figma depuis le README principal. 

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

Si cette variable est vide, l'application utilise les fichiers JSON de `public/api`. Cela permet de présenter le site sans lancer le back-end.

## Lancement

```bash
npm run dev
```

Le site s'ouvre généralement sur :

```txt
http://localhost:5173
```

## Vérification

```bash
npm run lint
npm run build
```

## Déploiement

Configuration conseillée pour Vercel, Netlify ou Render Static Site :

```txt
Root directory: front
Build command: npm run build
Publish directory: dist
```

Variable d'environnement de production :

```env
VITE_API_URL=https://url-du-back
```
