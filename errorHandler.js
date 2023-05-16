function errorHandler(error) {
  if (error instanceof ValidationError) {
    return "Error de validación: Por favor verifica los datos ingresados";
  } else if (error instanceof DatabaseError) {
    return "Error de base de datos: No se pudo completar la operación";
  } else {
    return "Error desconocido: Por favor intenta nuevamente más tarde";
  }
}

const errorDictionary = {
  PRODUCT_NOT_FOUND: "El producto solicitado no fue encontrado",
  CART_FULL: "El carrito está lleno. No se pueden agregar más productos",
  INVALID_QUANTITY: "La cantidad ingresada no es válida",
};

module.exports = { errorHandler, errorDictionary };
