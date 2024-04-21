import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  dateEmprunt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateRetour: {
    type: Date,
    required: false,
  },
});

let Loan = mongoose.model("Loan", loanSchema);

export default Loan;
