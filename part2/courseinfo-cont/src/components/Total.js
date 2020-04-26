import React from 'react';

const Total = props => {
  const total = props.parts.reduce((sum, curr) => sum + curr.exercises, 0);

  return (
    <h3>Total number of exercises {total}</h3>
  );
}

export default Total;