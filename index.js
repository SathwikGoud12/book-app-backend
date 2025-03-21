const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// ✅ Allow requests from frontend (Fixing CORS error)
const allowedOrigins = ["https://book-app-frontend-blush.vercel.app"];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Important if using authentication
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers
  })
);

app.use(express.json()); // Middleware to parse JSON requests

// ✅ Ensure Environment Variables Are Loaded
if (!process.env.DB_URL) {
  console.error("❌ ERROR: Missing DB_URL in .env file");
  process.exit(1);
}

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Define Book Schema & Model
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publishedYear: Number,
});

const Book = mongoose.model("Book", bookSchema);

// ✅ API Route to Fetch Books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books
    res.json(books);
  } catch (error) {
    console.error("❌ Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// ✅ API Route to Add a Book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;
    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("❌ Error adding book:", error);
    res.status(500).json({ error: "Failed to add book" });
  }
});

// ✅ Test Route (Ensure this is AFTER API routes)
app.get("/", (req, res) => {
  res.send("📚 Book Store Backend is Running...");
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
