const nodemailer = require("nodemailer");

// Configura el transporte de correo electrónico
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "ejemplo@gmail.com",
    pass: "ejemplo123",
  },
});

exports.sendEmail = async (to, subject, text) => {
  // Configura las opciones del correo electrónico
  const mailOptions = {
    from: "ejemplo@gmail.com",
    to,
    subject,
    text,
  };

  // Envía el correo electrónico
  await transporter.sendMail(mailOptions);
};
