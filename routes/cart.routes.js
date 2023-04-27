const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");

// Rutas relacionadas con carritos
router.get("/cart/:id", cartController.getCart);
router.post("/cart", cartController.createCart);
router.post("/cart/:id", cartController.addToCart);
router.delete("/cart/:id", cartController.removeFromCart);

module.exports = router;
