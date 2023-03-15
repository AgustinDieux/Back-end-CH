const express = require("express");
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
const router = express.Router();

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://agusdieux:CoderHouse@agustindieux.7cbx16o.mongodb.net/ecommerce?retryWrites=true&w=majority"
    );
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
  })
);
app.set("view engine", "handlebars");

// Ruta para la vista de productos en tiempo real
app.get("/real-time-products", (req, res) => {
  res.render("realTimeProducts");
});

// Ruta para la vista de inicio
app.get("/", (req, res) => {
  res.render("home");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = [];

const productRouter = express.Router();
var shoppingCart = [];
let productsCart = [];

productRouter.get("/products", async (req, res) => {
  try {
    // Busca todos los productos en la base de datos
    const productos = await Producto.find();
    // Envía una respuesta con los productos encontrados
    res.status(200).json({ result: "success", payload: productos });
  } catch (error) {
    // Si hay un error, envía una respuesta con el mensaje de error
    console.error(
      "No se pudieron obtener los productos con Mongoose: " + error
    );
    res.status(500).json({
      error: "No se pudieron obtener los productos con Mongoose",
      message: error,
    });
  }
});

// Crea una nueva ruta para la petición POST
productRouter.post("/products", async (req, res) => {
  console.log("asdasdasdad", req);
  try {
    // Crea un nuevo producto con los datos recibidos en la petición
    const producto = await Producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      cantidad: req.body.cantidad,
    });
    // Guarda el nuevo producto en la base de datos
    await producto.save();

    // Envía una respuesta con el producto creado
    res.status(201).json(producto);
  } catch (error) {
    // Si hay un error, envía una respuesta con el mensaje de error
    res.status(500).json({ error: error.message });
  }
});

productRouter.get("/carts", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json({ result: "success", payload: carts });
  } catch (error) {
    console.error("No se pudieron obtener los carritos con Mongoose: " + error);
    res.status(500).json({
      error: "No se pudieron obtener los carritos con Mongoose",
      message: error,
    });
  }
});

productRouter.post("/carts", async (req, res) => {
  try {
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

app.set("views", "./views/layouts");
app.set("view engine", "handlebars");

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

// Obtener todos los productos con la limitación opcional
productRouter.get("/", (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : products.length;
  res.send(products.slice(0, limit));
});

// Obtener producto por ID
productRouter.get("/:pid", (req, res) => {
  const product = products.find((p) => p.id == req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  res.send(product);
});

// Agregar un nuevo producto
productRouter.post("/", (req, res) => {
  const product = {
    id: products.length + 1,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    status: req.body.status || true,
    stock: req.body.stock,
    category: req.body.category,
  };

  if (
    !req.body.title ||
    !req.body.description ||
    !req.body.status ||
    !req.body.price ||
    !req.body.stock ||
    !req.body.category
  )
    return res.status(400).send("Todos los campos son obligatorios");

  products.push(product);
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

// Eliminar un producto
productRouter.delete("/:pid", (req, res) => {
  const productIndex = products.findIndex((p) => p.id == req.params.pid);
  if (productIndex === -1)
    return res.status(404).send("Producto no encontrado");

  products.splice(productIndex, 1);
  res.send("Producto eliminado");
});

app.use("/api/", productRouter);

// Crear un nuevo carrito

const cartRouter = express.Router();

cartRouter.post("/", (req, res) => {
  const cart = {
    id: shoppingCart.length + 1,
  };

  shoppingCart.push(cart);
  res.send(cart);
});

// Obtener un carrito por ID
cartRouter.get("/:cid", (req, res) => {
  const cart = shoppingCart.find((c) => c.id == req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  res.send(cart);
});

// Agregar un producto a un carrito
cartRouter.post("/:cid/product/:pid", (req, res) => {
  const cart = shoppingCart.find((c) => c.id == req.params.cid);
  if (!cart) return res.status(404).send("Carrito no encontrado");
  const product = products.find((p) => p.id == req.params.pid);
  if (!product) return res.status(404).send("Producto no encontrado");
  const existingProduct = productsCart.find((p) => p.id == req.params.pid);
  if (!existingProduct)
    return res.status(404).send("El producto ya se encuentra en el carrito");

  productsCart.push({ id: req.params.pid, quantity: 1 });

  res.send(cart);
});

app.use("/api/carts", cartRouter);

http.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});

// Función para guardar la información en el archivo "carts.json"
function saveCartsToFile() {
  fs.writeFileSync("carts.json", JSON.stringify(carts));
}

// Cargar la información de los carritos desde el archivo "carts.json" al iniciar el servidor
//try {
//  JSON.parse(fs.readFileSync("carts.json"));
//} catch (err) {
//  console.error("No se pudo cargar la información de los carritos", err);
//}

// Guardar la información de los carritos en el archivo "carts.json" al finalizar el servidor
process.on("exit", saveCartsToFile);
process.on("SIGINT", saveCartsToFile);
process.on("SIGUSR1", saveCartsToFile);
process.on("SIGUSR2", saveCartsToFile);
