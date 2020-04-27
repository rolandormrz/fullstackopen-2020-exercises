import React from 'react';

const PersonForm = ({ fields, setFields, handlers }) => {
  const { handleChange, handleSubmit } = handlers;
  const { newName, newNumber } = fields;
  const { setNewName, setNewNumber } = setFields;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        name: <input value={newName} onChange={handleChange(setNewName)} pattern="^(\w\w+)\s(\w+)$" required />
        <br />
        number: <input value={newNumber} onChange={handleChange(setNewNumber)} required />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
  </form>
  );
}

export default PersonForm;