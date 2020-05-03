require('dotenv').config();
const express = require('express');
const app = express();
const Person = require('./models/person');
let persons = require('./persons.js');
var morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const errorMiddleware = require('./middleware/error');

// connect to database
console.log('connecting to database');
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(results => console.log('connected to MongoDB'))
  .catch(error => console.log('error connecting to MongoDB: ', error.message));

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// set up and use morgan for logging
morgan.token('body', function (req, res) {return JSON.stringify(req.body)});
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(people => {
    res.json(people.map(person => person.toJSON()));
  })
  .catch(error => next(error));
})

app.get('/info', (req, res, next) => {
  const date = new Date();
  let length = 0;

  Person.find({})
    .then(result => {
      if(result.length) {
        length = result.length;
      }

      const info = `
        <div>
          <p>The phonebook has info for ${length} people.</p>
          <p>${date}</p>
        </div>`;

      res.send(info);
    })
    .catch(error => next(error));
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person.toJSON());
      }
      else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if(!name || !number ) {
    return res.status(400).json({ error: 'missing property' });
  }

  Person.find({ name })
    .then(result => {
      if(result.length === 0) {
        const person = new Person({ name, number });
        person.save().then(savedPerson => res.status(201).json(savedPerson.toJSON()));
      }
      else {
        res.status(400).json({ error: 'name must be unique' });
      }
    })
    .catch(error => next(error));
})

app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    name: req.body.name,
    number: req.body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      if(updatedPerson) {
        res.json(updatedPerson.toJSON());
      }
      else {
        res.status(404).end();
      }
    })
    .catch(error => next(error));
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error));
})

// error handling middleware
app.use(errorMiddleware.unknownEndpoint);
app.use(errorMiddleware.errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))