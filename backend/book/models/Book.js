import mongoose from "mongoose";
import { v4 } from "uuid";

const bookSchema = new mongoose.Schema({
  code: {
    type: String,
    default: v4(),
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
  image: {
    type: String, // Assuming you'll store the image path as a string
    required: true, // Or change to `false` if images are optional
  },
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
