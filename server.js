const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Use environment variable for PORT
const PORT = process.env.PORT || 3000;

// Configure CORS to only allow your frontend domain
app.use(cors({
  origin: process.env.FRONTEND_URL || '*' // Replace with your Netlify URL once deployed
}));
app.use(express.json());
app.use(express.static('public'));

// Use MongoDB Atlas connection string from environment variable
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tododb';
mongoose.connect(MONGODB_URI);

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// Create TODO
app.post('/todos', async (req, res) => {
  try {
    const todo = new Todo(req.body);
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read all TODOs
app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Update TODO
app.put('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete TODO
app.delete('/todos/:id', async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
