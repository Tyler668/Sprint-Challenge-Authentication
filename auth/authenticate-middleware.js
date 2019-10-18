/* 
  complete the middleware code to check if the user is logged in
  before granting access to the next middleware/route handler
*/




const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js')
module.exports = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, secrets.jwtSecret, (err, decodedToken) => {
      if (err) {
      } else {
        req.user = {
          username: decodedToken.username,
          department: decodedToken.department
        };
        next();
      }
    })
  } else {
    res.status(400).json({ message: 'No credentials provided, you shall not pass!' });
  }
};
