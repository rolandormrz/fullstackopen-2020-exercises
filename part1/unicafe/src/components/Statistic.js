import React from 'react';
import './Statistic.css';

const Statistic = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  );
}

export default Statistic;