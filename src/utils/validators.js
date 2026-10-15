// =============================================================================
// src/utils/validators.js - Funciones de validación y utilidades
// -----------------------------------------------------------------------------
// MySQL no valida estructuras anidadas como Mongoose, así que validamos aquí.
// =============================================================================

import AppError from "./AppError.js";

// Convierte el ID de la URL en entero positivo; si no lo es -> 400
export function parseId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(`ID inválido: ${value}`, 400);
  }
  return id;
}

// Lee una propiedad anidada usando una ruta tipo "address.geolocation.lat"
function getPath(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

// Verifica que existan (y no estén vacíos) todos los campos requeridos
export function requireFields(data, paths) {
  const missing = paths.filter((p) => {
    const value = getPath(data, p);
    return value === undefined || value === null || value === "";
  });
  if (missing.length) {
    throw new AppError(`Campos obligatorios faltantes: ${missing.join(", ")}`, 400);
  }
}

// Verifica que un valor sea un número dentro de un rango opcional
export function requireNumber(value, name, { min, max } = {}) {
  const n = Number(value);
  if (value === "" || value === null || Number.isNaN(n)) {
    throw new AppError(`El campo ${name} debe ser un número`, 400);
  }
  if (min !== undefined && n < min) throw new AppError(`El campo ${name} debe ser >= ${min}`, 400);
  if (max !== undefined && n > max) throw new AppError(`El campo ${name} debe ser <= ${max}`, 400);
  return n;
}

// Mezcla recursivamente "changes" sobre "base" (permite PATCH con objetos anidados)
export function deepMerge(base, changes) {
  const result = { ...base };
  for (const [key, value] of Object.entries(changes || {})) {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      result[key] = deepMerge(base?.[key] || {}, value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
