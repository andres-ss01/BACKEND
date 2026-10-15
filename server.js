// =============================================================================
// server.js - Punto de entrada principal de la aplicación
// -----------------------------------------------------------------------------
// La clase "Server" encapsula Express: middlewares, rutas, manejo de errores
// y arranque.
//
// Funciona en dos modos:
//  - Servidor tradicional (local, Render, Railway): abre un puerto con listen().
//  - Vercel (serverless): NO abre puerto; Vercel usa la app exportada al final
//    del archivo (export default). La base de datos se conecta bajo demanda.
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
    // Ruta raíz: sirve como "health check"
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

  // Arranque tradicional: primero MySQL, luego el puerto
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

const server = new Server();

// Vercel define la variable VERCEL=1. En ese caso no se abre un puerto:
// la plataforma ejecuta la app exportada abajo, y MySQL se conecta en la primera consulta.
if (!process.env.VERCEL) {
  server.start();
}

// Exportación por defecto que Vercel necesita para detectar la app Express
export default server.app;
