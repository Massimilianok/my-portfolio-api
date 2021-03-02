require('dotenv').config();
const express = require('express');
const cors = require('cors');
const repos = require('./router/repos');
const email = require('./router/email');

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/repos', repos);
app.use('/api/email', email);

app.get('/', (req, res) => {
  res.send('Welcome to Massimiliano Rizzuto Portfolio API 😎');
});

app.all('*', (req, res) => {
  res.redirect('/');
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Server is running on port: ${port}`));
