import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import CreateBlogForm from './components/CreateBlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ text: '', styling: '' });

  // get all blogs from the backend
  useEffect(() => {
    blogService.getAll().then(blogs => setBlogs( blogs ));
  }, []);

  // check local storage for user info and log in if it exists
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const logOut = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
    blogService.setToken(null);
  };

  const setNotification = (text, styling) => {
    setMessage({ text, styling });
    setTimeout(() => setMessage({ text: '', styling: ''}), 3000);
  };

  const blogsList = blogs.map(blog => <Blog key={blog.id} blog={blog} />);

  /*
  if(user) {
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in </p>
        <button onClick={logOut}>Log-Out</button>
        <CreateBlogForm blogs={blogs} setBlogs={setBlogs}/>
        { blogsList }
      </div>
    );
  }
  else {
    return <LoginForm setUser={setUser} />
  }
  */

  return (
    <div>
      { message.text && <Notification message={message} />}
      { 
        user ?
          <div>
            <h1>Blog Application</h1>
            <p>{user.name} logged in </p>
            <button onClick={logOut}>Log-Out</button>
            <CreateBlogForm blogs={blogs} setBlogs={setBlogs} setNotification={setNotification} />
            <h2>Blogs List</h2>
            { blogsList }
          </div> :
          <LoginForm setUser={setUser} setNotification={setNotification} />
      }
    </div>
  );
};

export default App;