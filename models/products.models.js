const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
    min: 0,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
