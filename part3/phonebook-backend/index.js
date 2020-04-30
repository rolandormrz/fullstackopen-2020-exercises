const express = require('express');
const app = express();
let persons = require('./persons.js');
var morgan = require('morgan');
const cors = require('cors');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

morgan.token('body', function (req, res) {return JSON.stringify(req.body)});
app.use(morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens.body(req, res),
  ].join(' ')
}));

const generateId = () => {
  return Math.floor(Math.random() * 1000);
}

app.get('/api/persons', (req, res) => {
  res.json(persons);
})

app.get('/info', (req, res) => {
  const date = new Date();
  const info = `
    <div>
      <p>The phonebook has info for ${persons.length} people.</p>
      <p>${date}</p>
    </div>`;

  res.send(info);
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundObj = persons.find(person => person.id === id);
  if(foundObj !== undefined) {
    res.json(found);
  }
  else {
    res.status(404).end();
  }
})

app.post('/api/persons', (req, res) => {
  const newPerson = { ...req.body };
  if(!newPerson.name || !newPerson.number ) {
    res.status(400).json({ error: 'missing property' });
  }
  else if(persons.find(person => person.name === newPerson.name)) {
    res.status(400).json({ error: 'name property must be unique'});
  }
  else {
    newPerson.id = generateId();
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson);
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const foundIndex = persons.findIndex(person => person.id === id);

  if(foundIndex !== -1) {
    persons.splice(foundIndex, 1);
    res.status(204).end();
  }
  else {
    res.status(404).end();
  }
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})