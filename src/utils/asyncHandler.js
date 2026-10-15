// =============================================================================
// src/utils/asyncHandler.js - Captura errores de controladores async y los
// envía al middleware global de errores (evita try/catch repetidos).
// =============================================================================

const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
