const express = require("express");
const router = express.Router();
const { mockingProductsHandler } = require("../mockings/mocking");

router.get("/mockingproducts", mockingProductsHandler);

module.exports = router;
