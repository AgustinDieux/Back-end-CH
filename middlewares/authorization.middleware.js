function authorizationMiddleware(req, res, next) {
  // Verifica si el usuario está autenticado y tiene el rol necesario
  if (req.user && (req.user.role === "admin" || req.user.role === "usuario")) {
    // El usuario es administrador o usuario, continúa con el flujo de ejecución
    next();
  } else {
    // El usuario no es administrador ni usuario, envía una respuesta de error
    res
      .status(403)
      .json({ message: "No tienes permiso para acceder a este recurso" });
  }
}

module.exports = authorizationMiddleware;
