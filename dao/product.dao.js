const Producto = require("../models/products.models");

async function findAll() {
  try {
    return await Producto.find();
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo productos");
  }
}

async function findById(id) {
  try {
    return await Producto.findById(id);
  } catch (error) {
    console.error(error);
    throw new Error("Error obteniendo producto por ID");
  }
}

async function create(data) {
  try {
    const newProduct = new Producto(data);
    await newProduct.save();
  } catch (error) {
    console.error(error);
    throw new Error("Error creando producto");
  }
}

module.exports = { findAll, findById, create };
