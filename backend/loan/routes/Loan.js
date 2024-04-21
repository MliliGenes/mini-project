import express from "express";
import { addLoan, getLoans, getloanById } from "../controllers/Loan.js";

const route = express.Router();

route.get("/", getLoans);
route.get("/:id", getloanById);
route.post("/add-book", addLoan);
// route.put("/update-book/:id", updateBook);
// route.delete("/delete-book/:id", deleteBook);

export default route;
