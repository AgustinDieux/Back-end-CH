const app = require("../product-manager");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

describe("Products", () => {
  // Prueba para obtener todos los productos
  describe("GET /api/products", () => {
    it("Debería obtener todos los productos", (done) => {
      chai
        .request(app)
        .get("/api/products")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("array");
          done();
        });
    });
  });

  // Prueba para obtener un producto por ID
  describe("GET /api/products/:id", () => {
    it("Debería obtener un producto por ID", (done) => {
      const productId = "example_product_id"; // Reemplaza con un ID válido de un producto existente
      chai
        .request(app)
        .get(`/api/products/${productId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an("object");
          res.body.should.have.property("name");
          res.body.should.have.property("price");
          res.body.should.have.property("description");
          done();
        });
    });
  });

  // Prueba para crear un nuevo producto
  describe("POST /api/products", () => {
    it("Debería crear un nuevo producto", (done) => {
      const newProduct = {
        name: "Nuevo producto",
        price: 9.99,
        description: "Descripción del nuevo producto",
      };
      chai
        .request(app)
        .post("/api/products")
        .send(newProduct)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an("object");
          res.body.should.have.property("name").equal(newProduct.name);
          res.body.should.have.property("price").equal(newProduct.price);
          res.body.should.have
            .property("description")
            .equal(newProduct.description);
          done();
        });
    });
  });

  // Prueba para eliminar un producto por ID
  describe("DELETE /api/products/:id", () => {
    it("Debería eliminar un producto por ID", (done) => {
      const productId = "example_product_id"; // Reemplaza con un ID válido de un producto existente
      chai
        .request(app)
        .delete(`/api/products/${productId}`)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
