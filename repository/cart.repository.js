const cartDao = require("../dao/cart.dao");

async function getCartById(id) {
  return await cartDao.findById(id);
}

async function createCart(data) {
  return await cartDao.create(data);
}

async function addProductToCart(cartId, productId) {
  return await cartDao.addProduct(cartId, productId);
}

async function removeProductFromCart(cartId, productId) {
  return await cartDao.removeProduct(cartId, productId);
}

module.exports = {
  getCartById,
  createCart,
  addProductToCart,
  removeProductFromCart,
};
