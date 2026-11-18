import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes
router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllOrders);

router.patch(
  "/admin/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

export default router;