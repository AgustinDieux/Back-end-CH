function authorizationMiddleware(req, res, next) {
  // Verifica si el usuario está autenticado y tiene el rol necesario
  if (
    req.user &&
    (req.user.role === "admin" ||
      req.user.role === "usuario" ||
      req.user.role === "premium")
  ) {
    // El usuario es administrador, usuario o premium, continúa con el flujo de ejecución
    next();
  } else {
    // El usuario no tiene el rol adecuado, envía una respuesta de error
    res
      .status(403)
      .json({ message: "No tienes permiso para acceder a este recurso" });
  }
}

module.exports = authorizationMiddleware;
