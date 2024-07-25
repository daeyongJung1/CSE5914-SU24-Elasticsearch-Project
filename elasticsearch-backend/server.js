const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./Routers/userRouter')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 8080;
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/recipe-review';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/user', userRouter);

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});