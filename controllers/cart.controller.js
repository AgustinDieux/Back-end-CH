const Cart = require("../models/carts.models");
const cartDao = require("../dao/cart.dao");
const CartDTO = require("../dto/cart.dto");
const logger = require("../logger");
const Producto = require("../models/products.models");

async function getCart(req, res) {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id).populate("products");
    const cartDTO = new CartDTO(cart);
    logger.info("hola", cartDTO.products);
    res.render("layouts/carts", { cart: id, products: cartDTO.products });
  } catch (error) {
    logger.error("Error obteniendo carrito", error);
    res.status(500).send("Error obteniendo carrito");
  }
}

async function addToCart(req, res) {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    // Buscar el producto en la base de datos
    const product = await Producto.findById(productId);
    // Verificar si el producto pertenece al usuario actual
    if (req.user.role === "premium" && req.user.email === product.owner) {
      return res
        .status(403)
        .send("No puedes agregar tu propio producto a tu carrito");
    }
    await cartDao.addProduct(id, productId);
    const cart = await cartDao.findById(id);
    const cartDTO = new CartDTO(cart);
    res.status(200).json(cartDTO);
  } catch (error) {
    logger.error("Error agregando producto al carrito", error);
    res.status(500).send("Error agregando producto al carrito");
  }
}

async function removeFromCart(req, res) {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const cart = await Cart.findById(id);
    cart.products = cart.products.filter((p) => p.toString() !== productId);
    await cart.save();
    res.status(200).send("Producto eliminado del carrito exitosamente");
  } catch (error) {
    logger.error("Error eliminando producto del carrito", error);
    res.status(500).send("Error eliminando producto del carrito");
  }
}

async function createCart(req, res) {
  try {
    const newCart = await cartDao.create({});
    res.status(201).json(newCart);
  } catch (error) {
    logger.error("Error creando carrito", error);
    res.status(500).send("Error creando carrito");
  }
}

module.exports = { getCart, addToCart, removeFromCart, createCart };
