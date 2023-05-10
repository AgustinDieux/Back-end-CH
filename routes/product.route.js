const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

// Rutas relacionadas con productos
router.get("/productsdos", productController.getAllProducts);
router.get("/:id", productController.getProductById);
router.post(
  "/productsdos",
  authorizationMiddleware,
  productController.createProduct
);

module.exports = router;
