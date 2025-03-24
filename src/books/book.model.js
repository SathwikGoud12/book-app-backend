const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    coverImage: { type: String, required: true },  // ✅ Store only filename, e.g., "book-cover.jpg"
    newPrice: { type: Number, required: true },
    oldPrice: { type: Number }
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
