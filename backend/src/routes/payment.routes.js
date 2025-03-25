const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { protect, authorize } = require("../middlewares/auth.middleware");

// All payment routes require authentication
router.use(protect);

// Customer routes
router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/confirm-payment", paymentController.confirmPayment);
router.get("/my-payments", paymentController.getMyPayments);

// Admin routes
router.get("/", authorize(["admin"]), paymentController.getAllPayments);
router.get("/:id", authorize(["admin"]), paymentController.getPaymentById);
router.put(
  "/:id/refund",
  authorize(["admin"]),
  paymentController.refundPayment
);

module.exports = router;
