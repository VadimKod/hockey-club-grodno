const express = require('express');
const Comment = require('../models/Comment');
const { auth } = require('../middleware/auth');
const router = express.Router();
router.get('/news/:newsId', async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.newsId })
      .sort({ createdAt: -1 })
      .populate('userId', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post('/', auth, async (req, res) => {
  try {
    const { newsId, text } = req.body;
    const comment = await Comment.create({
      newsId,
      userId: req.user._id,
      userName: req.user.name,
      text
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete('/:id', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Комментарий не найден' });
    if (comment.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Нет прав' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Комментарий удалён' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = router;
