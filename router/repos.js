require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();

router.get('/', (req, res) => {
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
    .then((data) => res.status(200).json({ code: 200, message: 'OK', data }))
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        code: 500,
        error: 'There are problems loading projects, please try again later!',
      });
    });
});

module.exports = router;
