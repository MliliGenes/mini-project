import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { connect } from "amqplib";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3003;
const connectionString = process.env.MONGODB || "mongodb://localhost:27017/";

app.listen(port, () => console.log("server connected"));
mongoose
  .connect(connectionString + "Notifications")
  .then(() => console.log("database connected"));

const connection = await connect("amqp://localhost:5672");

const channel = await connection.createChannel();

const queue = "books";

await channel.assertQueue(queue, {
  durable: true,
});

channel.consume(queue, (messaage) => {
  let bookTitle = JSON.parse(messaage.content.toString()).titre;
  console.log("new book added:", bookTitle);
  channel.ack(messaage);
});
