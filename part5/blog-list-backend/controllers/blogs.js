const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const response = await Blog.find({}).populate('user', { username: 1, name: 1});
    res.json(response);
  }
  catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const body = req.body;

  // get the token from the header authorization field
  const token = req.token
  // decode the token using jwt's verify method and our secret password
  let decodedToken = null;

  try {
    decodedToken = jwt.verify(token, process.env.SECRET);
  }
  catch(exception) {
    return res.status(401).json({ error: 'supplied token is not valid' });
  }
  
  // if either the token is null or the decoded token's id field is null then return error
  if(!token || !decodedToken.id) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  // verify the existence of the title, url and author fields from the body
  if(!body.title || !body.url || !body.author) {
    res.status(400).end();
  }

  if(!body.likes) {
    body.likes = 0;
  }

  const user = await User.findById(decodedToken.id);

  const newBlog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  });

  try {
    const savedBlog = await newBlog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.status(201).json(savedBlog.toJSON());
  }
  catch (exception) {
    next(exception);
  }
});

blogsRouter.put('/:id', async (req, res, next) => {
  const id = req.params.id;

  const blog = {
    ...req.body
  };

  try {
    const result = await Blog.findByIdAndUpdate(id, blog, { new: true });
    
    if(result) {
      res.json(result.toJSON());
    }
    else {
      res.status(404).end();
    }
  }
  catch (exception) {
    console.log(exception);
    if(exception.name === 'CastError') {
      return res.status(400).end();
    }
    next(exception);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  const token = req.token;

  // decode the token using jwt's verify method and our secret password
  const decodedToken = jwt.verify(token, process.env.SECRET);
  // if either the token is null or the decoded token's id field is null then return error
  if(!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing' });
  }

  try {
    const blog = await Blog.findById(id);

    if(blog) { 
      if(blog.user.toString() === decodedToken.id.toString()) {
        // get the user matched to the token from the users collection
        const user = await User.findById(decodedToken.id);

        // find the index of the blog to be removed within the user's blog array
        const indexToRemove = user.blogs.findIndex(blogId => blogId === blog._id);
        user.blogs.splice(indexToRemove, 1);
        
        await user.save();
        await blog.remove();
        res.status(204).end();
      }
      else {
        res.status(401).json({ error: 'blogs can only be deleted by their original creator' });
      }
    }
    else {
      res.status(404).end()
    }
  }
  catch (exception) {
    if(exception.name === 'CastError') {
      return res.status(400).end();
    }
    next(exception);
  }
});


module.exports = blogsRouter;