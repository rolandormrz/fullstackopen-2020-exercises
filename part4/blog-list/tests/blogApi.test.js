const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const api = supertest(app);

 const testUser = {
  username: "BowserJr",
  name: "Jr",
  password: "1234"
}

const testBlog = {
    "title": "Mushroom Kingdom Takeover for dummies",
    "author": "BowserJr",
    "url": "am.com",
    "likes": 24242
  };

const testUser2 = {
  username: "KingBowser",
  name: "Bowser",
  password: "1234"
}

const testBlogs = [
  {
    "title": "Minion Training",
    "author": "KingBowser",
    "url": "kb.com",
    "likes": 14674
  },
  {
    "title": "Fire Breathing Techniques",
    "author": "KingBowser",
    "url": "kb.com",
    "likes": 124667,
  }
];

const getTokenFromUser = async (info) => {
  const response = await api.post('/api/users/login').send({ username: info.username, password: info.password });
  return response.body.token;
};

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  await api.post('/api/users/register').send(testUser);

  await api.post('/api/users/register').send(testUser2);
  const token = await getTokenFromUser({ username: testUser2.username, password: testUser2.password });

  await api.post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
    .send(testBlogs[0]);

  await api.post('/api/blogs')
    .set('Authorization', 'bearer '.concat(token))
    .send(testBlogs[1]);

  /*
  const user = new User(testUser);
  const createdUser = await user.save();
  testUserId = createdUser._id;

  const blogDocuments = testBlogs.map(blog => {
    return new Blog({
      ...blog,
      user: createdUser._id
    });
  });

  const promises = blogDocuments.map(blogDocument => blogDocument.save());
  await Promise.all(promises);
  */
});

describe('user registration', () => {
  test('users can be created and return json on success', async () => {    
    const response = await api.post('/api/users/register')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAfterRequest = await User.find({});
    expect(usersAfterRequest.length).toBe(1);
    expect(response.body.passwordHash).toBeDefined();
  });
});

describe('user login', () => {
  test('sucessful user login returns a token', async () => {
    
    await api.post('/api/users/register')
      .send(testUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);


    const response = await api.post('/api/users/login')
      .send({ username: testUser.username, password: testUser.password })
      .expect(200)
      .expect('Content-Type', /application\/json/);

      expect(response.body.token).toBeDefined();
  });
});

describe('blog creation', () => {
  test('logged in user can create blog', async () => {
    const token = await getTokenFromUser({ username: testUser.username, password: testUser.password });

    const response = await api.post('/api/blogs')
      .set('Authorization', 'bearer '.concat(token))
      .send(testBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    // confirm blog was created in the database
    const blogsAfterRequest = await Blog.find({});
    expect(blogsAfterRequest.length).toBe(1);

    // check that the response has the user reference
    expect(response.body.user).toBeDefined();

    // confirm the blog's id was added to the user's blogs array
    const userAfterRequest = await User.findOne({ username: testUser.username });
    expect(userAfterRequest.blogs.length).toBe(1);

    // confirm the user's blog id matches the blog's id
    expect(userAfterRequest.blogs[0].toString()).toBe(response.body.id.toString());

    // confirm the user's id matches the the blog's user field
    expect(userAfterRequest._id.toString()).toBe(response.body.user.toString());
  }); 

  test('if likes property is missing default to 0', async () => {
    const blogWithNoLikes = {
      title: 'Just Added',
      author: 'BowserJr',
      url: 'ja.com'
    };

    const token = await getTokenFromUser({ username: testUser.username, password: testUser.password });

    const response = await api.post('/api/blogs')
      .set('Authorization', 'bearer '.concat(token))
      .send(blogWithNoLikes)
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

    const token = await getTokenFromUser({ username: testUser.username, password: testUser.password });

    await api.post('/api/blogs')
      .set('Authorization', 'bearer '.concat(token))
      .send(blogWithMissingTitle)
      .expect(400);

    await api.post('/api/blogs')
      .set('Authorization', 'bearer '.concat(token))
      .send(blogWithMissingURL)
      .expect(400);
  });
});

describe('retrieving blogs', () => {
  test('blogs are returned as json', async () => {
    const response = await api.get('/api/blogs');
    
    expect(response.body).toHaveLength(2);
  });

  test('a specific url is contained within the results', async () => {
    const response = await api.get('/api/blogs');
    const urls = response.body.map(blog => blog.url);

    expect(urls).toContainEqual(testBlogs[0].url);
  });

  test('blog posts returned contain the id property', async () => {
    const response = await api.get('/api/blogs');
    
    response.body.forEach(blog => expect(blog.id).toBeDefined());
  });
});

describe('deleting blogs', () => {
  test('succeeds with 204 if the id is valid and existing', async () => {
    const token = await getTokenFromUser({ username: testUser2.username, password: testUser2.password });

    let response = await api.get('/api/blogs');
    const blogsAtStart = response.body;
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', 'bearer '.concat(token))
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