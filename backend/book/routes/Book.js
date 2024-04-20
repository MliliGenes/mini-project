import express from "express";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
  updateBook,
} from "../controllers/Book.js";

const route = express.Router();

route.get("/", getBooks);
route.get("/:id", getBookById);
route.post("/add-book", addBook);
route.put("/update-book/:id", updateBook);
route.delete("/delete-book/:id", deleteBook);

export default route;
