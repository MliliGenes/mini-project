import Book from "../models/Book.js";

export const getBooks = async (req, res) => {
  try {
    let books = await Book.find();

    let jsonRes = { message: "success", data: books };

    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    let books = await Book.findOne({ id });

    let jsonRes = { message: "success", data: books };

    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addBook = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const book = req.body;
    const existingBook = await Book.findOne({ code: book.code });

    if (existingBook) {
      jsonRes.message = "Book with the same code already exists";
      res.status(400).json(jsonRes);
    } else {
      const createdBook = await Book.create(bookData);
      console.log("New book created:", createdBook);
      jsonRes.data = createdBook;
      res.status(202).json(jsonRes);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteBook = async (req, res) => {
  try {
    let jsonRes = { message: "success" };
    const { id } = req.params;
    let deletedBook = await Book.findOneAndDelete({ id });

    if (deletedBook) {
      jsonRes.message = "Book deleted successfully";
      res.status(200).json(jsonRes);
    } else {
      jsonRes.message = "Book not found";
      res.status(404).json(jsonRes);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateBook = (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const { id } = req.params;
    const newBookData = req.body;
    const updatedBook = Book.findOneAndUpdate({ id }, newBookData, {
      new: true,
    });
    if (updatedBook) {
      jsonRes.data = updatedBook;
      res.status(200).json(jsonRes);
    } else {
      jsonRes.message = "Book not found";
      res.status(404).json(jsonRes);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
