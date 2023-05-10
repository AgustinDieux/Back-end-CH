class ProductDTO {
  constructor(product) {
    this.id = product._id;
    this.name = product.nombre;
    this.description = product.descripcion;
    this.price = product.precio;
    this.quantity = product.cantidad;
  }
}

module.exports = ProductDTO;
