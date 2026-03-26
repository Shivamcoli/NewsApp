const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();

const PORT = Number(process.env.PORT || 5000);
const NEWS_API_KEY = process.env.NEWS_API_KEY;

app.get("/api/healthz", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/top-headlines", async (req, res) => {
  try {
    if (!NEWS_API_KEY) {
      return res.status(500).json({
        error:
          "Server misconfigured: missing NEWS_API_KEY. Set it in your environment.",
      });
    }

    const country = typeof req.query.country === "string" ? req.query.country : "in";
    const page = typeof req.query.page === "string" ? req.query.page : "1";
    const pageSize =
      typeof req.query.pageSize === "string" ? req.query.pageSize : "6";

    const url =
      "https://newsapi.org/v2/top-headlines?" +
      new URLSearchParams({
        country,
        page,
        pageSize,
        apiKey: NEWS_API_KEY,
      }).toString();

    const upstream = await fetch(url);
    const data = await upstream.json();

    return res.status(upstream.status).json(data);
  } catch (err) {
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

