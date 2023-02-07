const express = require("express");
const app = express();
const fs = require("fs");

class Product {
  constructor(id, name, price, description) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.description = description;
  }
}

class ProductManager {
  constructor() {
    this.products = [];
  }

  loadProducts() {
    try {
      const productsJson = fs.readFileSync("products.json");
      this.products = JSON.parse(productsJson);
    } catch (error) {
      console.error("Error reading products from file:", error);
    }
  }

  getProducts(limit = this.products.length) {
    return this.products.slice(0, limit);
  }

  getProductById(id) {
    const product = this.products.find((product) => product.id == id);
    if (!product) {
      throw new Error(`Product with id "${id}" not found.`);
    }
    return product;
  }
}

const productManager = new ProductManager();
productManager.loadProducts();

app.get("/products", (req, res) => {
  const limit = req.query.limit;
  const products = productManager.getProducts(limit);
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const id = req.params.id;
  try {
    const product = productManager.getProductById(id);
    console.log(product);
    res.json(product);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
