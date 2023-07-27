const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// 3000 порт
const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log(`Serever is running on port ${PORT}`);
});
