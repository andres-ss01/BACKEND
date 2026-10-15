// =============================================================================
// src/config/Database.js - Conexión a MySQL mediante una clase
// -----------------------------------------------------------------------------
// Usa un "pool" de conexiones (mysql2/promise): reutiliza conexiones abiertas
// en lugar de abrir una nueva por cada petición.
// Se exporta una instancia única (singleton) para compartirla en todo el proyecto.
//
// Compatible con servidores tradicionales (Render, Railway, local) y con
// funciones serverless (Vercel): la conexión se crea de forma "perezosa", es
// decir, la primera vez que se necesita, y se reutiliza mientras la función viva.
// =============================================================================

import fs from "node:fs";
import mysql from "mysql2/promise";

export default class Database {
  constructor() {
    this.pool = null; // Se crea en connect(), cuando ya se cargó el .env
  }

  // Obtiene el certificado CA del proveedor (Aiven) desde donde esté disponible
  getCaCertificate() {
    const { DB_SSL_CA_CONTENT, DB_SSL_CA } = process.env;

    // Opción 1 (para Vercel/Render/Railway): el contenido del certificado en una variable de entorno.
    // Se convierten los "\n" escritos como texto en saltos de línea reales.
    if (DB_SSL_CA_CONTENT) return DB_SSL_CA_CONTENT.replace(/\\n/g, "\n");

    // Opción 2 (para local): ruta a un archivo ca.pem
    if (DB_SSL_CA) return fs.readFileSync(DB_SSL_CA);

    return null;
  }

  // Arma las opciones de conexión a partir de las variables de entorno
  getConfig() {
    const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, DB_SSL } = process.env;

    // Validación temprana para dar un mensaje claro si falta configuración
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      throw new Error("Faltan variables de entorno (DB_HOST, DB_USER, DB_NAME). Revisa tu .env o las variables del hosting");
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
      const ca = this.getCaCertificate();
      config.ssl = ca
        ? { ca, rejectUnauthorized: true }                       // Con certificado del proveedor
        : { minVersion: "TLSv1.2", rejectUnauthorized: true };   // Con CA públicas
    }

    return config;
  }

  // Crea el pool y verifica que la base responda. Es idempotente: si ya existe, no hace nada.
  async connect() {
    if (this.pool) return;

    try {
      const pool = mysql.createPool({
        ...this.getConfig(),
        waitForConnections: true,
        // En serverless cada instancia tiene su propio pool, así que se usa un límite bajo
        connectionLimit: Number(process.env.DB_POOL_LIMIT) || 5,
        decimalNumbers: true, // DECIMAL llega como número (no como texto)
      });

      // Prueba real de conexión
      const conn = await pool.getConnection();
      conn.release();

      this.pool = pool; // Solo se guarda si la prueba fue exitosa
      console.log(`✅ Conectado a MySQL (base de datos: ${process.env.DB_NAME})`);
    } catch (error) {
      throw new Error(`Error al conectar con MySQL: ${error.message}`);
    }
  }

  // Ejecuta una consulta con parámetros (?). Si aún no hay conexión, la abre (arranque en frío).
  async query(sql, params = []) {
    if (!this.pool) await this.connect();
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
    this.pool = null;
    console.log("🔌 Conexión a MySQL cerrada");
  }
}

// Instancia única compartida por modelos, servidor y seeder
export const database = new Database();
