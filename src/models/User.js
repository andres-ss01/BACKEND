// =============================================================================
// src/models/User.js - Modelo (M de MVC) de Usuario
// -----------------------------------------------------------------------------
// Convierte entre las columnas planas de MySQL y la estructura anidada:
// name{firstname,lastname} y address{geolocation{lat,long}, city, ...}.
// =============================================================================

import { database } from "../config/Database.js";

export default class User {
  // Fila de MySQL -> objeto JSON anidado (idéntico al formato pedido)
  static fromRow(row) {
    return {
      id: row.id,
      email: row.email,
      username: row.username,
      password: row.password,
      name: { firstname: row.firstname, lastname: row.lastname },
      phone: row.phone,
      address: {
        geolocation: { lat: row.geo_lat, long: row.geo_long },
        city: row.city,
        street: row.street,
        number: row.number,
        zipcode: row.zipcode,
      },
    };
  }

  // Objeto JSON anidado -> valores en el orden de las columnas
  static toValues(u) {
    return [
      u.email, u.username, u.password,
      u.name.firstname, u.name.lastname, u.phone,
      String(u.address.geolocation.lat), String(u.address.geolocation.long),
      u.address.city, u.address.street, u.address.number, u.address.zipcode,
    ];
  }

  async findAll({ limit, sort }) {
    let sql = `SELECT * FROM users ORDER BY id ${sort === "desc" ? "DESC" : "ASC"}`;
    const params = [];
    if (limit) {
      sql += " LIMIT ?";
      params.push(limit);
    }
    const rows = await database.query(sql, params);
    return rows.map(User.fromRow);
  }

  async findById(id) {
    const rows = await database.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows.length ? User.fromRow(rows[0]) : null;
  }

  async create(user) {
    const result = await database.query(
      `INSERT INTO users (email, username, password, firstname, lastname, phone,
                          geo_lat, geo_long, city, street, number, zipcode)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      User.toValues(user)
    );
    return this.findById(result.insertId);
  }

  async update(id, user) {
    await database.query(
      `UPDATE users
          SET email = ?, username = ?, password = ?, firstname = ?, lastname = ?, phone = ?,
              geo_lat = ?, geo_long = ?, city = ?, street = ?, number = ?, zipcode = ?
        WHERE id = ?`,
      [...User.toValues(user), id]
    );
    return this.findById(id);
  }

  async delete(id) {
    const result = await database.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}
