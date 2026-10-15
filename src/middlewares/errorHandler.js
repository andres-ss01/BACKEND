// =============================================================================
// src/middlewares/errorHandler.js - Manejo centralizado de errores
// =============================================================================

import AppError from "../utils/AppError.js";

// Rutas inexistentes -> 404
export const notFound = (req, res, next) => {
  next(new AppError(`Ruta no encontrada: ${req.method} ${req.originalUrl}`, 404));
};

// Middleware global (4 parámetros = manejador de errores en Express)
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Error interno del servidor";

  // Valor duplicado en un campo UNIQUE (email o username) -> 409
  if (err.code === "ER_DUP_ENTRY") {
    statusCode = 409;
    message = "Ya existe un registro con ese email o username";
  }

  // JSON mal formado enviado por el cliente -> 400
  if (err.type === "entity.parse.failed") {
    statusCode = 400;
    message = "El cuerpo de la petición no es un JSON válido";
  }

  // Los errores 500 (inesperados) se registran en consola y se oculta el detalle al cliente
  if (statusCode === 500) {
    console.error("💥", err);
    message = "Error interno del servidor";
  }

  res.status(statusCode).json({ status: "error", message });
};
