import React, { useState, useEffect } from 'react';
import './CountryInfo.css';
import WeatherInfo from '../WeatherInfo';
import CountryService from '../../utils/CountryService';

const CountryInfo = ({ country }) => {
  const [weather, setWeather] = useState({});
  const [reqComplete, setReqComplete] = useState(false);

  useEffect(() => {
    CountryService.getWeather(country.capital).then(weatherData => {
      setWeather(weatherData);
      setReqComplete(true);
    })
  }, [country.capital])

  return (
    <div className='country-info'>
      <h3>{country.name}</h3>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Languages:</p>
      <ul>
      { country.languages.map((language, i) => <li key={i}>{language.name}</li>) } 
      </ul>
      <div className='flag'>
        <p>Flag</p>
        <img src={country.flag} alt={`${country.name}'s flag`} />
      </div>
      { reqComplete ? <WeatherInfo country={country} weather={weather} /> : <p>Loading weather information...</p> }
    </div>
  );
}

export default CountryInfo;