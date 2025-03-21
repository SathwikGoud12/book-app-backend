const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// ✅ Enhanced CORS Configuration
const allowedOrigins = [
  "https://book-app-frontend-blush.vercel.app", // Production frontend
  "http://localhost:3000", // Local development (optional, for testing)
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Explicitly allow these methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow these headers
    credentials: true, // Support cookies/auth if needed
  })
);

// ✅ Middleware for JSON Parsing
app.use(express.json());

// ✅ Validate Environment Variables
const requiredEnvVars = ["DB_URL"];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`❌ ERROR: Missing ${varName} in .env file`);
    process.exit(1);
  }
});

// ✅ MongoDB Connection with Error Handling
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// ✅ Book Schema with Validation
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    publishedYear: {
      type: Number,
      min: [1000, "Published year must be a valid year"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

const Book = mongoose.model("Book", bookSchema);

// ✅ API Routes with Better Error Handling

// Fetch all books
app.get("/api/books", async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 }); // Sort by newest first
    res.status(200).json(books);
  } catch (error) {
    console.error("❌ Error fetching books:", error.message);
    res.status(500).json({ error: "Failed to fetch books", details: error.message });
  }
});

// Add a new book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author, genre, publishedYear } = req.body;

    // Basic validation
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required" });
    }

    const newBook = new Book({ title, author, genre, publishedYear });
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    console.error("❌ Error adding book:", error.message);
    res.status(500).json({ error: "Failed to add book", details: error.message });
  }
});

// ✅ Additional Routes for CRUD Operations

// Update a book by ID
app.put("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, publishedYear } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, genre, publishedYear },
      { new: true, runValidators: true } // Return updated document and run schema validators
    );

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("❌ Error updating book:", error.message);
    res.status(500).json({ error: "Failed to update book", details: error.message });
  }
});

// Delete a book by ID
app.delete("/api/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting book:", error.message);
    res.status(500).json({ error: "Failed to delete book", details: error.message });
  }
});

// ✅ Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Book Store Backend is Running..." });
});

// ✅ Handle 404 for Unknown Routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

// ✅ Graceful Shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Closing server...");
  mongoose.connection.close(() => {
    console.log("✅ MongoDB connection closed.");
    process.exit(0);
  });
});