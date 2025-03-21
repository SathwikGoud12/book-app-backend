const express = require("express");
const Book = require("./book.model");
const { postABook, getAllBooks, getSingleBook, UpdateBook, deleteABook } = require("./book.controller");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// ✅ Ensure Uploads Directory Exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Multer Setup for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// ✅ Post a Book (with File Upload)
router.post("/create-book", verifyAdminToken, upload.single("coverImage"), postABook);

// ✅ Get All Books
router.get("/", getAllBooks);

// ✅ Get Single Book
router.get("/:id", getSingleBook);

// ✅ Update a Book
router.put("/edit/:id", verifyAdminToken, UpdateBook);

// ✅ Delete a Book
router.delete("/:id", verifyAdminToken, deleteABook);

module.exports = router;
