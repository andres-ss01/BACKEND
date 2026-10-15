// =============================================================================
// src/controllers/ProductController.js - Controlador (C de MVC) de Productos
// -----------------------------------------------------------------------------
// Recibe la petición HTTP, llama al servicio y responde. Los métodos son
// arrow functions para conservar `this` al pasarlos como callbacks a Express.
// =============================================================================

import asyncHandler from "../utils/asyncHandler.js";

export default class ProductController {
  constructor(productService) {
    this.productService = productService; // Inyección de dependencias
  }

  // GET /api/products?limit=5&sort=desc
  getAll = asyncHandler(async (req, res) => {
    res.status(200).json(await this.productService.getAll(req.query));
  });

  // GET /api/products/:id
  getById = asyncHandler(async (req, res) => {
    res.status(200).json(await this.productService.getById(req.params.id));
  });

  // GET /api/products/categories
  getCategories = asyncHandler(async (req, res) => {
    res.status(200).json(await this.productService.getCategories());
  });

  // GET /api/products/category/:category
  getByCategory = asyncHandler(async (req, res) => {
    res.status(200).json(await this.productService.getByCategory(req.params.category));
  });

  // POST /api/products
  create = asyncHandler(async (req, res) => {
    res.status(201).json(await this.productService.create(req.body));
  });

  // PUT/PATCH /api/products/:id
  update = asyncHandler(async (req, res) => {
    res.status(200).json(await this.productService.update(req.params.id, req.body));
  });

  // DELETE /api/products/:id
  delete = asyncHandler(async (req, res) => {
    const product = await this.productService.delete(req.params.id);
    res.status(200).json({ message: "Producto eliminado correctamente", product });
  });
}
