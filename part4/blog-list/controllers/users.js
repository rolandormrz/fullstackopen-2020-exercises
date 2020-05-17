const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

usersRouter.post('/register', async (req, res, next) => {
  const body = req.body;
  
  if(!body.username) {
    return res.status(400).json({ error: 'username missing'});
  }
  else if(!body.password) {
    return res.status(400).json({ error: 'password missing'});
  }
  else if(body.username.length <= 3) {
    return res.status(400).json({ error: 'username length must be 3 or greater' });
  }
  else if(body.password.length <= 3) {
    return res.status(400).json({ error: 'password length must be 3 or greater' });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser.toJSON());
  }
  catch (exception) {
    next(exception);
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const body = req.body;

  const user = await User.findOne({ username: body.username });
  const passwordCorrect = user === null ? false : await bcrypt.compare(body.password, user.passwordHash);

  if(!(user && passwordCorrect)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const tokenForUser = { 
    username: user.username, 
    id: user._id 
  };

  const token = jwt.sign(tokenForUser, process.env.SECRET);

  res.status(200).send({ token, username: user.username, name: user.name });
});

usersRouter.get('/', async (req, res, next) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1, url: 1, likes: 1 });
  res.json(users);
});

module.exports = usersRouter;