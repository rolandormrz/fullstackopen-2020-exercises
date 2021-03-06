import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = newToken => {
  token = `bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
};

const login = async (loginInfo) => {
  const request = await axios.post('/api/users/login', loginInfo);
  return request.data;
};

const createBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

export default { getAll, createBlog, login, setToken };