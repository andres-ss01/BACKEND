// =============================================================================
// src/controllers/UserController.js - Controlador (C de MVC) de Usuarios
// =============================================================================

import asyncHandler from "../utils/asyncHandler.js";

export default class UserController {
  constructor(userService) {
    this.userService = userService; // Inyección de dependencias
  }

  // GET /api/users?limit=3&sort=asc
  getAll = asyncHandler(async (req, res) => {
    res.status(200).json(await this.userService.getAll(req.query));
  });

  // GET /api/users/:id
  getById = asyncHandler(async (req, res) => {
    res.status(200).json(await this.userService.getById(req.params.id));
  });

  // POST /api/users
  create = asyncHandler(async (req, res) => {
    res.status(201).json(await this.userService.create(req.body));
  });

  // PUT/PATCH /api/users/:id
  update = asyncHandler(async (req, res) => {
    res.status(200).json(await this.userService.update(req.params.id, req.body));
  });

  // DELETE /api/users/:id
  delete = asyncHandler(async (req, res) => {
    const user = await this.userService.delete(req.params.id);
    res.status(200).json({ message: "Usuario eliminado correctamente", user });
  });
}
