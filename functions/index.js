const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

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
    .then((data) => res.send(data))
    .catch((err) => console.log(err));
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.https.onRequest(app);
