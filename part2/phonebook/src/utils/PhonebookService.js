import axios from 'axios';

const baseURL = 'http://localhost:3001/persons';

const create = newPerson => {
  const request = axios.post(baseURL, newPerson);
  return request.then(response => response.data);
}

const update = updatedPerson => {
  const request = axios.put(`${baseURL}/${updatedPerson.id}`, updatedPerson);
  return request.then(response => response.data);
}

const deletePerson = id => {
  const personToDeleteURL = `${baseURL}/${id}`;
  return axios.delete(personToDeleteURL);
}

const getAll = () => {
  return axios.get(baseURL).then(response => response.data);
}

export default { create, getAll, deletePerson, update }