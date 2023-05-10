const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticket.controller");

router.post("/", ticketController.createTicket);

module.exports = router;
