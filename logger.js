const winston = require("winston");
const { format } = require("winston");
const { combine, timestamp, printf } = format;

// Definición de los niveles de registro
const levels = {
  debug: 0,
  http: 1,
  info: 2,
  warning: 3,
  error: 4,
  fatal: 5,
};

// Colores para los diferentes niveles de registro
const colors = {
  debug: "blue",
  http: "green",
  info: "cyan",
  warning: "yellow",
  error: "red",
  fatal: "magenta",
};

// Configuración de los transportes de registro
const transports = [
  new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
      format.colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      printf(
        ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
      )
    ),
  }),
  new winston.transports.File({
    filename: "errors.log",
    level: "error",
    format: combine(
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      printf(
        ({ level, message, timestamp }) => `[${timestamp}] ${level}: ${message}`
      )
    ),
  }),
];

// Crear el logger
const logger = winston.createLogger({
  levels,
  format: combine(timestamp(), format.json()),
  transports,
});

module.exports = logger;
