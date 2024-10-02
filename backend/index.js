// backend/index.js
// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
const Task = require('./models/Task');  // 导入 Task 模型
const User = require('./models/User');  // 导入 User 模型

const sequelize = require('./db');  // 导入 Sequelize 实例

const app = express();
const SECRET_KEY = 'my_jwt_secret_key';  // 用于签发 JWT 的密钥


// 中间件
app.use(cors());
app.use(express.json());

// 获取所有用户
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();  // 从数据库获取所有用户
    res.json(users);  // 返回用户列表
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Error fetching users' });
  }
});

// 获取单个用户
app.get('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);  // 根据 ID 查找用户
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);  // 返回用户信息
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Error fetching user' });
  }
});



// 用户注册 API
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  // console.log('Registering user:', username);
  
  try {
    // 检查是否已有用户
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // 密码加密
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    // console.log('Hashed password:', hashedPassword);

    // 创建用户
    // const user = await User.create({ username, password: hashedPassword, email });

    // 直接存储用户输入的密码，不再进行加密
    const user = await User.create({ username, password, email });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    // console.error('Error registering user:', error.message);
    res.status(500).json({ error: 'Error registering user' });
  }
});


// 用户登录
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt with username:', username);

  try {
    // 查询用户
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 验证密码（如果不使用加密则直接比较）
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 在用户登录成功后，生成 JWT 令牌
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    
    // 返回 JWT 令牌
    res.json({ token });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });


  
  //   console.log('User found, stored hashed password:', user.password);  // 输出数据库中的加密密码
    
  //   // 验证密码是否匹配
  //   const isMatch = await bcrypt.compare(password, user.password);
  //   console.log('Password match:', isMatch);  // 输出是否匹配
  //   if (!isMatch) {
  //     return res.status(401).json({ error: 'Invalid username or password' });
  //   }

  //   // 生成 JWT
  //   const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
  //   res.json({ token });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  }
});



// 验证 JWT 中间件
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];  // 获取 Bearer token 后的部分
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;  // 将用户 ID 附加到请求对象
    next();
  });
};


// 根路径，处理 '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API! Try visiting /api/tasks to see the tasks.');
});

// 1. 获取所有任务（只返回当前用户的任务）
app.get('/api/tasks', authenticate, async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.userId } });  // 获取当前用户的任务
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// 2. 创建新任务
app.post('/api/tasks', authenticate, async (req, res) => {
  const { title, status, priority, dueDate } = req.body;
  console.log('Creating task for user:', req.userId);  // 打印当前用户 ID
  
  try {
    if (!title || !status) {
      return res.status(400).json({ error: 'Task title and status are required' });
    }

    // 创建任务，并将其与当前用户关联
    const newTask = await Task.create({ title, status, priority, dueDate, userId: req.userId });

    console.log('Task created:', newTask);  // 打印新创建的任务
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});


// 3. 更新任务
app.put('/api/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, dueDate } = req.body;

  try {
    const task = await Task.findOne({ where: { id, userId: req.userId } });  // 确保只能更新自己的任务
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // 更新任务
    task.title = title;
    task.status = status;
    task.priority = priority;
    task.dueDate = dueDate;

    await task.save();  // 保存修改

    res.json(task);  // 返回更新后的任务
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});

// 4. 删除任务
app.delete('/api/tasks/:id', authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findOne({ where: { id, userId: req.userId } });  // 确保只能删除自己的任务
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// 同步数据库模型并启动服务器
sequelize.sync({ alter: true })  // 确保数据库表结构被更新而不会删除已有数据
  .then(() => {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error synchronizing the database:', err);
  });
