const express = require('express');
const router = express.Router();
const { Post } = require('../models/Post');
const { User } = require('../models/User');
const { Comment } = require('../models/Comment');

// Helper function to handle errors
const handleError = (res, err, redirectUrl) => {
  console.error(err);
  res.redirect(redirectUrl);
};

// Route to create a new post
router.post('/create', async (req, res) => {
  const { title, content } = req.body;
  const userId = req.session.userId;

  if (!title || !content || !userId) {
    return res.redirect('/create'); // Handle missing data
  }

  try {
    await Post.create({ title, content, userId });
    res.redirect('/dashboard');
  } catch (err) {
    handleError(res, err, '/create');
  }
});

// Route to get a specific post by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id, {
      include: [
        User,
        {
          model: Comment,
          include: [User], // Include user for comments
        },
      ],
    });

    if (!post) {
      return res.status(404).render('error', { error: 'Post not found' });
    }

    res.render('post-details', { post });
  } catch (err) {
    handleError(res, err, '/'); // Redirect to a more appropriate URL or error page
  }
});

module.exports = router;
