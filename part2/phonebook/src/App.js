import React, { useState, useEffect } from 'react';
import './App.css';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import PhonebookService from './utils/PhonebookService';
import Notification from './components/Notification';

const errorStyling = {
  border: '2px solid red',
  borderRadius: 6,
  paddingLeft: 10,
  marginBottom: 20,
  background: '#F5F5F5',
  color: 'red',
  fontSize: 20
}

const successStyling = {
  border: '2px solid green',
  borderRadius: 6,
  paddingLeft: 10,
  marginBottom: 20,
  background: '#F5F5F5',
  color: 'green',
  fontSize: 20
}

const App = () => {
  const [ persons, setPersons ] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ message, setMessage ] = useState('');
  const [ styling, setStyling ] = useState(errorStyling);

  useEffect(() => {
    PhonebookService.getAll().then(data => setPersons(data));
  }, []);
  
  const handleChange = (setInfo) => e => {
    setInfo(e.target.value);
  }

  const setNotification = (message, messageStyling) => {
    setMessage(message);
    setStyling(messageStyling);

    setTimeout(() => {
      setMessage('');
    }, 3000);
  }

  const handleDelete = personToDelete => {
    PhonebookService.deletePerson(personToDelete.id)
      .then(response => {
        const deletedPersonIndex = persons.findIndex(person => personToDelete.id === person.id);
        const changedPersons = [...persons];
        const deletedPerson = changedPersons.splice(deletedPersonIndex, 1);
        setPersons(changedPersons);
        setNotification(`${deletedPerson[0].name} has been removed from the phonebook`, successStyling);
      })
      .catch(error => {
        setPersons(persons.filter(person => person.id !== personToDelete.id));
        setNotification(`${personToDelete.name} has already been removed from the phonebook`, errorStyling);
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
            setNotification(`${returnedPerson.name}'s number has been updated in the phonebook`, successStyling);
          })
          .catch(error => {
            setNotification(`${updatedPerson.name} was removed in another instance. Cannot update ${updatedPerson.name}'s number`, errorStyling);
            setPersons(persons.filter(person => person.id !== updatedPerson.id));
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber };
      PhonebookService.create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          setNotification(`${createdPerson.name} has been added to the phonebook`, successStyling);
        });
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
      { message && <Notification message={message} styling={styling} /> }
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
