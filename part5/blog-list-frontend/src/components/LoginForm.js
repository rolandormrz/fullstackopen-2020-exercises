import React, { useState } from 'react';
import blogService from '../services/blogs';

const LoginForm = ({ setUser, setNotification }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleChange = setter => event => {
    setter(event.target.value);
  }

  const handleSubmit = async event => {
    event.preventDefault();

    try {
      // send a request to login
      const response = await blogService.login({ username, password });

      // if it is successful grab the token, username, and name, provided by the backend
      const user = { token: response.token, username: response.username, name: response.name };

      // save the login details to local storage
      window.localStorage.setItem('loggedInUser', JSON.stringify(user));

      setUser(user);
      // set the token in the blogServide
      blogService.setToken(user.token);
      setNotification('Log In Successful!', 'success');
    }
    catch(exception) {
      setNotification(exception.response.data.error, 'error');
      setUsername('');
      setPassword('');
    }
  };

  return (
    <div className="login-form">
      <h2>Log-in to the Application</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor='username'>Username</label>
        <input id='username' name='username' value={username} onChange={handleChange(setUsername)} type='text' />
        <br />
        <label htmlFor='password'>Password</label>
        <input id='password' name='password' value={password} onChange={handleChange(setPassword)} type='text' />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default LoginForm;