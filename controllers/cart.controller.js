const Cart = require("../models/carts.models");
const cartDao = require("../dao/cart.dao");

async function getCart(req, res) {
  try {
    const { id } = req.params;
    const cart = await Cart.findById(id).populate("products");
    res.render("cart", { cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo carrito");
  }
}

async function addToCart(req, res) {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const cart = await Cart.findById(id);
    cart.products.push(productId);
    await cart.save();
    res.status(200).send("Producto agregado al carrito exitosamente");
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
