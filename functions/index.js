const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const senderMail = require('./senderMail');
const app = express();

app.use(bodyParser.json());
app.use(cors({ origin: true }));


// Routes:

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/sendMailRegistroSolicitud', (req, res) => {

  try {
    // succesMessage es lo que sea que pasamos en la función resolve(...).
    // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
    senderMail.sendMailRegistroSolicitud(req.body).then((successMessage) => {
      res.status(200).send(successMessage);
    }).catch((errorMessage) => {
      res.status(400).send(errorMessage);
    });
  }

  catch (err) {
    res.status(400).send("Ocurrió un error al enviar el mail de registro de reserva: " + err.message);
  }
});

app.post('/sendMailRegistroCheckInReserva', (req, res) => {

  try {
    // succesMessage es lo que sea que pasamos en la función resolve(...).
    // No tiene por qué ser un string, pero si solo es un mensaje de éxito, probablemente lo sea.
    senderMail.sendMailRegistroCheckInReserva(req.body).then((successMessage) => {
      res.status(200).send(successMessage);
    }).catch((errorMessage) => {
      res.status(400).send(errorMessage);
    });
  }

  catch (err) {
    res.status(400).send("Ocurrió un error al enviar el mail de check in: " + err.message);
  }
});

app.post('/sendMailConfirmarReserva', (req, res) => {

  try {
    senderMail.sendMailConfirmarReserva(req.body).then((successMessage) => {
      res.status(200).send(successMessage);
    }).catch((errorMessage) => {
      res.status(400).send(errorMessage);
    });
  }

  catch (err) {
    res.status(400).send("Ocurrió un error al enviar el mail de registro de reserva: " + err.message);
  }
});

app.post('/sendMailRechazarReserva', (req, res) => {

  try {
    senderMail.sendMailRechazarReserva(req.body).then((successMessage) => {
      res.status(200).send(successMessage);
    }).catch((errorMessage) => {
      res.status(400).send(errorMessage);
    });
  }

  catch (err) {
    res.status(400).send("Ocurrió un error al enviar el mail de registro de reserva: " + err.message);
  }
});

app.post('/sendMailCancelarReserva', (req, res) => {

  try {
    senderMail.sendMailCancelarReserva(req.body).then((successMessage) => {
      res.status(200).send(successMessage);
    }).catch((errorMessage) => {
      res.status(400).send(errorMessage);
    });
  }

  catch (err) {
    res.status(400).send("Ocurrió un error al enviar el mail de cancelación de reserva: " + err.message);
  }
});


//Para llamar a este metodo se llama a .../formulario/1 (id)
app.get('/formulario/:id', (req, res) => {
  res.send('Formulario: ' + req.params.id);
});

// Expose Express API as a single Cloud Function:
exports.appMail = functions.https.onRequest(app);