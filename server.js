const express = require("express");
const path = require("path");
// const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args)); // if you want proxying

const app = express();
const PORT = process.env.PORT || 8089;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_BASE = "https://api-gateway-team1.onrender.com";

app.get("/", async (req, res) => {
    const products = await fetch(`${API_BASE}/product`).then(r => r.json());
    res.render("index.ejs", { products });
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});