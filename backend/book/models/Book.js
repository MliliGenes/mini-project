const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  titre: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  auteur: {
    type: String,
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
