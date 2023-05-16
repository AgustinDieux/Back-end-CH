const Producto = require("../models/products.models");
const productDAO = require("../dao/product.dao");
const ProductDTO = require("../dto/product.dto");
const Cart = require("../models/carts.models");
const { generateMockProducts } = require("../mockings/mocking");

async function getAllProducts(req, res) {
  try {
    const products = await productDAO.findAll();
    // Obtener el ID del carrito del usuario actual
    const cartId = req.user.cart;
    // Buscar el carrito en la base de datos utilizando el ID del carrito
    const cart = await Cart.findById(cartId);
    // Renderizar la vista layouts/products y pasarle los objetos products y cart
    res.render("layouts/products", { products, cart });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error obteniendo productos");
  }
}

async function getProductById(req, res) {
  try {
    const { id } = req.params;
    if (id === "mockingproducts") {
      const mockProducts = generateMockProducts();
      return res.json(mockProducts);
    }
    const product = await Producto.findById(id);
    const productDTO = new ProductDTO(product);
    res.render("productDetail", { product: productDTO });
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
