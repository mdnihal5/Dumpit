const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// Public routes
router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategoryById);
router.get("/:id/products", categoryController.getProductsByCategory);

// Protected routes (require authentication)
router.use(protect);

// Admin only routes
router.post("/", authorize(["admin"]), categoryController.createCategory);
router.put("/:id", authorize(["admin"]), categoryController.updateCategory);
router.delete("/:id", authorize(["admin"]), categoryController.deleteCategory);

module.exports = router; 