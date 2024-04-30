import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "amqplib";
import nodemailer from "nodemailer";
import axios from "axios";

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT || 3003;
// const connectionString = process.env.MONGODB || "mongodb://localhost:27017/";
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "medblbbstudies@gmail.com",
    pass: "hqnb cfdj trol uscr ",
  },
});

app.listen(port, () => console.log("/Notifications - server connected"));
// mongoose
//   .connect(connectionString + "Notifications")
//   .then(() => console.log("database connected"));

const connection = await connect("amqp://localhost:5672");

const channel = await connection.createChannel();

const queueBooks = "books";
const queueBooksDeleted = "deletedBook";
const queueLoans = "loanTaken";
const queueLoansReturned = "loanReturned";
const queueClients = "addedClient";
const queueClientUpdated = "updatedClient";
const queueClientDeleted = "deletedClient";

//Add book
await channel.assertQueue(queueBooks, {
  durable: true,
});

channel.consume(queueBooks, (message) => {
  let bookData = JSON.parse(message.content.toString());
  let bookTitle = bookData.titre;
  let bookDescription = bookData.description;
  let bookAuthor = bookData.auteur;

  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "saad.elm.77@gmail.com",
    subject: "New book added: " + bookTitle,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A new book has been added:</h2>
          <p><strong>Title:</strong> ${bookTitle}</p>
          <p><strong>Description:</strong> ${bookDescription}</p>
          <p><strong>Author:</strong> ${bookAuthor}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("new book added:", bookTitle);
  channel.ack(message);
});

//book deleted
await channel.assertQueue(queueBooksDeleted, {
  durable: true,
});
channel.consume(queueBooksDeleted, (message) => {
  let bookData = JSON.parse(message.content.toString());
  let bookTitle = bookData.titre;
  let bookDescription = bookData.description;
  let bookAuthor = bookData.auteur;
  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "medblbbstudies@gmail.com",
    subject: "Book deleted: " + bookTitle,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A book has been deleted:</h2>
          <p><strong>Title:</strong> ${bookTitle}</p>
          <p><strong>Description:</strong> ${bookDescription}</p>
          <p><strong>Author:</strong> ${bookAuthor}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("book deleted:", bookTitle);
  channel.ack(message);
});

//loan added
await channel.assertQueue(queueLoans, {
  durable: true,
});

channel.consume(queueLoans, async (message) => {
  let loanData = JSON.parse(message.content.toString());
  let client = loanData.client;
  let book = loanData.book;
  let dateRetour = loanData.dateRetour || "Not returned yet";
  // let dateEmprunt = loanData.dateEmprunt;
  console.log("new loan taken:", client, book, dateRetour, dateEmprunt);
  let clientRecord = await axios.get("http://127.0.0.1:3001/api/" + client);
  let dataClient = clientRecord.data;

  let bookRecord = await axios.get("http://127.0.0.1:3000/api/" + book);
  let dataBook = bookRecord.data;
  let { data: clientInfo } = dataClient;
  let { data: bookInfo } = dataBook;
  if (!dataClient.data || !dataBook.data) {
    console.log("Client or book not found");
  }
  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "saad.elm.77@gmail.com",
    subject: "loan taken: " + bookInfo?.titre,
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
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  channel.ack(message);
});
//loan returned
await channel.assertQueue(queueLoansReturned, {
  durable: true,
});
channel.consume(queueLoansReturned, async (message) => {
  let loanData = JSON.parse(message.content.toString());
  let client = loanData.client;
  let book = loanData.book;

  let dateRetour = loanData.dateRetour;
  let dateEmprunt = loanData.dateEmprunt;
  let clientRecord = await axios.get("http://127.0.0.1:3001/api/" + client);
  let dataClient = clientRecord.data;
  let bookRecord = await axios.get("http://127.0.0.1:3000/api/" + book);
  let dataBook = bookRecord.data;
  let { data: clientInfo } = dataClient;
  let { data: bookInfo } = dataBook;
  if (!dataClient.data || !dataBook.data) {
    console.log("Client or book not found");
  }
  console.log("loan returned:", client, book, dateRetour, dateEmprunt);
  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "medblbbstudies@gmail.com",
    subject: "loan returned: " + book,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A loan has been returned:</h2>
          <p><strong>Title:</strong> ${bookInfo?.titre}</p>
          <p><strong>Client:</strong> ${clientInfo?.nom} ${clientInfo?.prénom}</p>
          <p><strong>Date emprunt:</strong> ${dateEmprunt}</p>
          <p><strong>Date retour:</strong> ${dateRetour}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  channel.ack(message);
});
//Add client
await channel.assertQueue(queueClients, {
  durable: true,
});
channel.consume(queueClients, (message) => {
  let clientData = JSON.parse(message.content.toString());
  let clientName = clientData.nom;
  let clientPrenom = clientData.prénom;
  let clientEmail = clientData.email;
  if (!clientName || !clientEmail) {
    console.log("Client name or email not found");
  }

  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "medblbbstudies@gmail.com",
    subject: "New client added: " + clientName,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A new client has been added:</h2>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Prenom:</strong> ${clientPrenom}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("new client added:", clientName, clientEmail);
  channel.ack(message);
});
//Update client
await channel.assertQueue(queueClientUpdated, {
  durable: true,
});
channel.consume(queueClientUpdated, (message) => {
  let clientData = JSON.parse(message.content.toString());
  let clientName = clientData.nom;
  let clientPrenom = clientData.prénom;
  let clientEmail = clientData.email;
  if (!clientName || !clientEmail) {
    console.log("Client name or email not found");
  }

  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "medblbbstudies@gmail.com",
    subject: "Client updated: " + clientName,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A client has been updated:</h2>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Prenom:</strong> ${clientPrenom}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("client updated:", clientName, clientEmail);
  channel.ack(message);
});
//Delete client
await channel.assertQueue(queueClientDeleted, {
  durable: true,
});
channel.consume(queueClientDeleted, (message) => {
  let clientData = JSON.parse(message.content.toString());
  let clientName = clientData.nom;
  let clientPrenom = clientData.prénom;
  let clientEmail = clientData.email;
  if (!clientName || !clientEmail) {
    console.log("Client name or email not found");
  }

  var mailOptions = {
    from: "medblbbstudies@gmail.com",
    to: "medblbbstudies@gmail.com",
    subject: "Client deleted: " + clientName,
    html: `
      <html>
        <body>
          <h2 style="color: #007bff;">A client has been deleted:</h2>
          <p><strong>Name:</strong> ${clientName}</p>
          <p><strong>Prenom:</strong> ${clientPrenom}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
        </body>
      </html>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log("Erreur : " + error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
  console.log("client deleted:", clientName, clientEmail);
  channel.ack(message);
});
