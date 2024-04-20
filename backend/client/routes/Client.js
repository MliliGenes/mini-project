import express from "express";
import {
  addClient,
  deleteClient,
  getClientById,
  getClients,
  updateClient,
} from "../controllers/Client.js";

const route = express.Router();

route.get("/", getClients);
route.get("/:id", getClientById);
route.post("/add-client", addClient);
route.put("/update-client/:id", updateClient);
route.delete("/delete-client/:id", deleteClient);

export default route;
