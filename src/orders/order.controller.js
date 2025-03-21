const mongoose = require("mongoose");
const Order = require("./order.model");

// ✅ Function to create an order
const createOrder = async (req, res) => {
  try {
    const { productIds, ...otherData } = req.body;

    // Validate productIds
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Invalid or missing productIds" });
    }

    // Ensure all IDs are valid ObjectIds
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
    if (!productIds.every(isValidObjectId)) {
      return res.status(400).json({ message: "Invalid product ID(s) provided" });
    }

    // Convert product IDs to ObjectIds
    const formattedProductIds = productIds.map((id) => new mongoose.Types.ObjectId(id));

    // Create new order
    const newOrder = new Order({ ...otherData, productIds: formattedProductIds });
    const savedOrder = await newOrder.save();

    console.log("✅ Order Created Successfully:", savedOrder);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error);
    res.status(500).json({ message: "Failed to create order", error: error.message });
  }
};

// ✅ Function to get orders by email
const getOrderByEmail = async (req, res) => {
  try {
    const { email } = req.query; // ✅ Use query parameter instead of params

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    console.log(`🔍 Fetching orders for email: ${email}`);

    // Fetch orders by email (case-insensitive)
    const orders = await Order.find({ email: email.toLowerCase() }).populate("productIds");

    if (orders.length === 0) {
      console.log("⚠️ No orders found for:", email);
      return res.status(404).json({ message: "No orders found for this email" });
    }

    console.log("✅ Orders Found:", orders.length);
    res.status(200).json(orders);
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
};

// ✅ Exporting functions
module.exports = {
  createOrder,
  getOrderByEmail,
};