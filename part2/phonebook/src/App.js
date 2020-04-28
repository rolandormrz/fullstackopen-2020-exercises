import React, { useState, useEffect } from 'react';
import './App.css';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import PhonebookService from './utils/PhonebookService';


const App = () => {
  const [ persons, setPersons ] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  useEffect(() => {
    PhonebookService.getAll().then(data => setPersons(data));
  }, []);
  
  const handleChange = (setInfo) => e => {
    setInfo(e.target.value);
  }

  const handleDelete = id => {
    PhonebookService.deletePerson(id)
      .then(response => {
        const deletedPersonIndex = persons.findIndex(person => person.id === id);
        const changedPersons = [...persons];
        changedPersons.splice(deletedPersonIndex, 1);
        setPersons(changedPersons);
      })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundIndex = persons.findIndex(person => person.name === newName);
    
    if(foundIndex !== -1) {
      const msg = `${newName} already exists in the phonebook, replace the old number with the new one entered?`;
      const result = window.confirm(msg); 

      if(result) {
        const updatedPerson = { ...persons[foundIndex], number: newNumber };
        PhonebookService.update(updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id === returnedPerson.id ? returnedPerson : person));
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber };
      PhonebookService.create(newPerson)
        .then(createdPerson => setPersons(persons.concat(createdPerson)));
    }

    setNewName('');
    setNewNumber('');
  }

  const filteredPersons = filter === '' 
    ? persons 
    : persons.filter(person => {
        const name = person.name.toLowerCase();
        return name.indexOf(filter.toLowerCase()) !== -1;
      })

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter filter={filter} handleChange={handleChange(setFilter)} />
      <h2>Add a new Entry</h2>
      <PersonForm fields={{ newName, newNumber }} 
        setFields={{ setNewName, setNewNumber }} 
        handlers={{ handleChange, handleSubmit }} 
      />
      <h2>Numbers</h2>
      <PersonList persons={filteredPersons} handleDelete={handleDelete}/>
    </div>
  )
}

export default App;
