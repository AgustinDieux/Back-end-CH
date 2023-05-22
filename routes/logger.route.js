const express = require("express");
const router = express.Router();
const logger = require("../logger");

// Ruta para probar todos los logs
router.get("/loggerTest", (req, res) => {
  logger.debug("Mensaje de debug");
  logger.http("Mensaje de http");
  logger.info("Mensaje de info");
  logger.warning("Mensaje de warning");
  logger.error("Mensaje de error");
  logger.fatal("Mensaje de fatal");

  res.send("Logs enviados correctamente");
});

module.exports = router;
