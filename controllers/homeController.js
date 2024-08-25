const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const { User } = require('../models/User');

// Helper function to handle errors
const handleError = (res, err, message) => {
  console.error(err);
  res.status(500).render('error', { error: message });
};

// Route to get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [User], // Include associated User model
    });
    res.render('home', { posts });
  } catch (err) {
    handleError(res, err, 'An error occurred while fetching posts');
  }
});

module.exports = router;
