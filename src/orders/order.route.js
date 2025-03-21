const express = require("express");
const { getOrderByEmail, createOrder } = require("./order.controller");

const router = express.Router();

// ✅ Correct route to handle query parameters
router.get("/", getOrderByEmail);  // Handles GET /api/orders?email=xxx
router.post("/", createOrder);

module.exports = router;
