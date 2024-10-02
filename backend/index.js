// backend/index.js
const express = require('express');
const cors = require('cors');
const Task = require('./models/Task');  // 导入 Task 模型

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
=======
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
    const user = await User.findOne({ where: { username } });
    if (!user || password !== user.password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // 生成 JWT 令牌
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
    return res.json({ token });  // 返回 token 给客户端
  } catch (error) {
    return res.status(500).json({ error: 'Login failed' });
  }
});



// 验证 JWT 中间件
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 获取 Bearer 后的 token 部分
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // 验证 JWT 令牌
  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Failed to authenticate token' });
    }
    req.userId = decoded.userId;  // 将用户 ID 存储到请求对象中
    next();
  });
};



>>>>>>> Stashed changes
// 根路径，处理 '/'
app.get('/', (req, res) => {
  res.send('Welcome to the Task Manager API! Try visiting /api/tasks to see the tasks.');
});

// API 路由

// 1. 获取所有任务
app.get('/api/tasks', async (req, res) => {
    try {
      const tasks = await Task.findAll();  // 尝试从数据库中获取任务
      res.json(tasks);  // 如果成功，返回任务列表
    } catch (error) {
      console.error('Error fetching tasks:', error.message);  // 在服务器日志中输出错误
      res.status(500).json({ error: 'Error fetching tasks' });  // 返回错误响应给客户端
    }
  });
  
  

// 2. 创建新任务
app.post('/api/tasks', async (req, res) => {
    try {
      console.log(req.body);  // 输出请求体内容，便于调试
      const { title, status } = req.body;
  
      if (!title || !status) {
        throw new Error('Task title and status are required');
      }
  
      // 创建任务
      const newTask = await Task.create({ title, status });
  
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  

// 3. 更新任务状态
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  // 确保打印接收到的 title 和 status
  console.log(`Received PUT request to update task with ID: ${id}`);
  console.log(`Title received: ${title}, Status received: ${status}`);

  try {
    const task = await Task.findByPk(id);
    if (task) {
      console.log(`Current task title: ${task.title}, Current task status: ${task.status}`);

      // 检查是否真正接收到更新的 title 值
      if (task.title !== title) {
        console.log(`Updating title from "${task.title}" to "${title}"`);
      }

      if (task.status !== status) {
        console.log(`Updating status from "${task.status}" to "${status}"`);
      }

      task.title = title;  // 设置 title
      task.status = status;  // 设置 status

      // 强制保存 title 和 status 字段
      await task.save({ fields: ['title', 'status'] });

      // 打印保存后的任务
      console.log('Task successfully saved to database:', task);
      res.json(task);  // 返回更新后的任务
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Error updating task' });
  }
});







// 4. 删除任务
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const task = await Task.findByPk(id);
    if (task) {
      await task.destroy();
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error deleting task' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
