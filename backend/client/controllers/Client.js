import { sendMessageToQueue } from "../../book/utils/broker.js";
import Client from "../models/Client.js";

export const getClients = async (req, res) => {
  try {
    let clients = await Client.find();

    console.log(clients);
    let jsonRes = { message: "success", data: clients };

    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    let clients = await Client.findOne({ _id: id });

    let jsonRes = { message: "success", data: clients };
    res.status(200).json(jsonRes);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const addClient = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const client = req.body;
    const newClient = await Client.create(client);

    const messageContent = JSON.stringify(newClient);
    await sendMessageToQueue("addedClient", messageContent);
    // jsonRes.data = newClient;
    res.status(202).json(jsonRes.message);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateClient = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const { id } = req.params;
    const client = req.body;
    const newClient = await Client.findOneAndUpdate({ _id: id }, client, {
      new: true,
    });
    jsonRes.data = newClient;
    res.status(200).json(jsonRes);
    const messageContent = JSON.stringify(newClient);
    await sendMessageToQueue("updatedClient", messageContent);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteClient = async (req, res) => {
  try {
    let jsonRes = { message: "success", data: null };
    const { id } = req.params;
    const newClient = await Client.findOneAndDelete({ _id: id });
    jsonRes.data = newClient;
    res.status(200).json(jsonRes);
    const messageContent = JSON.stringify(newClient);
    await sendMessageToQueue("deletedClient", messageContent);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
