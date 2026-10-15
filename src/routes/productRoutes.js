// =============================================================================
// src/routes/productRoutes.js - Endpoints de /api/products
// =============================================================================

import { Router } from "express";
import ProductService from "../services/ProductService.js";
import ProductController from "../controllers/ProductController.js";

const router = Router();
const controller = new ProductController(new ProductService());

// Las rutas fijas van ANTES de /:id; si no, "categories" se interpretaría como un ID
router.get("/categories", controller.getCategories);
router.get("/category/:category", controller.getByCategory);

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
