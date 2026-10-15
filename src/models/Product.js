// =============================================================================
// src/models/Product.js - Modelo (M de MVC) de Producto
// -----------------------------------------------------------------------------
// Clase que ejecuta las consultas SQL de la tabla "products" y convierte entre
// filas planas de MySQL y el JSON anidado de FakeStoreAPI (con "rating").
// =============================================================================

import { database } from "../config/Database.js";

export default class Product {
  // Fila de MySQL -> objeto JSON anidado
  static fromRow(row) {
    return {
      id: row.id,
      title: row.title,
      price: Number(row.price),
      description: row.description,
      category: row.category,
      image: row.image,
      rating: { rate: Number(row.rating_rate), count: row.rating_count },
    };
  }

  // Objeto JSON anidado -> arreglo de valores en el orden de las columnas
  static toValues(p) {
    return [p.title, p.price, p.description, p.category, p.image, p.rating.rate, p.rating.count];
  }

  // Lista productos (limit y sort ya vienen validados desde el servicio)
  async findAll({ limit, sort }) {
    let sql = `SELECT * FROM products ORDER BY id ${sort === "desc" ? "DESC" : "ASC"}`;
    const params = [];
    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }
    const rows = await database.query(sql, params);
    return rows.map(Product.fromRow);
  }

  // Busca un producto por ID (devuelve null si no existe)
  async findById(id) {
    const rows = await database.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows.length ? Product.fromRow(rows[0]) : null;
  }

  // Categorías distintas
  async findCategories() {
    const rows = await database.query("SELECT DISTINCT category FROM products ORDER BY category");
    return rows.map((r) => r.category);
  }

  // Productos de una categoría
  async findByCategory(category) {
    const rows = await database.query("SELECT * FROM products WHERE category = ? ORDER BY id", [category]);
    return rows.map(Product.fromRow);
  }

  // Inserta y devuelve el producto creado (con su ID autoincremental)
  async create(product) {
    const result = await database.query(
      `INSERT INTO products (title, price, description, category, image, rating_rate, rating_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      Product.toValues(product)
    );
    return this.findById(result.insertId);
  }

  // Reemplaza todos los campos del producto con los valores recibidos
  async update(id, product) {
    await database.query(
      `UPDATE products
          SET title = ?, price = ?, description = ?, category = ?, image = ?,
              rating_rate = ?, rating_count = ?
        WHERE id = ?`,
      [...Product.toValues(product), id]
    );
    return this.findById(id);
  }

  // Elimina por ID; devuelve true si había algo que borrar
  async delete(id) {
    const result = await database.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}
