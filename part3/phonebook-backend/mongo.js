const mongoose = require('mongoose');

if(process.argv.length < 3) {
  console.log('Missing password as argument');
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://roli:${password}@roli-cluster-sjkko.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to mongodb'));
  
const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);
console.log('model setup');

if(process.argv.length === 3) {
  console.log('before data retrieval');

  Person.find({}).then(result => {
    console.log('phonebook:');

    result.forEach(person => {
      console.log(`${person.name} ${person.number}`);
    });

    mongoose.connection.close();
  })
    .catch(error => {
      console.log(error);
    });
}
else {
  const name = process.argv[3];
  const number = process.argv[4];

  const person = new Person({
    name,
    number
  });

  console.log('before data insert');

  person.save().then(() => {
    console.log(`${name} ${number} was added to the phonebook`);
    mongoose.connection.close();
  })
    .catch(error => {
      console.log(error);
    });
}