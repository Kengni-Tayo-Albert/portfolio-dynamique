# Front-end du portfolio dynamique

Application React du portfolio dynamique.

## Installation

```bash
npm install
```

## Configuration

Créer un fichier `.env` à partir de `.env.example`.

```env
VITE_API_URL=http://localhost:5000
```

Cette variable indique au front l'adresse de l'API Express.

## Lancement en développement

```bash
npm run dev
```

Le site s'ouvre généralement sur :

```txt
http://localhost:5173
```

Si ce port est déjà utilisé, Vite peut proposer `http://localhost:5174`.

## Vérification du code

```bash
npm run lint
```

## Build de production

```bash
npm run build
```

Le dossier généré est :

```txt
dist
```

## Prévisualiser le build

```bash
npm run preview
```

## Déploiement

Pour un hébergement front type Vercel, Netlify ou Render Static Site :

```txt
Root directory: front
Build command: npm run build
Publish directory: dist
```

Variable d'environnement à configurer sur l'hébergeur :

```env
VITE_API_URL=https://url-du-back
```

Après modification de `VITE_API_URL`, il faut relancer le build.
