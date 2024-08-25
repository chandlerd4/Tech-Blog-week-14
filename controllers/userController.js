const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../models/User');
const router = express.Router();

// Helper function for error handling
const handleError = (res, err, statusCode, message) => {
  console.error(err);
  res.status(statusCode).send(message);
};

// Route to handle user signup
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleError(res, null, 400, 'Username and password are required');
  }

  try {
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return handleError(res, null, 400, 'Username already taken');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });

    req.session.userId = user.id;
    res.redirect('/');
  } catch (err) {
    handleError(res, err, 500, 'Internal Server Error');
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return handleError(res, null, 400, 'Username and password are required');
  }

  try {
    const user = await User.findOne({ where: { username } });

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      handleError(res, null, 400, 'Invalid username or password');
    }
  } catch (err) {
    handleError(res, err, 500, 'Internal Server Error');
  }
});

// Route to handle user logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return handleError(res, err, 500, 'Failed to log out');
    }
    res.redirect('/');
  });
});

module.exports = router;
