import React from 'react';
import Country from '../Country/Country';
import CountryInfo from '../CountryInfo/CountryInfo';
import './CountryList.css';

const CountryList = ({ countries }) => {
  const countriesToDisplay = countries.length === 0
    ? <p>No matches! Try another filter</p>
    : countries.length === 1
      ? <CountryInfo country={countries[0]} />
      : countries.length <= 10 
        ? countries.map(country => <Country key={country.numericCode} country={country} />)
        : <p>Too many matches. Try a more specific filter</p>

  return (
    <div className='country-list'>
      { countriesToDisplay }
    </div>
  );
}

export default CountryList;