const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Opciones de configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Documentación de API",
      version: "1.0.0",
      description: "Documentación de API para el proyecto final",
    },
    servers: [
      {
        url: "http://localhost:9092",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/product.route.js", "./routes/cart.routes.js"],
};

// Generar la documentación de Swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = (app) => {
  // Ruta para la documentación de Swagger
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
