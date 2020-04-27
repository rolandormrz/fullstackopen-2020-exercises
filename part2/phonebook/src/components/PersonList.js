import React from 'react';

const ulStyle = {
  listStyleType: "none",
  paddingLeft: "10px"
}

const PersonList = ({ filteredPersons }) => {
  const personList = filteredPersons.map((person, i) => <li key={i}>{person.name} {person.number}</li>);

  return (
    <div>
      <ul style={ulStyle}>
        {personList}
      </ul>
    </div>
  );
}

export default PersonList;