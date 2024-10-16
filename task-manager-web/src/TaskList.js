// src/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);  // 任务列表
  const [newTask, setNewTask] = useState('');  // 新任务标题
  const [newPriority, setNewPriority] = useState(3);  // 新任务优先级
  const [newDueDate, setNewDueDate] = useState('');  // 新任务截止日期
  const [editingTask, setEditingTask] = useState(null);  // 当前正在编辑的任务
  const [editedTaskTitle, setEditedTaskTitle] = useState('');  // 编辑任务的标题
  const [editedTaskStatus, setEditedTaskStatus] = useState('pending');  // 编辑任务的状态
  const [editedTaskPriority, setEditedTaskPriority] = useState(3);  // 编辑任务的优先级
  const [editedTaskDueDate, setEditedTaskDueDate] = useState('');  // 编辑任务的截止日期
  const [error, setError] = useState('');  // 错误状态
  const [filter, setFilter] = useState('all');  // 用来存储当前的筛选条件
  const [searchTerm, setSearchTerm] = useState(''); // 存储搜索关键字

  // 获取 JWT 令牌
  const token = localStorage.getItem('token');

  // 获取任务列表
  useEffect(() => {
    if (!token) {
      setError('Please log in to view tasks.');
      return;
    }
  
    axios.get('http://localhost:4000/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`  // 在请求头中附带 JWT 令牌
      }
    })
    .then(response => {
      setTasks(response.data);  // 设置任务列表
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
      setError('Failed to fetch tasks. Please check if you are logged in.');
    });
  }, [token]);

  // 创建新任务
  const handleAddTask = () => {
    if (!token) {
      setError('Please log in to add tasks.');
      return;
    }
    axios.post('http://localhost:4000/api/tasks', { 
      title: newTask, 
      status: 'pending', 
      priority: newPriority, 
      dueDate: newDueDate 
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setTasks([...tasks, response.data]);  // 更新任务列表
      setNewTask('');  // 清空表单
      setNewPriority(3);
      setNewDueDate('');
    })
    .catch(error => {
      console.error("Error adding task:", error);
      setError('Failed to add task. Make sure all fields are filled.');
    });
  };

  // 编辑任务
  const handleEditTask = (task) => {
    setEditingTask(task);  // 设置当前编辑的任务
    setEditedTaskTitle(task.title);  // 设置任务标题到输入框
    setEditedTaskStatus(task.status);  // 设置任务状态到下拉菜单
    setEditedTaskPriority(task.priority);  // 设置优先级
    setEditedTaskDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');  // 设置截止日期
  };

  // 提交编辑
  const handleUpdateTask = () => {
    if (editingTask) {
      axios.put(`http://localhost:4000/api/tasks/${editingTask.id}`, {
        title: editedTaskTitle,
        status: editedTaskStatus,
        priority: editedTaskPriority,
        dueDate: editedTaskDueDate,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const updatedTasks = tasks.map(task =>
          task.id === editingTask.id ? { ...task, ...response.data } : task
        );
        setTasks(updatedTasks);  // 更新任务列表
        setEditingTask(null);  // 关闭编辑窗口
      })
      .catch(error => {
        console.error('Error updating task:', error);
        setError('Failed to update task.');
      });
    }
  };

  // 删除任务
  const handleDeleteTask = (id) => {
    axios.delete(`http://localhost:4000/api/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      const remainingTasks = tasks.filter(task => task.id !== id);
      setTasks(remainingTasks);  // 更新任务列表
    })
    .catch(error => {
      console.error("Error deleting task:", error);
      setError('Failed to delete task.');
    });
  };

  // 关闭编辑弹窗
  const handleCloseModal = () => {
    setEditingTask(null);  // 将当前编辑的任务设为 null，以关闭弹窗
  };

  // 筛选和搜索的逻辑
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'completed') {
        return task.status === 'completed';
      } else if (filter === 'pending') {
        return task.status === 'pending';
      } else if (filter === 'highPriority') {
        return task.priority === 1;
      } else if (filter === 'mediumPriority') {
        return task.priority === 2;
      } else if (filter === 'lowPriority') {
        return task.priority === 3;
      }
      return true;
    })
    .filter(task => {
      if (searchTerm === '') return true;
      return task.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

  // 将任务按状态分类
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');

  // 动态返回优先级的类名
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1:
        return 'priority-high';  // 高优先级
      case 2:
        return 'priority-medium';  // 中优先级
      case 3:
        return 'priority-low';  // 低优先级
      default:
        return '';
    }
  };

  return (
    <div className="main-container">
      {/* Create new task */}
      <div className="create-task">
        <h3>Create a New Task</h3>
        <form className="create-task-form">
          <div className="form-group">
            <label htmlFor="new-task-title">Title</label>
            <input
              id="new-task-title"
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="e.g., Buy groceries"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="new-task-priority">Priority</label>
            <select
              id="new-task-priority"
              value={newPriority}
              onChange={(e) => setNewPriority(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select priority</option>
              <option value={1}>High</option>
              <option value={2}>Medium</option>
              <option value={3}>Low</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="new-task-due-date">Due Date</label>
            <input
              id="new-task-due-date"
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
          <button type="button" onClick={handleAddTask}>Create</button>
        </form>
      </div>
  
      {/* Filter and search */}
      <div className="filter-container">
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All Tasks</option>
          <option value="completed">Completed Tasks</option>
          <option value="pending">Pending Tasks</option>
          <option value="highPriority">High Priority</option>
          <option value="mediumPriority">Medium Priority</option>
          <option value="lowPriority">Low Priority</option>
        </select>
  
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
  
      {/* Pending tasks */}
      <h3>Pending Tasks</h3>
      <ul className="task-list pending">
        {pendingTasks.map(task => (
          <li key={task.id} className={`task-item ${getPriorityClass(task.priority)}`}>
            <div className="task-info">
              <span className="task-title">{task.title}</span>
            </div>
            <div className="task-buttons">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Completed tasks */}
      <h3>Completed Tasks</h3>
      <ul className="task-list completed">
        {completedTasks.map(task => (
          <li key={task.id} className={`task-item ${getPriorityClass(task.priority)}`}>
            <div className="task-title">{task.title}</div>
            <div className="task-buttons">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

  
      {/* Modal for editing task */}
      {editingTask && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Task</h3>
            <form className="modal-form">
              <div className="form-group">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  type="text"
                  value={editedTaskTitle}
                  onChange={(e) => setEditedTaskTitle(e.target.value)}
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select
                  id="task-status"
                  value={editedTaskStatus}
                  onChange={(e) => setEditedTaskStatus(e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={editedTaskPriority}
                  onChange={(e) => setEditedTaskPriority(Number(e.target.value))}
                >
                  <option value={1}>High</option>
                  <option value={2}>Medium</option>
                  <option value={3}>Low</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-due-date">Due Date</label>
                <input
                  id="task-due-date"
                  type="date"
                  value={editedTaskDueDate}
                  onChange={(e) => setEditedTaskDueDate(e.target.value)}
                />
              </div>
              <div className="modal-buttons">
                <button type="button" onClick={handleUpdateTask}>Save</button>
                <button type="button" onClick={handleCloseModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
  
}

export default TaskList;

