const mongoose = require("mongoose");

const collection = "users";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Carts",
  },
  role: {
    type: String,
    enum: ["admin", "usuario", "premium"],
    default: "usuario",
    required: true,
  },
  documents: [
    {
      name: {
        type: String,
      },
      reference: {
        type: String,
      },
    },
  ],
  last_connection: {
    type: Date,
  },
});

module.exports = mongoose.model(collection, schema);
