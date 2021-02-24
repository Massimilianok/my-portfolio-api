const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(cors());

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USERNAME,
    pass: process.env.MAILTRAP_PASS,
  },
});

app.post('/send', (req, res) => {
  const mailOptions = {
    from: req.body.email,
    to: 'massimiliano.rizzuto87@gmail.com',
    subject: 'Message from Portfolio contact form',
    text: req.body.message,
  };

  transport.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server errors');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Success');
    }
  });
});

app.get('/repos', (req, res) => {
  fetch('https://api.github.com/users/Massimilianok/repos', {
    headers: {
      Authorization: `Bearer ${process.env.TOKEN_GITHUB}`,
    },
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((data) => {
      const repoUpdate = data.map((repo) =>
        fetch(
          `https://api.github.com/repos/Massimilianok/${repo.name}/languages`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TOKEN_GITHUB}`,
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => ({
            ...repo,
            languages: Object.getOwnPropertyNames(data),
          }))
          .catch((err) => console.log(err))
      );
      return Promise.all(repoUpdate).then((data) => data);
    })
    .then((data) => {
      const repoUpdate = data.map((repo) =>
        fetch(
          `https://api.github.com/repos/Massimilianok/${repo.name}/topics`,
          {
            headers: {
              Authorization: `Bearer ${process.env.TOKEN_GITHUB}`,
              Accept: 'application/vnd.github.mercy-preview+json',
            },
          }
        )
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
          })
          .then((data) => ({
            ...repo,
            topics: data.names,
          }))
          .catch((err) => console.log(err))
      );
      return Promise.all(repoUpdate).then((data) => data);
    })
    .then((data) => res.status(200).json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).send('Server errors');
    });
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);
