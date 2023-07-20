const Producto = require("../models/products.models");
const productDAO = require("../dao/product.dao");
const ProductDTO = require("../dto/product.dto");
const Cart = require("../models/carts.models");
const { generateMockProducts } = require("../mockings/mocking");
const logger = require("../logger");
const transporter = require("../email.service");
const User = require("../models/users.models");

async function getAllProducts(req, res) {
  try {
    const products = await productDAO.findAll();
    // Obtener el ID del carrito del usuario actual
    const cartId = req.user.cart;
    // Buscar el carrito en la base de datos utilizando el ID del carrito
    const cart = await Cart.findById(cartId);

    // Aquí tienes la lógica para determinar si mostrar o no el botón "Eliminar producto"
    const showDeleteButton =
      req.user.role === "admin" || req.user.role === "premium";

    // Renderizar la vista layouts/products y pasarle los objetos products, cart y showDeleteButton
    res.render("layouts/products", { products, cart, showDeleteButton });
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
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    const productDTO = new ProductDTO(product);
    // Renderizar la vista "productDetail" y pasarle el objeto productDTO
    res.render("layouts/productDetail", { product: productDTO });
  } catch (error) {
    logger.error("Error obteniendo detalle del producto", error);
    res.status(500).json({ error: "Error obteniendo detalle del producto" });
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
    console.log("ID del producto a eliminar:", id);
    const product = await Producto.findById(id);
    console.log("Producto encontrado:", product);
    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    // Verificar si el usuario es admin, premium o si es el propietario del producto
    if (
      req.user.role === "admin" ||
      req.user.role === "premium" ||
      req.user.email === product.owner
    ) {
      // Verificar si el propietario del producto es un usuario premium
      const premiumUser = await User.findOne({
        email: product.owner,
        role: "premium",
      });
      const isPremiumUser = premiumUser !== null;

      // Eliminar el producto
      await Producto.findByIdAndRemove(id);

      // Enviar correo electrónico si el propietario es un usuario premium
      if (isPremiumUser) {
        const mailOptions = {
          from: "coderhtesting@gmail.com",
          to: product.owner,
          subject: "Producto eliminado",
          text: "Tu producto ha sido eliminado",
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log("Correo electrónico enviado a:", product.owner);
        } catch (error) {
          console.log(
            "Error enviando correo electrónico a:",
            product.owner,
            error
          );
        }
      }

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
