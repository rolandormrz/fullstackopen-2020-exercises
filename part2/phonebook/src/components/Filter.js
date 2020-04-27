import React from 'react';

const Filter = ({ filter, handleChange }) => {
  return (
    <div>
      Search by Name: <input value={filter} onChange={handleChange} />
    </div>
  );
}

export default Filter;