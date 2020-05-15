const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

const initialList = [
  {
    "title": "Good Times",
    "author": "BoB",
    "url": "goodtimes.com",
    "likes": 24242
  },
  {
    "title": "Bad Times",
    "author": "BoB",
    "url": "badtimes.com",
    "likes": 1467
  },
  {
    "title": "Mushroom Kingdom Takeover",
    "author": "Bowser",
    "url": "mkt.com",
    "likes": 14667,
  }
];

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogDocuments = initialList.map(blog => new Blog(blog));
  const promises = blogDocuments.map(blogDocument => blogDocument.save());
  await Promise.all(promises);
});

describe('api', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    
    expect(response.body).toHaveLength(3);
  });

  test('a specific url is contained within the results', async () => {
    const response = await api.get('/api/blogs');
    const urls = response.body.map(blog => blog.url);

    expect(urls).toContainEqual(initialList[1].url);
  });

  test('blog posts returned contain the id property', async () => {
    const response = await api.get('/api/blogs');
    
    response.body.forEach(blog => expect(blog.id).toBeDefined());
  });

  test('blog post can be added to the database', async () => {
    const newBlog = {
      title: 'Just Added',
      author: 'Justaddy',
      url: 'ja.com',
      likes: 424
    };

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterRequest = await api.get('/api/blogs');

    expect(blogsAfterRequest.body).toHaveLength(initialList.length + 1);
  });

  test('if likes property is missing default to 0', async () => {
    const newBlog = {
      title: 'Just Added',
      author: 'Justaddy',
      url: 'ja.com'
    };

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    expect(response.body.likes).toBe(0);
  });

  test('if title or url is missing, server responds with 400', async () => {
    const blogWithMissingTitle = {
      author: 'Justaddy',
      url: 'ja.com',
      likes: 242
    };

    const blogWithMissingURL = {
      title: 'Just Added',
      author: 'Justaddy',
      likes: 242
    };

    await api
      .post('/api/blogs')
      .send(blogWithMissingTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .send(blogWithMissingURL)
      .expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeeds with 204 if the id is valid and existing', async () => {
    let response = await api.get('/api/blogs');
    const blogsAtStart = response.body;
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204);

    response = await api.get('/api/blogs');
    const blogsAtEnd = response.body;

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1);
    expect(blogsAtEnd).not.toContainEqual(blogToDelete);
  });
});



afterAll(() => {
  mongoose.connection.close();
});