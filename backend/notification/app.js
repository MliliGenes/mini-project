import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { connect } from "amqplib";
import nodemailer from "nodemailer"

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3003;
const connectionString = process.env.MONGODB || "mongodb://localhost:27017/";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'medblbbstudies@gmail.com',
    pass: 'hqnb cfdj trol uscr '
  }
});


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

channel.consume(queue, (message) => {
  let bookData = JSON.parse(message.content.toString());
  let bookTitle = bookData.titre;
  let bookDescription = bookData.description;
  let bookAuthor = bookData.auteur;

  var mailOptions = {
    from: 'medblbbstudies@gmail.com',
    to: 'medblbbstudies@gmail.com',
    subject: 'New book added: ' + bookTitle,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A new book has been added:</h2>
          <p><strong>Title:</strong> ${bookTitle}</p>
          <p><strong>Description:</strong> ${bookDescription}</p>
          <p><strong>Author:</strong> ${bookAuthor}</p>
        </body>
      </html>`
  };
  
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log('Erreur : ' + error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
  console.log("new book added:", bookTitle);
  channel.ack(message);
});
