const Book = require("./book.model");

const postABook = async (req, res) => {
    try {
        console.log('Request body:', req.body); // Debug: Log the request body
        console.log('Uploaded file:', req.file); // Debug: Log the uploaded file

        const { title, description, category, trending, oldPrice, newPrice } = req.body;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : null;

        // Debug: Log the parsed values
        console.log('Parsed values:', {
            title,
            description,
            category,
            trending,
            oldPrice,
            newPrice,
            coverImage,
        });

        // Validate required fields
        if (!title || !description || !category || trending === undefined || !oldPrice || !newPrice) {
            return res.status(400).send({ message: "All fields are required", missingFields: { title, description, category, trending, oldPrice, newPrice, coverImage } });
        }

        // Convert string values to appropriate types
        const trendingBool = trending === 'true' || trending === true;
        const oldPriceNum = parseFloat(oldPrice);
        const newPriceNum = parseFloat(newPrice);

        // Additional validation for numbers
        if (isNaN(oldPriceNum) || oldPriceNum < 0) {
            return res.status(400).send({ message: "Old Price must be a valid positive number" });
        }
        if (isNaN(newPriceNum) || newPriceNum < 0) {
            return res.status(400).send({ message: "New Price must be a valid positive number" });
        }

        // Create a new book
        const newBook = new Book({
            title,
            description,
            category,
            trending: trendingBool,
            oldPrice: oldPriceNum,
            newPrice: newPriceNum,
            coverImage,
        });

        console.log('Saving book to database:', newBook); // Debug: Log the book object
        await newBook.save();

        res.status(200).send({ message: "Book posted successfully", book: newBook });
    } catch (error) {
        console.error("Error creating book:", error.message); // Debug: Log the error
        console.error("Error stack:", error.stack); // Debug: Log the stack trace
        console.error("Validation errors:", error.errors); // Debug: Log specific validation errors
        res.status(500).send({ message: "Failed to create book", error: error.message, validationErrors: error.errors });
    }
};

// Get all books
const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.status(200).send(books);
    } catch (error) {
        console.error("Error fetching books:", error.message);
        res.status(500).send({ message: "Failed to fetch books" });
    }
};

// Get single book
const getSingleBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).send({ message: "Book not Found!" });
        }
        res.status(200).send(book);
    } catch (error) {
        console.error("Error fetching book:", error.message);
        res.status(500).send({ message: "Failed to fetch book" });
    }
};

// Update book
const UpdateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedBook = await Book.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedBook) {
            return res.status(404).send({ message: "Book is not Found!" });
        }
        res.status(200).send({
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        console.error("Error updating a book:", error.message);
        res.status(500).send({ message: "Failed to update a book" });
    }
};

// Delete book
const deleteABook = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBook = await Book.findByIdAndDelete(id);
        if (!deletedBook) {
            return res.status(404).send({ message: "Book is not Found!" });
        }
        res.status(200).send({
            message: "Book deleted successfully",
            book: deletedBook,
        });
    } catch (error) {
        console.error("Error deleting a book:", error.message);
        res.status(500).send({ message: "Failed to delete a book" });
    }
};

module.exports = {
    postABook,
    getAllBooks,
    getSingleBook,
    UpdateBook,
    deleteABook,
};