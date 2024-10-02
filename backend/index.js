// backend/index.js
const express = require('express');
const cors = require('cors');
const Task = require('./models/Task');  // 导入 Task 模型
const User = require('./models/User');

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
    const tasks = await Task.findAll();  // 获取所有任务
    res.json(tasks);  // 返回包含新字段的任务列表
  } catch (error) {
    console.error('Error fetching tasks:', error.message);  // 输出错误
    res.status(500).json({ error: 'Error fetching tasks' });  // 返回错误响应
  }
});

  
  

// 2. 创建新任务
app.post('/api/tasks', async (req, res) => {
  const { title, status, priority, dueDate } = req.body;  // 接收前端的字段
  try {
    console.log(req.body);  // 输出请求体内容，便于调试

    if (!title || !status) {
      throw new Error('Task title and status are required');
    }

    // 创建任务，包括新字段 priority 和 dueDate
    const newTask = await Task.create({ title, status, priority, dueDate });

    res.status(201).json(newTask);  // 返回新创建的任务
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
});

  
  

// 3. 更新任务状态
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status, priority, dueDate } = req.body;  // 新增 priority 和 dueDate

  console.log(`Received PUT request to update task with ID: ${id}`);
  console.log(`Title received: ${title}, Status received: ${status}, Priority: ${priority}, DueDate: ${dueDate}`);

  try {
    const task = await Task.findByPk(id);
    if (task) {
      // 打印当前任务信息
      console.log(`Current task title: ${task.title}, Current task status: ${task.status}`);

      // 更新任务的 title、status、priority、dueDate
      task.title = title;
      task.status = status;
      task.priority = priority;
      task.dueDate = dueDate;

      await task.save();  // 保存修改

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
