const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.patch("/premium/:uid", userController.changeUserRole);

module.exports = router;
