import React, { useState, useEffect } from 'react';
import './App.css';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import axios from 'axios';


const App = () => {
  const [ persons, setPersons ] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons')
      .then(response => {
        console.log(response);
        setPersons(response.data);
      })
  }, []);

  const handleChange = (setInfo) => e => {
    setInfo(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundIndex = persons.findIndex(person => person.name === newName);
    
    if(foundIndex !== -1) {
      alert(`${newName} already exists in the phonebook`); 
    }
    else {
      const newPerson = { name: newName, number: newNumber };
      setPersons(persons.concat(newPerson));
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
      <PersonList filteredPersons={filteredPersons} />
    </div>
  )
}

export default App;
