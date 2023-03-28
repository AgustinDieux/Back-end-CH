const mongoose = require("mongoose");

const collection = "users";

const schema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  age: Number,
  password: String,
  role: {
    type: String,
    enum: ["admin", "usuario"],
    default: "usuario",
  },
});

const userModel = mongoose.model(collection, schema);

module.exports = userModel;
