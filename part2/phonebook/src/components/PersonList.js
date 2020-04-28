import React from 'react';
import Person from './Person';

const ulStyle = {
  listStyleType: "none",
  paddingLeft: "10px"
}

const PersonList = ({ persons, handleDelete }) => {
  const personList = persons.map((person, i) => <Person key={i} person={person} handleDelete={handleDelete} />);

  return (
    <div>
      <ul style={ulStyle}>
        {personList}
      </ul>
    </div>
  );
}

export default PersonList;