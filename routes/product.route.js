const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authorizationMiddleware = require("../middlewares/authorization.middleware");

/**
 * @swagger
 * /productsdos:
 *   get:
 *     summary: Obtener todos los productos
 *     responses:
 *       200:
 *         description: Éxito. Retorna la lista de productos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/productsdos", productController.getAllProducts);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Obtener un producto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Éxito. Retorna el producto solicitado.
 *       404:
 *         description: No se encontró el producto con el ID especificado.
 */
router.get("/products/:id", productController.getProductById);

/**
 * @swagger
 * /productsdos:
 *   post:
 *     summary: Crear un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto.
 *               price:
 *                 type: number
 *                 description: Precio del producto.
 *               description:
 *                 type: string
 *                 description: Descripción del producto.
 *             required:
 *               - name
 *               - price
 *     responses:
 *       201:
 *         description: Producto creado con éxito.
 *       400:
 *         description: Error en la solicitud. Faltan campos requeridos o son inválidos.
 */
router.post(
  "/productsdos",
  authorizationMiddleware,
  productController.createProduct
);

/**
 * @swagger
 * /{userId}/productsdos/{productId}:
 *   delete:
 *     summary: Eliminar un producto por ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario premium.
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID del producto a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado con éxito.
 *       404:
 *         description: No se encontró el producto con el ID especificado.
 */
router.delete(
  "/productsdos/:id",
  authorizationMiddleware,
  productController.deleteProduct
);

module.exports = router;
