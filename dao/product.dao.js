const Producto = require("../models/products.models");
const logger = require("../logger");

async function findAll() {
  try {
    const products = await Producto.find();
    logger.info("Obteniendo todos los productos");
    return products;
  } catch (error) {
    logger.error("Error obteniendo productos", error);
    throw new Error("Error obteniendo productos");
  }
}

async function findById(id) {
  try {
    const product = await Producto.findById(id);
    logger.info("Obteniendo producto por ID");
    return product;
  } catch (error) {
    logger.error("Error obteniendo producto por ID", error);
    throw new Error("Error obteniendo producto por ID");
  }
}

async function create(data) {
  try {
    const newProduct = new Producto(data);
    await newProduct.save();
    logger.info("Producto creado exitosamente");
  } catch (error) {
    logger.error("Error creando producto", error);
    throw new Error("Error creando producto");
  }
}

module.exports = { findAll, findById, create };
