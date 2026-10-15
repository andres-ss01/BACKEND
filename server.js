// =============================================================================
// server.js - Punto de entrada principal de la aplicación
// -----------------------------------------------------------------------------
// La clase "Server" encapsula Express: middlewares, rutas, manejo de errores
// y arranque (conexión a MySQL + escucha del puerto).
// =============================================================================

import "dotenv/config"; // Carga las variables del archivo .env en process.env
import express from "express";
import cors from "cors";

import { database } from "./src/config/Database.js";
import apiRoutes from "./src/routes/index.js";
import { notFound, errorHandler } from "./src/middlewares/errorHandler.js";

class Server {
  constructor() {
    this.app = express();                  // Aplicación Express
    this.port = process.env.PORT || 3000;  // Puerto del hosting o 3000 por defecto
    this.database = database;              // Instancia única de la conexión a MySQL

    this.initMiddlewares();
    this.initRoutes();
    this.initErrorHandling();
  }

  // Middlewares globales
  initMiddlewares() {
    this.app.use(cors());                                  // Permite peticiones externas
    this.app.use(express.json());                          // Parsea cuerpos JSON
    this.app.use(express.urlencoded({ extended: true }));  // Parsea formularios simples
  }

  // Registro de rutas
  initRoutes() {
    // Ruta raíz: sirve como "health check" para Render/Railway
    this.app.get("/", (req, res) => {
      res.json({
        message: "API E-commerce (MySQL) funcionando correctamente",
        endpoints: { products: "/api/products", users: "/api/users" },
      });
    });
    this.app.use("/api", apiRoutes);
  }

  // Manejo de errores: se registra DESPUÉS de las rutas
  initErrorHandling() {
    this.app.use(notFound);
    this.app.use(errorHandler);
  }

  // Arranque: primero MySQL, luego el puerto
  async start() {
    try {
      await this.database.connect();
      this.app.listen(this.port, () => {
        console.log(`🚀 Servidor escuchando en el puerto ${this.port}`);
      });
    } catch (error) {
      console.error("❌ No se pudo iniciar el servidor:", error.message);
      process.exit(1);
    }
  }
}

new Server().start();
