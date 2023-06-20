const app = require("../product-manager");
const chai = require("chai");
const chaiHttp = require("chai-http");

chai.use(chaiHttp);
chai.should();

describe("Sessions", () => {
  // Prueba para la ruta GET /session
  describe("GET /session", () => {
    it("Debería obtener la página de inicio de sesión", (done) => {
      chai
        .request(app)
        .get("/session")
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para iniciar sesión
  describe("POST /login", () => {
    it("Debería iniciar sesión correctamente", (done) => {
      const credentials = {
        username: "example_username",
        password: "example_password",
      };
      chai
        .request(app)
        .post("/login")
        .send(credentials)
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para cerrar sesión
  describe("POST /logout", () => {
    it("Debería cerrar sesión correctamente", (done) => {
      chai
        .request(app)
        .post("/logout")
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para registrar un nuevo usuario
  describe("POST /register", () => {
    it("Debería registrar un nuevo usuario", (done) => {
      const newUser = {
        username: "new_user",
        password: "new_password",
      };
      chai
        .request(app)
        .post("/register")
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para la ruta GET /reset-password
  describe("GET /reset-password", () => {
    it("Debería obtener la página de restablecimiento de contraseña", (done) => {
      chai
        .request(app)
        .get("/reset-password")
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para solicitar el restablecimiento de contraseña
  describe("POST /reset-password", () => {
    it("Debería solicitar el restablecimiento de contraseña correctamente", (done) => {
      const email = "example@example.com";
      chai
        .request(app)
        .post("/reset-password")
        .send({ email: email })
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });

  // Prueba para restablecer la contraseña
  describe("POST /reset-password/:token", () => {
    it("Debería restablecer la contraseña correctamente", (done) => {
      const token = "example_reset_token";
      const newPassword = "new_password";
      chai
        .request(app)
        .post(`/reset-password/${token}`)
        .send({ password: newPassword })
        .end((err, res) => {
          res.should.have.status(200);

          done();
        });
    });
  });
});
