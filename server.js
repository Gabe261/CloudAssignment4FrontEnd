const express = require("express");
const path = require("path");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args)); // if you want proxying

const app = express();
const PORT = process.env.PORT || 8089;

app.use(express.static(path.join(__dirname, "public")));

const BACKEND_BASE_URL = "https://product-service-team1.onrender.com";

app.use("/api", async (req, res) => {
  const url = BACKEND_BASE_URL + req.url;

  try {
    const backendRes = await fetch(url, {
      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: ["GET", "HEAD"].includes(req.method) ? undefined : req.body,
    });

    const data = await backendRes.text();
    res.status(backendRes.status).send(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Proxy error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});