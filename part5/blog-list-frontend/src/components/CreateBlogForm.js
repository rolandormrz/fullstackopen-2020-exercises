import React, { useState } from 'react';
import blogService from '../services/blogs';

const CreateBlogForm = ({ blogs, setBlogs, setNotification }) => {
  const [blog, setBlog] = useState({ title: '', author: '', url: '', likes: 0 });

  const handleChange = event => {
    const { name, value } = event.target;
    setBlog({ ...blog, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();

    console.log(`submitting with ${blog.title} ${blog.author} ${blog.url} ${blog.likes}`);

    try {
      const createdBlog = await blogService.createBlog(blog);
      setBlogs(blogs.concat(createdBlog));
      setNotification(`${createdBlog.title} by ${createdBlog.author} has been successfully added!`, 'success');
      
    }
    catch(exception) {
      console.log(exception);
      setNotification(exception.response.data.error, 'error');
    }
    setBlog({ title: '', author: '', url: '', likes: 0 });
  };

  return (
    <div>
      <h2>Create New Blog</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title" >Title</label>
        <input id="title" name="title" value={blog.title} onChange={handleChange} type="text" />
        <br />
        <label htmlFor="author" >Author</label>
        <input id="author" name="author" value={blog.author} onChange={handleChange} type="text" />
        <br />
        <label htmlFor="url" >URL</label>
        <input id="url" name="url" value={blog.url} onChange={handleChange} type="text" />
        <br />
        <label htmlFor="likes" >Likes</label>
        <input id="likes" name="likes" value={blog.likes} onChange={handleChange} type="number" min="0" />
        <br />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default CreateBlogForm;