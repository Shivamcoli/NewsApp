# ThunderNews

A polished React (Create React App) News app with categories, search, dark mode, and pagination.

## Prerequisites

- Node.js 18+ recommended
- A NewsAPI key

## Setup

This app uses a small Node backend proxy so it works with the NewsAPI Developer plan (which blocks browser requests except from localhost).

2) Install dependencies:

```bash
npm ci
```

## Run (development)

Runs backend (`:5000`) + frontend (`:3000`):

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build (production)

```bash
npm run build
```

## Run (production)

```bash
set NODE_ENV=production
node server/index.js
```

Open `http://localhost:5000`.

## Deploy (static hosting)

Deploy this as a **Node web app** (Render/Railway/Fly/etc):

- **Build command**: `npm ci && npm run build`
- **Start command**: `node server/index.js`
- **Env** (optional): `NEWS_API_KEY` to override the embedded key
