// =============================================================================
// src/utils/AppError.js - Error personalizado con código HTTP
// Uso: throw new AppError("No encontrado", 404)
// =============================================================================

export default class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
