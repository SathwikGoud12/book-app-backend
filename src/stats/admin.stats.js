const express = require("express");
const Order = require("../orders/order.model");
const Book = require("../books/book.model");
const router = express.Router();

// ✅ Admin Stats API
router.get("/", async (req, res) => {
  try {
    // ✅ Check if Orders and Books exist
    const totalOrders = await Order.countDocuments() || 0;
    
    // ✅ Total Sales Calculation
    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;

    // ✅ Trending Books Count
    const trendingBooksData = await Book.aggregate([
      { $match: { trending: true } },
      { $count: "trendingBooksCount" },
    ]);
    const trendingBooks = trendingBooksData.length > 0 ? trendingBooksData[0].trendingBooksCount : 0;

    // ✅ Total Number of Books
    const totalBooks = await Book.countDocuments() || 0;

    // ✅ Monthly Sales (Check if `createdAt` exists)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // ✅ Send response
    res.status(200).json({
      totalOrders,
      totalSales,
      trendingBooks,
      totalBooks,
      monthlySales,
    });

  } catch (error) {
    console.error("❌ Error fetching admin stats:", error);
    res.status(500).json({ message: "Failed to fetch admin stats" });
  }
});

// ✅ Export Router
module.exports = router;
