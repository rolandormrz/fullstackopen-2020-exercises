import React, { useState, useEffect } from 'react';
import './App.css';
import CountryList from './components/CountryList/CountryList';
import CountryService from './utils/CountryService';

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    CountryService.getCountries().then(data => setCountries(data));
  }, []);

  const handleChange = setter => e => {
    setter(e.target.value);
  }

  const filteredCountries = filter === '' 
    ? countries 
    : countries.filter(country => {
      const countryName = country.name.toLowerCase();
      return countryName.indexOf(filter.toLowerCase()) !== -1;
    })

  return (
    <div>
      <h1>Country Data</h1>
      <div>
        Search for Countries: <input value={filter} onChange={handleChange(setFilter)} />
      </div>
      {
        filter === ''
          ? <p>Enter a country above to begin</p>
          : <CountryList countries={filteredCountries} filter={filter} />
      }     
    </div>
  );
}

export default App;
