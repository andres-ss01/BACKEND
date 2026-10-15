// =============================================================================
// src/config/Database.js - Conexión a MySQL mediante una clase
// -----------------------------------------------------------------------------
// Usa un "pool" de conexiones (mysql2/promise): reutiliza conexiones abiertas
// en lugar de abrir una nueva por cada petición, lo que es más rápido y estable.
// Se exporta una instancia única (singleton) para compartirla en todo el proyecto.
// =============================================================================

import fs from "node:fs";
import mysql from "mysql2/promise";

export default class Database {
  constructor() {
    this.pool = null; // Se crea en connect(), cuando ya se cargó el .env
  }

  // Arma las opciones de conexión a partir de las variables de entorno
  getConfig() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL, DB_SSL_CA } = process.env;

    // Validación temprana para dar un mensaje claro si falta el .env
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      throw new Error("Faltan variables de entorno (DB_HOST, DB_USER, DB_NAME). Revisa tu archivo .env");
    }

    const config = {
      host: DB_HOST,
      port: Number(DB_PORT) || 3306,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      charset: "utf8mb4",
    };

    // SSL/TLS: la mayoría de bases de datos en la nube exigen conexión cifrada
    if (DB_SSL === "true") {
      config.ssl = DB_SSL_CA
        ? { ca: fs.readFileSync(DB_SSL_CA), rejectUnauthorized: true } // Con certificado del proveedor
        : { minVersion: "TLSv1.2", rejectUnauthorized: true };         // Con CA públicas
    }

    return config;
  }

  // Crea el pool y verifica que la base responda
  async connect() {
    try {
      this.pool = mysql.createPool({
        ...this.getConfig(),
        waitForConnections: true, // Si todas las conexiones están ocupadas, espera
        connectionLimit: 10,      // Máximo de conexiones simultáneas
        decimalNumbers: true,     // DECIMAL llega como número (no como texto)
      });

      // Prueba real de conexión
      const conn = await this.pool.getConnection();
      conn.release();
      console.log(`✅ Conectado a MySQL (base de datos: ${process.env.DB_NAME})`);
    } catch (error) {
      throw new Error(`Error al conectar con MySQL: ${error.message}`);
    }
  }

  // Ejecuta una consulta con parámetros (?) y devuelve las filas/resultado
  async query(sql, params = []) {
    const [result] = await this.pool.query(sql, params);
    return result;
  }

  // Ejecuta un script SQL con varias sentencias (solo lo usa el seeder).
  // Se abre una conexión aparte con multipleStatements para no habilitarlo en la API.
  async runScript(sql) {
    const conn = await mysql.createConnection({ ...this.getConfig(), multipleStatements: true });
    try {
      await conn.query(sql);
    } finally {
      await conn.end();
    }
  }

  // Cierra el pool
  async disconnect() {
    if (this.pool) await this.pool.end();
    console.log("🔌 Conexión a MySQL cerrada");
  }
}

// Instancia única compartida por modelos, servidor y seeder
export const database = new Database();
