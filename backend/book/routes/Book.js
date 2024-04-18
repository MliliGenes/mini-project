import express from "express";
import {
  addBook,
  deleteBook,
  getBookById,
  getBooks,
} from "../controllers/Book.js";

const route = express.Router();

route.get("/", getBooks);
route.get("/:code", getBookById);
route.post("/add-book", addBook);
route.delete("/delete-book/:code", deleteBook);

export default route;
