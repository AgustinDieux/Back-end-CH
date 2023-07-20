const nodemailer = require("nodemailer");

// Configurar el transporter para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "coderhtesting@gmail.com",
    pass: "qrzxrbooefeliwae",
  },
});

module.exports = transporter;
