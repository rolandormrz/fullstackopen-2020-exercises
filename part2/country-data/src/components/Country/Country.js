import React, { useState } from 'react';
import './Country.css';
import CountryInfo from '../CountryInfo/CountryInfo';

const Country = ({ country }) => {
  const [showInfo, setShowInfo] = useState(false);
  const label = showInfo ? 'Hide' : "Show Info";

  const handleClick = () => {
    setShowInfo(!showInfo);
  }

  return (
    <div className='country'>
      <div className='country-header'>
        <p>{country.name}</p>
        <button onClick={handleClick}>{label}</button>
      </div>
      { showInfo && <CountryInfo country={country} /> }
    </div>
  );
}

export default Country;