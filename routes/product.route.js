const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

// Rutas relacionadas con productos
router.get("/productsdos", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post("/productsdos", productController.createProduct);

module.exports = router;
