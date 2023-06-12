const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authenticationMiddleware = require("../middlewares/authorization.middleware");

/**
 * @swagger
 * /cart/{id}:
 *   get:
 *     summary: Obtener un carrito por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del carrito a obtener
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Éxito. Retorna el carrito solicitado.
 *       404:
 *         description: No se encontró el carrito con el ID especificado.
 */
router.get("/cart/:id", cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Crear un nuevo carrito
 *     responses:
 *       201:
 *         description: Carrito creado con éxito.
 */
router.post("/cart", cartController.createCart);

/**
 * @swagger
 * /cart/{id}:
 *   post:
 *     summary: Agregar un producto a un carrito por ID de carrito
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del carrito al que se agregará el producto.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID del producto a agregar al carrito.
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito.
 *       400:
 *         description: Error en la solicitud. Faltan campos requeridos o son inválidos.
 */
router.post("/cart/:id", authenticationMiddleware, cartController.addToCart);

/**
 * @swagger
 * /cart/{id}:
 *   delete:
 *     summary: Eliminar un producto de un carrito por ID de carrito y ID de producto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del carrito del que se eliminará el producto.
 *         schema:
 *           type: string
 *       - in: query
 *         name: productId
 *         required: true
 *         description: ID del producto a eliminar del carrito.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado del carrito con éxito.
 *       404:
 *         description: No se encontró el producto con el ID especificado en el carrito especificado.
 */
router.delete(
  "/cart/:id",
  authenticationMiddleware,
  cartController.removeFromCart
);

module.exports = router;
