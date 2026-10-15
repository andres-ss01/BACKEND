// =============================================================================
// src/routes/userRoutes.js - Endpoints de /api/users
// =============================================================================

import { Router } from "express";
import UserService from "../services/UserService.js";
import UserController from "../controllers/UserController.js";

const router = Router();
const controller = new UserController(new UserService());

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id", controller.update);
router.delete("/:id", controller.delete);

export default router;
