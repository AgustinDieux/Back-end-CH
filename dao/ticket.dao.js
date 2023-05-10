const Ticket = require("../models/ticket.models");

async function create(data) {
  try {
    const newTicket = new Ticket(data);
    await newTicket.save();
    return newTicket;
  } catch (error) {
    console.error(error);
    throw new Error("Error creando ticket");
  }
}

module.exports = { create };
