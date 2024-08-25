const express = require('express');
const { Comment, User } = require('../models');
const router = express.Router();

// Helper function to handle errors
const handleError = (res, err, message) => {
  console.error(err);
  res.status(500).json({ error: message });
};

// Create a new comment
router.post('/create', async (req, res) => {
  const { content, postId, userId } = req.body;

  if (!content || !postId || !userId) {
    return res.status(400).json({ error: 'Content, Post ID, and User ID are required' });
  }

  try {
    const comment = await Comment.create({ content, postId, userId });
    res.status(201).json(comment);
  } catch (err) {
    handleError(res, err, 'An error occurred while creating the comment');
  }
});

// Get comments for a specific post
router.get('/post/:postId', async (req, res) => {
  const { postId } = req.params;

  try {
    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['username'] }],
    });
    res.status(200).json(comments);
  } catch (err) {
    handleError(res, err, 'An error occurred while fetching comments');
  }
});

// Update a comment
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (content) {
      comment.content = content;
      await comment.save();
    }

    res.status(200).json(comment);
  } catch (err) {
    handleError(res, err, 'An error occurred while updating the comment');
  }
});

// Delete a comment
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (err) {
    handleError(res, err, 'An error occurred while deleting the comment');
  }
});

module.exports = router;
