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
  let dateRetour = loanData.dateRetour ? loanData.dateRetour : "Not returned yet";
  let dateEmprunt = loanData.dateEmprunt;
  console.log("new loan taken:", client, book, dateRetour, dateEmprunt);
  // let clientRecord = await axios.get("http://127.0.0.1:3001/api/" + client);
  //   let dataClient = clientRecord.data;

  //   let bookRecord = await axios.get("http://127.0.0.1:3000/api/" + book);
  //   let dataBook = bookRecord.data;

  //   if (!dataClient.data || !dataBook.data) {
  //     jsonRes.message = "Client or book not found";
  //     res.status(404).json(jsonRes);
  //   }

  // var mailOptions = {
  //   from: 'medblbbstudies@gmail.com',
  //   to: 'medblbbstudies@gmail.com',
  //   subject: 'loan taken: ' + bookTitle,
  //   html: `
  //     <html>
  //       <body>
  //         <h2 style="color: #007bff;">A new loan has been taken:</h2>
  //         <p><strong>Title:</strong> ${dataBook.tite}</p>
  //         <p><strong>Description:</strong> ${dataBook.description}</p>
  //         <p><strong>Author:</strong> ${dataBook.auteur}</p>
  //       </body>
  //     </html>`
  // };
  
  // transporter.sendMail(mailOptions, function(error, info){
  //   if (error) {
  //     console.log('Erreur : ' + error);
  //   } else {
  //     console.log('Email sent: ' + info.response);
  //   }
  // });
  channel.ack(message);
});
