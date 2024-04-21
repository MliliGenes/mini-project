import Loan from "../models/Loan.js";

export const getLoans = async (req, res) => {
  try {
    let loans = await Loan.find();
    let jsonRes = { message: "success", data: loans };
    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getloanById = async (req, res) => {
  try {
    const { id } = req.params;
    let loans = await Loan.findOne({ _id: id });
    let jsonRes = { message: "success", data: loans };
    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addLoan = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const loan = req.body;
    const newLoan = await Loan.create(loan);
    jsonRes.data = newLoan;
    res.status(202).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
