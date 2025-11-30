const express = require("express");
const path = require("path");
// const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args)); // if you want proxying

const app = express();
const PORT = process.env.PORT || 8089;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_BASE = "https://api-gateway-team1.onrender.com";

// Get all products
app.get("/", async (req, res) => {
  const products = await fetch(`${API_BASE}/product`).then(r => r.json());
  const inventory = await fetch(`${API_BASE}/inventory`).then(r => r.json());

  const productsWithInventory = inventory.map(inv => {
    const product = products.find(p => p.id === inv.productId);
    return {
      ...product,
      quantity: inv.quantity
    };
  });

  res.render("index.ejs", { productsWithInventory });
});

// Get all Items in Cart
app.get("/cart", async (req, res) => {
    // Get all items in the cart.
    const cartItems = await fetch(`${API_BASE}/cart`).then(r => r.json());

    // Get all the products by IDs that appear in the cart
    const productPromises = cartItems.map(item =>
        fetch(`${API_BASE}/product/${item.productId}`).then(r => r.json())
    );
    const cartProducts = await Promise.all(productPromises);

    res.render("cart.ejs", { cartItems, cartProducts });
});

// Add Product to Cart
app.post("/addtocart", async (req, res) => {
    try {
        const productId = req.body.id;

        const response = await fetch(
            `${API_BASE}/cart?productId=${productId}&quantity=1`,
            { method: "POST" }
        );

        if (!response.ok) {
            console.error("Error from cart API:", response.status, response.statusText);
            const text = await response.text();
            console.error("Response body:", text);
            return res.status(500).send("Failed to add to cart");
        }

        res.redirect("/");
    } catch (err) {
        console.error("Error adding product to cart:", err);
        res.status(500).send("Server error while adding to cart");
    }
});

// Remove Item From Cart By ID
app.post("/removefromcart", async (req, res) => {
    try {
        const cartItemId = req.body.cartItemId;

        const response = await fetch(`${API_BASE}/cart/${cartItemId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Error from delete API:", response.status, response.statusText);
            const text = await response.text();
            console.error("Response body:", text);
            return res.status(500).send("Failed to remove cart item");
        }

        // Redirect back to cart page
        res.redirect("/cart");

    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).send("Server error while removing item");
    }
});

// Empty Cart
app.post("/emptycart", async (req, res) => {
    try {
        const response = await fetch(`${API_BASE}/cart/empty`, {
            method: "DELETE"
        });

        if (!response.ok) {
            console.error("Error emptying cart:", response.status, response.statusText);
            const body = await response.text();
            console.error("Response body:", body);
            return res.status(500).send("Failed to empty cart");
        }

        res.redirect("/cart");

    } catch (err) {
        console.error("Server error emptying cart:", err);
        res.status(500).send("Server error while emptying cart");
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});