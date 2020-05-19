const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const middleware = require('./utils/middleware');

const mongoose = require('mongoose');

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(error => console.error('error connecting to MongoDB: ', error.message));

app.use(cors());
app.use(express.json());

app.use(middleware.getTokenFrom);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);

module.exports = app;