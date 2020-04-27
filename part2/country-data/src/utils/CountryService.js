import axios from 'axios';
const weatherAPIKey = process.env.REACT_APP_API_KEY;

const getCountries = () => {
  const request = axios.get('https://restcountries.eu/rest/v2/all');
  return request.then(response => response.data);
}

const getWeather = location => {
  const request = axios.get(`http://api.weatherstack.com/current?access_key=${weatherAPIKey}&query=${location}`);
  return request.then(response => response.data.current);
}

export default {
  getCountries,
  getWeather
}