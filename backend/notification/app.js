import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { connect } from "amqplib";
import nodemailer from "nodemailer"
import axios from 'axios'

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3003;
// const connectionString = process.env.MONGODB || "mongodb://localhost:27017/";
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'medblbbstudies@gmail.com',
    pass: 'hqnb cfdj trol uscr '
  }
});


app.listen(port, () => console.log("server connected"));
// mongoose
//   .connect(connectionString + "Notifications")
//   .then(() => console.log("database connected"));

const connection = await connect("amqp://localhost:5672");

const channel = await connection.createChannel();

const queueBooks = "books";
const queueLoans = "loanTaken";

await channel.assertQueue(queueBooks, {
  durable: true,
});

channel.consume(queueBooks, (message) => {
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

await channel.assertQueue(queueLoans, {
  durable: true,
});

channel.consume(queueLoans, async (message) => {
  let loanData = JSON.parse(message.content.toString());
  let client = loanData.client;
  let book = loanData.book;
  let dateRetour = loanData.dateRetour ||  "Not returned yet";
  let dateEmprunt = loanData.dateEmprunt;
  console.log("new loan taken:", client, book, dateRetour, dateEmprunt);
  let clientRecord = await axios.get("http://127.0.0.1:3001/api/" + client);
    let dataClient = clientRecord.data;

    let bookRecord = await axios.get("http://127.0.0.1:3000/api/" + book);
    let dataBook = bookRecord.data;
    let   {data : clientInfo} = dataClient
    let   {data : bookInfo} = dataBook
    if (!dataClient.data || !dataBook.data) {
      
      console.log("Client or book not found");
    }
    console.log(dataClient , dataBook);
  var mailOptions = {
    from: 'medblbbstudies@gmail.com',
    to: 'medblbbstudies@gmail.com',
    subject: 'loan taken: ' + bookInfo?.titre,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A new loan has been taken:</h2>
          <p><strong>Title:</strong> ${bookInfo?.titre}</p>
          <p><strong>Description:</strong> ${bookInfo?.description}</p>
          <p><strong>Author:</strong> ${bookInfo?.auteur}</p>
          <p><strong>Client:</strong> ${clientInfo?.nom}</p>
          <p><strong>Date emprunt:</strong> ${dateEmprunt}</p>
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
  channel.ack(message);
});
