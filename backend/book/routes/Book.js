import express from "express";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
  upload,
} from "../controllers/Book.js";

const route = express.Router();

route.get("/", getBooks);
route.get("/:id", getBookById);
route.post("/add-book", upload.single("image"), addBook);
route.put("/update-book/:id", upload.single("image"), updateBook);
route.delete("/delete-book/:id", deleteBook);

export default route;
