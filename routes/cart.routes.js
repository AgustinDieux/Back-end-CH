const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticationMiddleware = require("../middlewares/authorization.middleware");

// Rutas relacionadas con carritos
router.get("/cart/:id", cartController.getCart);
router.post("/cart", cartController.createCart);
router.post("/cart/:id", authenticationMiddleware, cartController.addToCart);
router.delete(
  "/cart/:id",
  authenticationMiddleware,
  cartController.removeFromCart
);

module.exports = router;
