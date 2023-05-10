const productDao = require("../dao/product.dao");

async function getAllProducts() {
  return await productDao.findAll();
}

async function getProductById(id) {
  return await productDao.findById(id);
}

async function createProduct(data) {
  return await productDao.create(data);
}

module.exports = { getAllProducts, getProductById, createProduct };
