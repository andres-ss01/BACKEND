// =============================================================================
// src/seed/seed.js - Crea las tablas y las puebla con datos iniciales
// -----------------------------------------------------------------------------
// Ejecutar con:  npm run seed
// 1) Ejecuta database/schema.sql (borra y recrea las tablas).
// 2) Inserta los 6 usuarios y los 10 productos de data.js.
// Se puede ejecutar varias veces sin generar duplicados.
// =============================================================================

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { database } from "../config/Database.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { users, products } from "./data.js";

// Ruta absoluta a schema.sql (funciona sin importar desde dónde se ejecute)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, "../../database/schema.sql");

async function runSeed() {
  try {
    await database.connect();

    // 1) Crea la estructura de tablas
    await database.runScript(fs.readFileSync(schemaPath, "utf8"));
    console.log("🧱 Tablas creadas (users, products)");

    // 2) Inserta datos usando los mismos modelos que usa la API
    const userModel = new User();
    const productModel = new Product();

    for (const user of users) await userModel.create(user);
    for (const product of products) await productModel.create(product);

    console.log(`👤 ${users.length} usuarios insertados`);
    console.log(`🛍️  ${products.length} productos insertados`);
    console.log("✅ Seed completado con éxito");
  } catch (error) {
    console.error("❌ Error ejecutando el seed:", error.message);
    process.exitCode = 1;
  } finally {
    await database.disconnect(); // Cierra para que el proceso termine
  }
}

runSeed();
