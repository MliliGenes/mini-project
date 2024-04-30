import express from "express";
import {
  deleteClient,
  getClientById,
  getClients,
  loginUser,
  registerUser,
  updateClient,
} from "../controllers/Client.js";
import authMiddleware from "../middlewares/Client.js";

const route = express.Router();

route.post("/register", registerUser);
route.post("/login", loginUser);
route.get("/", getClients);
route.get("/:id", authMiddleware, getClientById);
// route.post("/add-client", addClient);
route.put("/update-client/:id", authMiddleware, updateClient);
route.delete("/delete-client/:id", authMiddleware, deleteClient);

export default route;
