const express = require("express");
const exphbs = require("express-handlebars");
const app = express();
const fs = require("fs");
const port = 9092;
const http = require("http").Server(app);
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("addProduct", (product) => {
    // Agregar el producto a la lista
    products.push(product);

    // Emitir el evento de que se ha agregado un producto
    io.emit("productAdded", product);
  });
});

app.engine("handlebars", exphbs.engine());
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

app.use("/api/products", productRouter);

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

app.listen(port, () => {
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
