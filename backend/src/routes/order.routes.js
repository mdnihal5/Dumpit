const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// All order routes require authentication
router.use(protect);

// Customer routes
router.post("/", orderController.createOrder);
router.get("/my-orders", orderController.getMyOrders);
router.get("/:id", orderController.getOrderById);
router.put("/:id/cancel", orderController.cancelOrder);

// Vendor routes
router.get("/vendor", authorize(["vendor"]), orderController.getVendorOrders);
router.put(
  "/:id/status",
  authorize(["vendor", "admin"]),
  orderController.updateOrderStatus
);

// Admin routes
router.get("/", authorize(["admin"]), orderController.getAllOrders);
router.delete("/:id", authorize(["admin"]), orderController.deleteOrder);

module.exports = router;
