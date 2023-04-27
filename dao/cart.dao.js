const Cart = require("../models/carts.models");

async function findById(id) {
  try {
    return await Cart.findById(id);
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo carrito por ID");
  }
}

async function create(data) {
  try {
    const newCart = new Cart(data);
    await newCart.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error creando carrito");
  }
}

async function addProduct(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    cart.products.push(productId);
    await cart.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error agregando producto al carrito");
  }
}

async function removeProduct(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((p) => p.toString() !== productId);
    await cart.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error eliminando producto del carrito");
  }
}

module.exports = {
  findById,
  create,
  addProduct,
  removeProduct,
};
