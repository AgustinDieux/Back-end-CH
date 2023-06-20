const app = require("../product-manager");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

describe("Carts", () => {
  // Prueba para obtener un carrito por ID
  describe("GET /cart/:id", () => {
    it("Debería obtener un carrito por ID", (done) => {
      const cartId = "example_cart_id"; // Reemplaza con un ID válido de un carrito existente
      chai
        .request(app)
        .get(`/cart/${cartId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  // Prueba para crear un nuevo carrito
  describe("POST /cart", () => {
    it("Debería crear un nuevo carrito", (done) => {
      chai
        .request(app)
        .post("/cart")
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          done();
        });
    });
  });

  // Prueba para agregar un producto a un carrito por ID de carrito
  describe("POST /cart/:id", () => {
    it("Debería agregar un producto a un carrito por ID de carrito", (done) => {
      const cartId = "example_cart_id"; // Reemplaza con un ID válido de un carrito existente
      const productId = "example_product_id"; // Reemplaza con un ID válido de un producto existente
      const requestBody = {
        productId: productId,
      };
      chai
        .request(app)
        .post(`/cart/${cartId}`)
        .send(requestBody)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });

  // Prueba para eliminar un producto de un carrito por ID de carrito y ID de producto
  describe("DELETE /cart/:id", () => {
    it("Debería eliminar un producto de un carrito por ID de carrito y ID de producto", (done) => {
      const cartId = "example_cart_id"; // Reemplaza con un ID válido de un carrito existente
      const productId = "example_product_id"; // Reemplaza con un ID válido de un producto existente
      chai
        .request(app)
        .delete(`/cart/${cartId}`)
        .query({ productId: productId })
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
