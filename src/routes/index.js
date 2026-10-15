// =============================================================================
// src/routes/index.js - Agrupa todas las rutas bajo el prefijo /api
// =============================================================================

import { Router } from "express";
import productRoutes from "./productRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/products", productRoutes); // -> /api/products
router.use("/users", userRoutes);       // -> /api/users

export default router;
