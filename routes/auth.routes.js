const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Rutas para autenticación de usuarios
router.get("/session", (req, res) => {
  const { register } = req.query;
  res.render("layouts/session", { showRegisterForm: register });
});

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.post("/register", authController.register);

module.exports = router;
