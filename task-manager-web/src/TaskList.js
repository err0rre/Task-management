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
      console.log('Tasks:', response.data);
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
        'Authorization': `Bearer ${token}`  // 添加 Authorization 头部
      }
    })
    .then(response => {
      setTasks([...tasks, response.data]);  // 将新任务添加到列表
      setNewTask('');  // 清空输入框
      setNewPriority(3);  // 重置优先级
      setNewDueDate('');  // 清空截止日期
    })
    .catch(error => {
      console.error("Error adding task:", error);
      setError('Failed to add task.');
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
          'Authorization': `Bearer ${token}`  // 在请求头中附加 JWT 令牌，添加 Bearer 前缀
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
        'Authorization': `Bearer ${token}`  // 注意这里传递了 Bearer 令牌
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
    setEditingTask(null);  // 关闭编辑弹窗
  };

  // 将任务按状态分类
  const pendingTasks = tasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));  // 按截止日期排序

  const completedTasks = tasks.filter(task => task.status === 'completed');

  // 返回优先级对应的类名
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1:
        return 'high';
      case 2:
        return 'medium';
      case 3:
        return 'low';
      default:
        return 'low';
    }
  };

  

  return (
    <div className="main-container">
     
      {/* 创建新任务 */}
      <div className="create-task">
        
        <form className="create-task-form">
          <div className="form-row">
            <div className="form-group title-group">
              <label htmlFor="new-task-title">Title</label>
              <input
                id="new-task-title"
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="e.g., Buy groceries"
              />
            </div>
            <div className="form-group small-group">
              <label htmlFor="new-task-priority">Priority</label>
              <select
                id="new-task-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(Number(e.target.value))}
              >
                <option value="" disabled>Select priority</option>
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
            <div className="form-group small-group">
              <label htmlFor="new-task-due-date">Due Date</label>
              <input
                id="new-task-due-date"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="form-group button-group">
              <button type="button" onClick={handleAddTask}>Create</button>
            </div>
          </div>
        </form>
      </div>


      

      {/* 如果有错误信息，显示错误 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
        {/* 未完成的任务 */}

      <h3>Pending Tasks</h3>
      <ul className="task-list pending">
        {pendingTasks.map(task => (
          <li
            key={task.id}
            className={`priority-${getPriorityClass(task.priority)}`}
          >
            <div className="task-date">
              {task.dueDate ? task.dueDate.split('T')[0] : 'N/A'}
            </div>
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              <div className="task-priority-icon"></div>
            </div>
            <div className="task-buttons">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {/* 完成的任务 */}
      <h3>Completed Tasks</h3>
      <ul className="task-list completed">
        {completedTasks.map(task => (
          <li
            key={task.id}
            className={`priority-${getPriorityClass(task.priority)}`}
          >
            <div className="task-date">
              {task.dueDate ? task.dueDate.split('T')[0] : 'N/A'}
            </div>
            <div className="task-info">
              <div className="task-title">{task.title}</div>
              <div className="task-priority-icon"></div>
            </div>
            <div className="task-buttons">
              <button onClick={() => handleEditTask(task)}>Edit</button>
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>



      {/* 未完成的任务和完成的任务容器 */}
      <div className="task-lists-container">

      </div>
      

      {/* 编辑任务的弹窗 */}
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