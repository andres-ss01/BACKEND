// =============================================================================
// src/services/UserService.js - Lógica de negocio de Usuarios
// =============================================================================

import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { parseId, requireFields, requireNumber, deepMerge } from "../utils/validators.js";

export default class UserService {
  constructor() {
    this.model = new User();
  }

  // Valida y normaliza un usuario completo (incluye los objetos anidados)
  validate(data) {
    requireFields(data, [
      "email", "username", "password", "phone",
      "name.firstname", "name.lastname",
      "address.geolocation.lat", "address.geolocation.long",
      "address.city", "address.street", "address.number", "address.zipcode",
    ]);

    return {
      email: String(data.email).trim().toLowerCase(),
      username: String(data.username).trim(),
      password: String(data.password),
      name: {
        firstname: String(data.name.firstname).trim(),
        lastname: String(data.name.lastname).trim(),
      },
      phone: String(data.phone),
      address: {
        geolocation: {
          lat: String(data.address.geolocation.lat),
          long: String(data.address.geolocation.long),
        },
        city: String(data.address.city),
        street: String(data.address.street),
        number: requireNumber(data.address.number, "address.number"),
        zipcode: String(data.address.zipcode),
      },
    };
  }

  parseListOptions({ limit, sort } = {}) {
    const options = {};
    if (limit !== undefined) {
      const n = Number(limit);
      if (!Number.isInteger(n) || n <= 0) throw new AppError("limit debe ser un entero positivo", 400);
      options.limit = n;
    }
    options.sort = sort === "desc" ? "desc" : "asc";
    return options;
  }

  async getAll(query) {
    return this.model.findAll(this.parseListOptions(query));
  }

  async getById(id) {
    const user = await this.model.findById(parseId(id));
    if (!user) throw new AppError("Usuario no encontrado", 404);
    return user;
  }

  async create(data) {
    return this.model.create(this.validate(data));
  }

  async update(id, data) {
    const existing = await this.getById(id);
    const merged = deepMerge(existing, data);
    return this.model.update(existing.id, this.validate(merged));
  }

  async delete(id) {
    const user = await this.getById(id);
    await this.model.delete(user.id);
    return user;
  }
}
