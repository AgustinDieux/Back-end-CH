const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const app = express();
const fs = require("fs");
const path = require("path");
const port = 9092;
const http = require("http").Server(app);
const io = require("socket.io")(http);
const mongoose = require("mongoose");
const Producto = require("./models/products.models");
const Cart = require("./models/carts.models");
const Message = require("./models/messages.models");
const userModel = require("./models/users.models.js");
const router = express.Router();
const session = require("express-session");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const productRouter = require("./routes/product.route.js");
const cartRouter = require("./routes/cart.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const dotenv = require("dotenv");
const config = require("./config.js");
const ticketRouter = require("./routes/ticket.route.js");
const mockingRoute = require("./routes/mocking.routes");
const logger = require("./logger");
const userRoutes = require("./routes/user.route");
const loggerRouter = require("./routes/logger.route.js");
console.log(config.dbUser);

const {
  getAllProducts,
  getProductById,
  createProduct,
} = require("./controllers/product.controller");
const {
  getCart,
  addToCart,
  removeFromCart,
  createCart,
} = require("./controllers/cart.controller");

dotenv.config();

const connectMongoDB = async () => {
  try {
    const dbUser = process.env.DB_USER;
    const dbPass = process.env.DB_PASS;
    const dbUrl = `mongodb+srv://${dbUser}:${dbPass}@agustindieux.7cbx16o.mongodb.net/ecommerce?retryWrites=true&w=majority`;
    await mongoose.connect(dbUrl);
    console.log("Conectado a MongoDB!");
  } catch (error) {
    console.error("Error de conexión:", error);
  }
};
connectMongoDB();

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("addProduct", (product) => {
    // Agregar el producto a la lista
    products.push(product);

    // Emitir el evento de que se ha agregado un producto
    io.emit("productAdded", product);
  });
});

app.engine(
  "handlebars",
  exphbs.engine({
    layoutsDir: __dirname + "/views/layouts",
    // Agregar opción para deshabilitar la verificación de propiedades propias
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set("view engine", "handlebars");

const Handlebars = exphbs.create({
  // Agregar opción para deshabilitar la verificación de propiedades propias
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
  },
});

app.engine("handlebars", Handlebars.engine);
app.set("view engine", "handlebars");

app.use(
  session({
    secret: "cadenaDeTextoSecreta",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de Swagger
require("./swagger")(app);

// Ruta para la vista de productos en tiempo real
app.get("/real-time-products", (req, res) => {
  res.render("realTimeProducts");
});

app.use(bodyParser.urlencoded({ extended: false }));

let products = [];

const productoModel = require("./models/products.models");
const mongoosePaginate = require("mongoose-paginate-v2");

productRouter.post("/carts", async (req, res) => {
  try {
    console.log(req.body);
    console.log("userId:", req.body.userId);
    console.log("products:", req.body.products);
    console.log("total:", req.body.total);
    const cart = await Cart.create({
      userId: req.body.userId,
      products: req.body.products,
      total: req.body.total,
    });
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT para actualizar un carrito
productRouter.put("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const products = req.body.products;
    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { products },
      { new: true }
    );
    res.status(200).json({
      message: `Carrito con ID ${cartId} actualizado con éxito`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar el carrito:", error);
    res.status(500).json({
      error: "Error al actualizar el carrito",
      message: error,
    });
  }
});

productRouter.get("/chat", async (req, res) => {
  try {
    const messages = await Message.find();
    res.render("chat", { title: "Chat", messages });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error retrieving messages");
  }
});

productRouter.post("/chat", async (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = new Message({
    name,
    email,
    message,
  });
  try {
    await newMessage.save();
    res.redirect("/chat");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error saving message");
  }
});

// Obtener producto por ID
productRouter.get("/:pid", (req, res) => {
  const product = products.find((p) => p.id == req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  res.send(product);
});

// Actualizar un producto
productRouter.put("/:pid", (req, res) => {
  const product = products.find((p) => p.id == req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");

  product.title = req.body.title;
  product.description = req.body.description;
  product.price = req.body.price;
  product.status = req.body.status;
  product.stock = req.body.stock;
  product.category = req.body.category;

  res.send(product);
});

app.use("/", router);
app.use("/api/", productRouter);
app.use("/api/", cartRouter);
app.use("/", authRoutes);
app.use("/tickets", ticketRouter);
app.use("/api", mockingRoute);
app.use(loggerRouter);
app.use("/api/users", userRoutes);

// Crear un nuevo carrito

app.use("/api/carts", cartRouter);

http.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

// Función para guardar la información en el archivo "carts.json"
function saveCartsToFile() {
  fs.writeFileSync("carts.json", JSON.stringify(carts));
}
