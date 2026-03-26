const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

const PORT = Number(process.env.PORT || 5000);

// Intentionally embedded as requested (frontend-only won't work on NewsAPI dev plan).
// You can still override via env var in deployment.
const FALLBACK_NEWS_API_KEY = "e5a75bad3e3e40f0b9b9ac88679d4697";
const NEWS_API_KEY = process.env.NEWS_API_KEY || FALLBACK_NEWS_API_KEY;

app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true });
});

async function forwardNewsApi(res, endpoint, params) {
  const url = `https://newsapi.org/v2/${endpoint}?${new URLSearchParams({
    ...params,
    apiKey: NEWS_API_KEY,
  }).toString()}`;

  const upstream = await fetch(url);
  const data = await upstream.json();
  return res.status(upstream.status).json(data);
}

app.get("/api/top-headlines", async (req, res) => {
  try {
    const page = typeof req.query.page === "string" ? req.query.page : "1";
    const pageSize =
      typeof req.query.pageSize === "string" ? req.query.pageSize : "9";
    const category =
      typeof req.query.category === "string" ? req.query.category : "general";

    // Dev plan: browser requests not allowed (except localhost), so we force server-side fetch.
    return await forwardNewsApi(res, "top-headlines", {
      country: "us",
      category,
      page,
      pageSize,
    });
  } catch (_err) {
    return res.status(500).json({ error: "Upstream request failed." });
  }
});

app.get("/api/everything", async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : "";
    const page = typeof req.query.page === "string" ? req.query.page : "1";
    const pageSize =
      typeof req.query.pageSize === "string" ? req.query.pageSize : "9";

    if (!q.trim()) {
      return res.status(400).json({ error: "Missing q" });
    }

    return await forwardNewsApi(res, "everything", {
      q,
      sortBy: "publishedAt",
      language: "en",
      page,
      pageSize,
    });
  } catch (_err) {
    return res.status(500).json({ error: "Upstream request failed." });
  }
});

if (process.env.NODE_ENV === "production") {
  const buildDir = path.join(__dirname, "..", "build");
  app.use(express.static(buildDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(buildDir, "index.html"));
  });
}

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on :${PORT}`);
});

