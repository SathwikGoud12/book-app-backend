const express = require('express');
const Book = require('./book.model');
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require('./book.controller');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Post a book (with file upload)
router.post("/create-book", verifyAdminToken, upload.single('coverImage'), postABook);

// Get all books
router.get("/", getAllBooks);

// Single book endpoint
router.get("/:id", getSingleBook);

// Update a book endpoint
router.put("/edit/:id", verifyAdminToken, UpdateBook);

// Delete a book
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;