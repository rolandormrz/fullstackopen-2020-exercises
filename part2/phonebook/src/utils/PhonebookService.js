import axios from 'axios';

const baseURLDev = 'http://localhost:3001/api/persons';
const baseURL = 'https://damp-wildwood-82283.herokuapp.com/api/persons';
const relativeURL = '/api/persons';

const create = newPerson => {
  const request = axios.post(relativeURL, newPerson);
  return request.then(response => response.data);
}

const update = updatedPerson => {
  const request = axios.put(`${relativeURL}/${updatedPerson.id}`, updatedPerson);
  return request.then(response => response.data);
}

const deletePerson = id => {
  const personToDeleteURL = `${relativeURL}/${id}`;
  return axios.delete(personToDeleteURL);
}

const getAll = () => {
  return axios.get(relativeURL).then(response => response.data);
}

export default { create, getAll, deletePerson, update }