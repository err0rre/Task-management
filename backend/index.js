// backend/index.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const Task = require('./models/Task');  // Import the Task model
const User = require('./models/User');  // Import the User model

const sequelize = require('./db');  // Import the Sequelize instance

const app = express();
const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.SECRET_KEY;

// const SECRET_KEY = 'my_jwt_secret_key';  // Secret key for signing JWTs

// Middleware
app.use(cors());
app.use(express.json());

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();  // Fetch all users from the database
    res.json(users);  // Return the user list
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// Get a single user
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  // Find user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);  // Return the user information
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Error fetching user' });
  }
});

// User registration API
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;

  // Check if any fields are empty
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await User.findOne({ where: { username } });
    const existingEmail = await User.findOne({ where: { email } });

    // If username or email exists, return a general error message
    if (existingUser || existingEmail) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create a new user
    const user = await User.create({ username, password, email });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    return res.json({ token });  // Return the token to the client
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});

// JWT authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract the token part after Bearer
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;  // Store the user ID in the request object
    next();
  });
};

// Root path handling '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API! Try visiting /api/tasks to see the tasks.');
});

// 1. Get all tasks (only return tasks for the current user)
app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });  // Get tasks for the current user
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// 2. Create a new task
app.post('/api/tasks', authenticate, async (req, res) => {
  const { title, status, priority, dueDate } = req.body;
  console.log('Creating task for user:', req.userId);  // Log the current user ID

  try {
    if (!title || !status) {
      return res.status(400).json({ error: 'Task title and status are required' });
    }

    // Create a task and associate it with the current user
    const newTask = await Task.create({ title, status, priority, dueDate, userId: req.userId });

    console.log('Task created:', newTask);  // Log the newly created task
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

// 3. Update a task
app.put('/api/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, dueDate } = req.body;

  try {
    const task = await Task.findOne({ where: { id, userId: req.userId } });  // Ensure only the user's own task can be updated
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task
    task.title = title;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;

    await task.save();  // Save the changes

    res.json(task);  // Return the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// 4. Delete a task
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ where: { id, userId: req.userId } });  // Ensure only the user's own task can be deleted
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// Sync database models and start the server
sequelize.sync({ alter: true })  // Ensure the database table structure is updated without dropping existing data
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });
