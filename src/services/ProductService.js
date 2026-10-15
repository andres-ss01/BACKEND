// =============================================================================
// src/services/ProductService.js - Lógica de negocio de Productos
// -----------------------------------------------------------------------------
// Valida datos, normaliza y decide qué error lanzar. El modelo solo hace SQL.
// =============================================================================

import Product from "../models/Product.js";
import AppError from "../utils/AppError.js";
import { parseId, requireFields, requireNumber, deepMerge } from "../utils/validators.js";

export default class ProductService {
  constructor() {
    this.model = new Product();
  }

  // Valida y normaliza un producto completo (para crear o para guardar un update)
  validate(data) {
    requireFields(data, ["title", "price", "description", "category", "image"]);
    return {
      title: String(data.title).trim(),
      price: requireNumber(data.price, "price", { min: 0 }),
      description: String(data.description),
      category: String(data.category).trim().toLowerCase(),
      image: String(data.image),
      rating: {
        rate: requireNumber(data.rating?.rate ?? 0, "rating.rate", { min: 0, max: 5 }),
        count: requireNumber(data.rating?.count ?? 0, "rating.count", { min: 0 }),
      },
    };
  }

  // Interpreta ?limit y ?sort de la URL
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
    const product = await this.model.findById(parseId(id));
    if (!product) throw new AppError("Producto no encontrado", 404);
    return product;
  }

  async getCategories() {
    return this.model.findCategories();
  }

  async getByCategory(category) {
    return this.model.findByCategory(category.toLowerCase());
  }

  async create(data) {
    return this.model.create(this.validate(data));
  }

  // PUT y PATCH: se combinan los datos nuevos con los existentes y se valida el resultado
  async update(id, data) {
    const existing = await this.getById(id);
    const merged = deepMerge(existing, data);
    return this.model.update(existing.id, this.validate(merged));
  }

  async delete(id) {
    const product = await this.getById(id); // Lanza 404 si no existe
    await this.model.delete(product.id);
    return product;
  }
}
