// backend/index.js
const express = require('express');
const cors = require('cors');
const Task = require('./models/Task');  // 导入 Task 模型

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

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
