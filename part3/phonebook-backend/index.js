const express = require('express');
const app = express();
const persons = require('./persons.js');

app.use(express.json());

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

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})