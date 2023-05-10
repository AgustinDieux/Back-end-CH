const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ticketSchema = new Schema({
  code: {
    type: String,
    unique: true,
    default: function () {
      // Generar un código único utilizando la fecha y hora actual y un número aleatorio
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    },
  },
  purchase_datetime: {
    type: Date,
    default: Date.now,
  },
  amount: Number,
  purchaser: {
    email: String,
  },
  cartId: {
    type: Schema.Types.ObjectId,
    ref: "Cart",
    required: true,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
