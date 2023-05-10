const Cart = require("../models/carts.models");
const productosDao = require("../dao/product.dao");

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
    return newCart; // Devuelve el carrito recién creado
  } catch (error) {
    console.error(error);
    throw new Error("Error creando carrito");
  }
}

async function addProduct(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    // Buscar el producto en la base de datos utilizando el productId
    const product = await productosDao.findById(productId);
    // Crear un nuevo objeto de producto con los campos necesarios
    const newProduct = {
      productId,
      quantity: 1,
      price: product.precio, // Obtener el precio del producto de la base de datos
      nombre: product.nombre, // Obtener el nombre del producto de la base de datos
      descripcion: product.descripcion, // Obtener la descripcion del producto de la base de datos
    };
    cart.products.push(newProduct);
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
