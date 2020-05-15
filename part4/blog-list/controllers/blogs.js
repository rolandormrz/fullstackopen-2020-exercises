const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const response = await Blog.find({});
    res.json(response);
  }
  catch (exception) {
    next(exception);
  }
});

blogsRouter.post('/', async (req, res, next) => {
  const blogDetails = req.body;

  if(!blogDetails.title || !blogDetails.url) {
    res.status(400).end();
  }

  if(!blogDetails.likes) {
    blogDetails.likes = 0;
  }

  const newBlog = new Blog(blogDetails);

  try {
    const response = await newBlog.save();
    res.status(201).json(response.toJSON());
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

  try {
    const result = await Blog.findByIdAndRemove(id);

    if(result) {
      res.status(204).end();
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