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

// Ruta para la vista de productos en tiempo real
app.get("/real-time-products", (req, res) => {
  res.render("realTimeProducts");
});

app.use(bodyParser.urlencoded({ extended: false }));

let products = [];

var shoppingCart = [];
let productsCart = [];

const productoModel = require("./models/products.models");
const mongoosePaginate = require("mongoose-paginate-v2");

productRouter.get("/products", async (req, res) => {
  try {
    // Obtenemos los valores de los query params
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort || "";
    const query = req.query.query || "";

    // Realizamos la búsqueda según los query params recibidos
    let queryObject = {};
    if (query) {
      queryObject = { nombre: query };
    }
    const options = {
      sort:
        sort === "asc" ? { precio: 1 } : sort === "desc" ? { precio: -1 } : "",
      limit: parseInt(limit),
      page: parseInt(page),
    };
    const productos = await productoModel.paginate(queryObject, options);

    // Creamos el objeto de respuesta
    const response = {
      status: "success",
      payload: productos.docs,
      totalPages: productos.totalPages,
      prevPage: productos.prevPage || null,
      nextPage: productos.nextPage || null,
      page: productos.page,
      hasPrevPage: productos.hasPrevPage,
      hasNextPage: productos.hasNextPage,
      prevLink: productos.hasPrevPage
        ? `/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}`
        : null,
      nextLink: productos.hasNextPage
        ? `/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}`
        : null,
    };

    const products = response.payload.map((product) => {
      return {
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        id: product._id,
      };
    });

    // Enviamos la respuesta con los productos encontrados
    res.render("layouts/products", {
      products,
      user: req.user, // Pasamos los datos del usuario a la vista
    });
  } catch (error) {
    // Si hay un error, enviamos una respuesta con el mensaje de error
    console.error(
      "No se pudieron obtener los productos con Mongoose: " + error
    );
    res.status(500).json({
      error: "No se pudieron obtener los productos con Mongoose",
      message: error,
    });
  }
});

productRouter.get("/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const producto = await productoModel.findById(productId);

    if (!producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    const product = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      id: producto._id,
    };

    res.render("layouts/product", { product });
  } catch (error) {
    console.error("No se pudo obtener el producto con Mongoose: " + error);
    res.status(500).json({
      error: "No se pudo obtener el producto con Mongoose",
      message: error,
    });
  }
});

// Crea una nueva ruta para la petición POST
productRouter.post("/products", async (req, res) => {
  try {
    const producto = await Producto.create({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      cantidad: req.body.cantidad,
    });
    await producto.save();

    // Crear objeto con las propiedades adicionales que quieres incluir
    const response = {
      status: "success",
      payload: producto,
      totalPages: null,
      prevPage: null,
      nextPage: null,
      page: null,
      hasPrevPage: false,
      hasNextPage: false,
      prevLink: null,
      nextLink: null,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error al crear el producto:", error);
    res
      .status(500)
      .json({ error: "Error al crear el producto", message: error });
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

productRouter.delete("/carts/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p._id.toString() === req.params.pid
    );
    if (productIndex === -1) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: "Producto eliminado del carrito" });
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).json({
      error: "Error al eliminar el producto del carrito",
      message: error,
    });
  }
});

productRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await Cart.findById(cartId).populate("products.productId");
    const products = cart.products.map((product) => {
      return {
        nombre: product.productId.nombre,
        descripcion: product.productId.descripcion,
        precio: product.productId.precio,
        id: product.productId._id,
      };
    });

    res.render("layouts/carts", {
      products,
    });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({
      error: "Error al obtener el carrito",
      message: error,
    });
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

// PUT api/carts/:cid/products/:pid
productRouter.put("/carts/:cid/products/:pid", async (req, res) => {
  try {
    // Obtener el carrito y el producto específico
    const cart = await Cart.findById(req.params.cid);
    const product = cart.products.find(
      (product) => product.product == req.params.pid
    );

    // Actualizar la cantidad del producto en el carrito
    product.quantity = req.body.quantity;
    await cart.save();

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ error: "Error al actualizar el producto", message: error });
  }
});

productRouter.delete("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid);

    if (!cart) {
      return res.status(404).json({
        error: `El carrito con id ${req.params.cid} no existe`,
      });
    }

    cart.productos = []; // Elimina todos los productos del carrito
    await cart.save();

    res
      .status(200)
      .json({ result: "success", message: "Productos eliminados del carrito" });
  } catch (error) {
    console.error("Error al eliminar productos del carrito:", error);
    res.status(500).json({
      error: "Error al eliminar productos del carrito",
      message: error,
    });
  }
});

productRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate(
      "products.productId"
    );
    res.render("cart", { products: cart.products });
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res
      .status(500)
      .json({ error: "Error al obtener el carrito", message: error });
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

app.use("/", router);
app.use("/api/", productRouter);
app.use("/api/", cartRouter);
app.use("/", authRoutes);
app.use("/tickets", ticketRouter);
app.use("/api", mockingRoute);
app.use(loggerRouter);

// Crear un nuevo carrito

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
