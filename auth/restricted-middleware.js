const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  const secret = process.env.JWT_SECRET || 'the secret';

  if (token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ token: 'does not work' });
      } else {
        req.jwt = decodedToken;

        next();
      }
    });
  } else {
    res.status(401).json({ token: 'does not exist' });
  }
};
