const Cart = require("../models/carts.models");
const cartDao = require("../dao/cart.dao");
const CartDTO = require("../dto/cart.dto");

async function getCart(req, res) {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id).populate("products");
    const cartDTO = new CartDTO(cart);
    console.log("hola", cartDTO.products);
    res.render("layouts/carts", { cart: id, products: cartDTO.products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo carrito");
  }
}

async function addToCart(req, res) {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    await cartDao.addProduct(id, productId);
    const cart = await cartDao.findById(id);
    const cartDTO = new CartDTO(cart);
    res.status(200).json(cartDTO);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    res.status(500).send("Error eliminando producto del carrito");
  }
}

async function createCart(req, res) {
  try {
    const newCart = await cartDao.create({});
    res.status(201).json(newCart);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando carrito");
  }
}

module.exports = { getCart, addToCart, removeFromCart, createCart };
