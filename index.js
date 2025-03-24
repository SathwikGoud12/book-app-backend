require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(express.json()); // Parses JSON request bodies
app.use(cors({
    origin: ['http://localhost:5173', 'https://book-app-frontend-tau.vercel.app'],
    credentials: true
}));

// ✅ Serve static images from "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
const bookRoutes = require('./src/books/book.route');
const orderRoutes = require("./src/orders/order.route");
const userRoutes = require("./src/users/user.route");
const adminRoutes = require("./src/stats/admin.stats");

// ✅ Use API Routes
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);

// ✅ Default route
app.get("/", (req, res) => {
    res.send("📚 Book Store Server is running!");
});

// ✅ MongoDB Connection Function
async function connectDB() {
    try {
        const dbUrl = process.env.DB_URL;
        if (!dbUrl) {
            throw new Error("❌ Missing MongoDB connection string in .env file!");
        }

        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("✅ MongoDB connected successfully!");
    } catch (err) {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1); // Exit process with failure
    }
}

// ✅ Handle MongoDB Connection Events
mongoose.connection.on("connected", () => console.log("✅ MongoDB connected!"));
mongoose.connection.on("disconnected", () => console.log("⚠️ MongoDB disconnected!"));
mongoose.connection.on("error", (err) => console.error("❌ MongoDB error:", err.message));

// ✅ Start Server after MongoDB Connection
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`🚀 Server running at http://localhost:${port}`);
    });
});
