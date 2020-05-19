const getTokenFrom = (req, res, next) => {
  // returns the specified http request header field
  const authorization = req.get('authorization');
  
  // if the authorization header field starts with "bearer " return everything after
  if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7);
  }
  else {
    req.token = null;
  }
  next();
};

module.exports = { getTokenFrom };