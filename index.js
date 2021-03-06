require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const repos = require('./router/repos');
const email = require('./router/email');

const corsOptions = {
  origin: 'https://massimilianorizzuto.dev',
  optionsSuccessStatus: 200,
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(helmet());
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
