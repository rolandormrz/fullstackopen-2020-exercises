const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', (req, res, next) => {
  Blog.find({})
    .then(blogs => {
      res.json(blogs);
    })
    .catch(error => next(error));
});

blogsRouter.post('/', (req, res, next) => {
  const { title, author, url, likes } = req.body;

  if(!title || !author || !url || !likes) {
    res.status(400).json({ error: 'missing property' });
  }

  const newBlog = new Blog({ title, author, url, likes });
  newBlog.save()
    .then(savedBlog => res.status(201).json(savedBlog.toJSON()))
    .catch(error => next(error));
});


module.exports = blogsRouter;