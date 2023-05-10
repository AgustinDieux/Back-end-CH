const ticketDao = require("../dao/ticket.dao");
const Cart = require("../models/carts.models");
const Producto = require("../models/products.models");

exports.createTicket = async (req, res) => {
  try {
    console.log("Iniciando función createTicket");
    const { cartId } = req.body;
    console.log("cartId:", req.body);
    // Verificar si cartId es una cadena vacía o nula
    if (!cartId) {
      console.log("ID del carrito no válido");
      return res.status(400).send("ID del carrito no válido");
    }

    // Verificar si el usuario está autenticado
    if (!req.user || !req.user.email) {
      console.log("Usuario no autenticado");
      return res.status(401).send("Usuario no autenticado");
    }

    const purchaser = req.user.email;
    console.log("purchaser:", purchaser);
    // Buscar el carrito en la base de datos utilizando el ID del carrito
    const cart = await Cart.findById(cartId);
    console.log("cart:", cart);
    // Verificar si el carrito existe
    if (!cart) {
      console.log("El carrito no existe");
      return res.status(404).send("El carrito no existe");
    }
    // Iterar sobre los productos en el carrito
    for (const cartItem of cart.products) {
      console.log("cartItem:", cartItem);
      // Buscar el producto en la base de datos utilizando el ID del producto
      const product = await Producto.findById(cartItem.productId);
      console.log("product:", product);
      // Verificar si el producto existe y tiene suficiente cantidad para la cantidad indicada en el carrito
      if (!product || product.cantidad < cartItem.quantity) {
        console.log(
          `No hay suficiente cantidad para el producto ${cartItem.nombre}`
        );
        // Si el producto no existe o no tiene suficiente cantidad, enviar un mensaje de error al cliente y detener el proceso de compra
        return res
          .status(400)
          .send(
            `No hay suficiente cantidad para el producto ${cartItem.nombre}`
          );
      }
    }
    // Si todos los productos tienen suficiente cantidad, continuar con el proceso de compra
    const newTicket = await ticketDao.create({ cartId, purchaser });
    console.log("newTicket:", newTicket);
    res.status(201).json(newTicket);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creando ticket");
  }
};
