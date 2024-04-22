import express from "express";
import {
  addLoan,
  getLoans,
  getloanById,
  returnBook,
} from "../controllers/Loan.js";

const route = express.Router();

route.get("/", getLoans);
route.get("/:id", getloanById);
route.post("/add-loan", addLoan);
route.post("/return-book", returnBook);
// route.get("/return-all-book/:id", returnBooks);

export default route;
