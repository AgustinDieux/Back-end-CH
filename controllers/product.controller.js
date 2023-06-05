const Producto = require("../models/products.models");
const productDAO = require("../dao/product.dao");
const ProductDTO = require("../dto/product.dto");
const Cart = require("../models/carts.models");
const { generateMockProducts } = require("../mockings/mocking");
const logger = require("../logger");

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
    logger.error("Error obteniendo productos", error);
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
    logger.error("Error obteniendo detalle del producto", error);
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
    logger.error("Error creando producto", error);
    res.status(500).send("Error creando producto");
  }
}

async function deleteProduct(req, res) {
  try {
    const { id } = req.params;
    const product = await Producto.findById(id);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    // Verificar si el usuario es admin o si es el propietario del producto
    if (req.user.role === "admin" || req.user.email === product.owner) {
      await product.remove();
      res.send("Producto eliminado exitosamente");
    } else {
      res.status(403).send("No tienes permiso para eliminar este producto");
    }
  } catch (error) {
    logger.error("Error eliminando producto", error);
    res.status(500).send("Error eliminando producto");
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProduct,
};
