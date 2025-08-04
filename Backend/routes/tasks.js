const express = require('express');
const router = express.Router();
const { Task } = require('../models');
const { authenticateToken } = require('../middleware/auth');

// Get all tasks for logged-in user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task for logged-in user
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    const task = await Task.create({ title, userId: req.user.id });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task for logged-in user
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    task.title = req.body.title ?? task.title;
    task.completed = req.body.completed ?? task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task for logged-in user
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;