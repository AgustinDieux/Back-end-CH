const Producto = require("../models/products.models");

async function getAllProducts(req, res) {
  try {
    const products = await Producto.find();
    console.log(products);
    res.render("layouts/products", { products });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo productos");
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    const product = await Producto.findById(id);
    res.render("productDetail", { product });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo detalle del producto");
  }
}

async function createProduct(req, res) {
  try {
    const { body } = req;
    const newProduct = new Producto(body);
    await newProduct.save();
    res.status(201).send("Producto creado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando producto");
  }
}

module.exports = { getAllProducts, getProductById, createProduct };
