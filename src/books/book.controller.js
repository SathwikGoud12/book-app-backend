const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        const { title, description, category, trending, oldPrice, newPrice } = req.body;

        if (!title || !description || !category || !oldPrice || !newPrice) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const newBook = new Book({
            title,
            description,
            category,
            trending: trending === "true",
            oldPrice: parseFloat(oldPrice),
            newPrice: parseFloat(newPrice),
            coverImage: req.file ? `/uploads/${req.file.filename}` : null,
        });

        await newBook.save();
        res.status(201).send({ message: "Book posted successfully", book: newBook });
    } catch (error) {
        console.error("Error creating book", error);
        res.status(500).send({ message: "Failed to create book" });
    }
};

// ✅ Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books", error);
        res.status(500).send({ message: "Failed to fetch books" });
    }
};

// ✅ Get single book
const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not Found!" });
        }
        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching book", error);
        res.status(500).send({ message: "Failed to fetch book" });
    }
};

// ✅ Update book data
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBookData = { ...req.body };

        if (req.file) {
            updatedBookData.coverImage = `/uploads/${req.file.filename}`;
        }

        const updatedBook = await Book.findByIdAndUpdate(id, updatedBookData, { new: true });

        if (!updatedBook) {
            return res.status(404).send({ message: "Book not Found!" });
        }

        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error updating a book", error);
        res.status(500).send({ message: "Failed to update a book" });
    }
};

// ✅ Delete a book
const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: "Book not Found!" });
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook,
        });
    } catch (error) {
        console.error("Error deleting a book", error);
        res.status(500).send({ message: "Failed to delete a book" });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteABook,
};
