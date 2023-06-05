const User = require("../models/users.models");
const logger = require("../logger");

async function changeUserRole(req, res) {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    // Cambiar el rol del usuario
    user.role = user.role === "usuario" ? "premium" : "usuario";
    await user.save();
    res.send(`Rol del usuario cambiado a ${user.role}`);
  } catch (error) {
    logger.error("Error cambiando rol del usuario", error);
    res.status(500).send("Error cambiando rol del usuario");
  }
}

module.exports = { changeUserRole };
