const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Check if ENV variables are loaded
if (!process.env.DB_URL) {
  console.error("❌ ERROR: Missing DB_URL in .env file");
  process.exit(1);
}

// ✅ Middleware for JSON parsing
app.use(express.json());

// ✅ CORS Configuration (Fixing Issues)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://book-app-frontend-blush.vercel.app",
  "https://*.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.some(o => origin.startsWith(o))) {
        callback(null, true);
      } else {
        console.warn(`🚨 CORS Blocked: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Serve static files (for uploaded images/files)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Import Routes (Ensure paths are correct)
const bookRoutes = require("./src/books/book.route");
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats"); // Ensure correct path

// ✅ Use Routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Debugging: Print Registered Routes
console.log("✅ Registered Routes:");
app._router.stack.forEach((middleware) => {
  if (middleware.route) {
    console.log(`➡️ ${middleware.route.stack[0].method.toUpperCase()} ${middleware.route.path}`);
  }
});

// ✅ Root Route
app.get("/", (req, res) => {
  res.send("📚 Books server is Running");
});

// ✅ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ MongoDB Connection (Improved Logging)
const dbUrl = process.env.DB_URL;
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ MongoDB connected successfully!");
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database Connection Failed!");
    console.error(`📌 Reason: ${error.message}`);
    process.exit(1);
  });
