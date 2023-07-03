const User = require("../models/users.models");
const logger = require("../logger");

async function changeUserRole(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }

    // Verificar si el usuario ha cargado los documentos requeridos
    const requiredDocuments = [
      "Identificación",
      "Comprobante de domicilio",
      "Comprobante de estado de cuenta",
    ];
    const isDocumentsUploaded = requiredDocuments.every((doc) =>
      user.documents.some((d) => d.name === doc)
    );

    if (!isDocumentsUploaded) {
      return res
        .status(400)
        .send("El usuario no ha terminado de cargar su documentación");
    }

    // Cambiar el rol del usuario solo si es de usuario a premium
    if (user.role === "usuario") {
      user.role = "premium";
      await user.save();
      return res.send(`Rol del usuario cambiado a ${user.role}`);
    } else {
      return res.status(400).send("El usuario ya es premium");
    }
  } catch (error) {
    logger.error("Error cambiando rol del usuario", error);
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

module.exports = { changeUserRole, uploadDocuments };
