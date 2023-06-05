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

// Agregar la ruta GET para /reset-password
router.get("/reset-password", (req, res) => {
  res.render("layouts/reset-password");
});

router.post("/reset-password", authController.requestPasswordReset);

router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;
