import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    let books = await Book.find();

    let jsonRes = { message: "success", data: books };

    res.status(200).json(jsonRes);
  } catch (err) {}
};

export const getBookById = async (req, res) => {
  try {
    const { code } = req.params;
    let books = await Book.findOne({ code });

    let jsonRes = { message: "success", data: books };

    res.status(200).json(jsonRes);
  } catch (err) {}
};

export const addBook = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const book = req.body;
    const existingBook = await Book.findOne({ code: book.code });

    if (existingBook) {
      console.log("Book with the same code already exists:", existingBook);
      jsonRes.message = "Book with the same code already exists";
      res.status(400).json(jsonRes);
    } else {
      const createdBook = await Book.create(bookData);
      console.log("New book created:", createdBook);
      jsonRes.data = createdBook;
      res.status(202).json(jsonRes);
    }
  } catch (err) {}
};

export const deleteBook = async (req, res) => {
  try {
    let jsonRes = { message: "success" };
    const { code } = req.params;
    let isDeleted = await Book.findOneAndDelete({ code });

    res.status(200).json(jsonRes);
  } catch (err) {}
};
