const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = require('express').Router();

const Users = require('../users/users-model');
const { isValid } = require('../users/users-service');

router.post('/register', (req, res) => {
  const creds = req.body;

  if (isValid(creds)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    const hash = bcryptjs.hashSync(creds.password, rounds);

    creds.password = hash;

    Users.add(creds)
      .then((user) => {
        res.status(201).json({ data: user });
      })
      .catch((error) => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: 'please provide username and alphanumeric password',
    });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = makeJwt(user);

          res.status(200).json({ message: 'Welcome to the API', token });
        } else {
          res.status(401).json({ message: 'invalid credentials' });
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: 'please provide username and alphanumeric password',
    });
  }
});

function makeJwt(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const secret = process.env.JWT_SECRET || 'the secret';

  const options = {
    expiresIn: '1h',
  };

  return jwt.sign(payload, secret, options);
}

module.exports = router;
