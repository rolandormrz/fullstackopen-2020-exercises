import React from 'react';

const WeatherInfo = ({ country, weather }) => {
  return (
    <div className='weather-info'>
      <h4>{`Weather in ${country.capital}`}</h4>
      <p>{`Temperature ${weather.temperature} C`}</p>
      <p>{`Wind ${weather.wind_speed} MPH, Direction ${weather.wind_dir}`}</p>
      <p>{`Weather Graphic for ${country.capital}`}</p>
      <img src={weather.weather_icons} alt={`Weather icon describing current weather in ${country.capital}`} />
    </div>
  );

}

export default WeatherInfo;