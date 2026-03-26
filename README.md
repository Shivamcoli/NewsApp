# ThunderNews

A polished React (Create React App) News app with categories, search, country selection, dark mode, and pagination.

## Prerequisites

- Node.js 18+ recommended
- A NewsAPI key

## Setup

1) Create a `.env` file in the project root (same folder as `package.json`):

```bash
REACT_APP_NEWS_API_KEY=YOUR_KEY_HERE
```

You can copy `.env.example` as a starting point.

2) Install dependencies:

```bash
npm ci
```

## Run (development)

```bash
npm start
```

Open `http://localhost:3000`.

## Build (production)

```bash
npm run build
```

This creates a static site in the `build/` folder.

## Deploy (static hosting)

Upload the `build/` folder to any static host (Netlify / Vercel static / GitHub Pages, etc).

Important: because this is a **frontend-only** app, your API key is embedded in the built JavaScript bundle. If you need a private key, you must use a backend proxy.
