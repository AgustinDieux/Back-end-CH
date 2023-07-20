const User = require("../models/users.models");
const logger = require("../logger");
const nodemailer = require("nodemailer");

// Configurar el transporter para enviar correos electrónicos
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tu_correo@gmail.com",
    pass: "tu_contraseña",
  },
});

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, "name email role");
    res.send(users);
  } catch (error) {
    logger.error("Error obteniendo usuarios", error);
    res.status(500).send("Error obteniendo usuarios");
  }
}

async function changeUserRole(req, res) {
  try {
    const { uid } = req.params;
    const { role } = req.body; // Obtener el valor del nuevo rol del cuerpo de la solicitud
    console.log("User ID:", uid);
    console.log("New Role:", role);

    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Verificar si el usuario que realiza la solicitud es "premium" o "admin"
    const requesterRole = req.user.role;
    console.log("Requester Role:", requesterRole);

    // Verificar si el usuario tiene permisos para cambiar el rol
    if (requesterRole === "premium" || requesterRole === "admin") {
      // Cambiar el rol del usuario
      user.role = role;
      await user.save();
      console.log("Nuevo rol del usuario:", user.role);
      return res.send(`Rol del usuario cambiado a ${user.role}`);
    } else {
      return res.status(403).send("Acceso denegado");
    }
  } catch (error) {
    console.error("Error cambiando rol del usuario:", error);
    res.status(500).send("Error cambiando rol del usuario");
  }
}

async function uploadDocuments(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Obtener los archivos cargados
    const files = req.files;

    // Realizar el procesamiento necesario con los archivos

    // Actualizar el estado del usuario para indicar que ha subido documentos
    user.documentsUploaded = true;

    // Validar el campo "age"
    if (!user.age) {
      return res.status(400).send("La edad del usuario es requerida");
    }

    await user.save();

    res.send("Documentos cargados correctamente");
  } catch (error) {
    logger.error("Error cargando documentos", error);
    console.log(error); // Agregado para imprimir el error en la consola
    res.status(500).send("Error cargando documentos");
  }
}

async function deleteInactiveUsers(req, res) {
  try {
    // Obtener la fecha límite para considerar a un usuario inactivo
    const minutesInactive = 30;
    const dateLimit = new Date();
    dateLimit.setMinutes(dateLimit.getMinutes() - minutesInactive);

    // Buscar y eliminar usuarios inactivos
    const deletedUsers = await User.deleteMany({
      lastConnection: { $lt: dateLimit },
    });

    // Enviar correo electrónico a los usuarios eliminados
    deletedUsers.forEach(async (user) => {
      const mailOptions = {
        from: "tu_correo@gmail.com",
        to: user.email,
        subject: "Cuenta eliminada por inactividad",
        text: "Tu cuenta ha sido eliminada debido a inactividad",
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Correo electrónico enviado a:", user.email);
      } catch (error) {
        console.log("Error enviando correo electrónico a:", user.email, error);
      }
    });

    res.send(`Se han eliminado ${deletedUsers.length} usuarios inactivos`);
  } catch (error) {
    logger.error("Error eliminando usuarios inactivos", error);
    res.status(500).send("Error eliminando usuarios inactivos");
  }
}

async function adminGetAllUsers(req, res) {
  try {
    // Verificar si el usuario es administrador
    if (req.user.role !== "admin") {
      console.log("El usuario no es administrador");
      return res.status(403).send("Acceso denegado");
    }

    const users = await User.find({}, "name email role");

    // Renderizar la vista con handlebars
    res.render("layouts/admin.handlebars", { users });
  } catch (error) {
    logger.error("Error obteniendo usuarios", error);
    res.status(500).send("Error obteniendo usuarios");
  }
}

module.exports = {
  getAllUsers,
  changeUserRole,
  uploadDocuments,
  deleteInactiveUsers,
  adminGetAllUsers,
};
