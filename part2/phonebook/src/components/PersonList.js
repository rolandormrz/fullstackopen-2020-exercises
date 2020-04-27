import React from 'react';

const PersonList = ({ filteredPersons }) => {
  const personList = filteredPersons.map((person, i) => <li key={i}>{person.name} {person.number}</li>);

  return (
    <div>
      <ul>
        {personList}
      </ul>
    </div>
  );
}

export default PersonList;