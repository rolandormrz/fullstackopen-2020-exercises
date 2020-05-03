import React, { useState, useEffect } from 'react';
import './App.css';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import PersonList from './components/PersonList';
import PhonebookService from './utils/PhonebookService';
import Notification from './components/Notification';

const App = () => {
  const [ persons, setPersons ] = useState([]); 
  const [ newName, setNewName ] = useState('');
  const [ newNumber, setNewNumber ] = useState('');
  const [ filter, setFilter ] = useState('');
  const [ notifDetails, setNotifDetails ] = useState({ message: '', styling: '' });

  useEffect(() => {
    PhonebookService.getAll().then(data => setPersons(data));
  }, []);
  
  const handleChange = setInfo => e => setInfo(e.target.value);

  const prepNotification = (message, styling) => {
    setNotifDetails({ message, styling })
    setTimeout(() => setNotifDetails({ message: '', styling: ''}), 3000);
  }

  const handleDelete = personToDelete => {
    PhonebookService.deletePerson(personToDelete.id)
      .then(() => {
        const deletedPersonIndex = persons.findIndex(person => personToDelete.id === person.id);
        const changedPersons = [...persons];
        const deletedPerson = changedPersons.splice(deletedPersonIndex, 1);
        setPersons(changedPersons);
        prepNotification(`${deletedPerson[0].name} has been removed from the phonebook`, 'success');
      })
      .catch(() => {
        setPersons(persons.filter(person => person.id !== personToDelete.id));
        prepNotification(`${personToDelete.name} has already been removed from the phonebook`, 'error');
      })
  }

  const handleSubmit = e => {
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
            prepNotification(`${returnedPerson.name}'s number has been updated in the phonebook`, 'success');
          })
          .catch(() => {
            prepNotification(`${updatedPerson.name} was removed in another instance. Cannot update ${updatedPerson.name}'s number`, 'error');
            setPersons(persons.filter(person => person.id !== updatedPerson.id));
          })
      }
    }
    else {
      const newPerson = { name: newName, number: newNumber };
      PhonebookService.create(newPerson)
        .then(createdPerson => {
          setPersons(persons.concat(createdPerson))
          prepNotification(`${createdPerson.name} has been added to the phonebook`, 'success');
        })
        .catch(error => {
          const response = error.response;
          const errorMessage = response.data.error;
          prepNotification(errorMessage, 'error');
        })
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
      { notifDetails.message && <Notification message={notifDetails.message} styling={notifDetails.styling} /> }
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