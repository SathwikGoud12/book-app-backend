const express = require("express");
const multer = require("multer");
const {
    postABook,
    getAllBooks,
    getSingleBook,
    updateBook,
    deleteABook,
} = require("./book.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");

const router = express.Router();

// 🟢 Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Ensure this folder exists in your project
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage });

// ✅ Post a book with file upload
router.post("/create-book", verifyAdminToken, upload.single("coverImage"), postABook);

// ✅ Get all books
router.get("/", getAllBooks);

// ✅ Get single book
router.get("/:id", getSingleBook);

// ✅ Update a book (Include file handling if needed)
router.put("/edit/:id", verifyAdminToken, upload.single("coverImage"), updateBook);

// ✅ Delete a book
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
