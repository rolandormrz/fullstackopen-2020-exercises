
const personsRouter = require('express').Router();
const Person = require('../models/person');

personsRouter.get('/', (req, res, next) => {
  Person.find({})
    .then(people => {
      res.json(people.map(person => person.toJSON()));
    })
    .catch(error => next(error));
});

personsRouter.get('/info', (req, res, next) => {
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
});

personsRouter.get('/:id', (req, res, next) => {
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
});

personsRouter.post('/', (req, res, next) => {
  const { name, number } = req.body;

  if(!name || !number ) {
    return res.status(400).json({ error: 'missing property' });
  }

  const person = new Person({ name, number });
  person.save()
    .then(savedPerson => res.status(201).json(savedPerson.toJSON()))
    .catch(error => next(error));
});

personsRouter.put('/:id', (req, res, next) => {
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
});

personsRouter.delete('/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(() => res.status(204).end())
    .catch(error => next(error));
});

module.exports = personsRouter;