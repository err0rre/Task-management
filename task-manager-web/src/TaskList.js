// src/TaskList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TaskList() {
  const [tasks, setTasks] = useState([]);  // Task list
  const [newTask, setNewTask] = useState('');  // New task title
  const [newPriority, setNewPriority] = useState(3);  // New task priority
  const [newDueDate, setNewDueDate] = useState('');  // New task due date
  const [editingTask, setEditingTask] = useState(null);  // Currently editing task
  const [editedTaskTitle, setEditedTaskTitle] = useState('');  // Title of the task being edited
  const [editedTaskStatus, setEditedTaskStatus] = useState('pending');  // Status of the task being edited
  const [editedTaskPriority, setEditedTaskPriority] = useState(3);  // Priority of the task being edited
  const [editedTaskDueDate, setEditedTaskDueDate] = useState('');  // Due date of the task being edited
  const [errorMessage, setErrorMessage] = useState('');  // General error message

  const [error, setError] = useState('');  // State to store global errors
  const [filter, setFilter] = useState('all');  // Store the current filter condition
  const [searchTerm, setSearchTerm] = useState(''); // Store the search keyword

  // Get JWT token
  const token = localStorage.getItem('token');

  // Fetch task list
  useEffect(() => {
    if (!token) {
      setError('Please log in to view tasks.');
      return;
    }
  
    axios.get('http://34.41.207.44:4000/api/tasks', {
      headers: {
        'Authorization': `Bearer ${token}`  // Include JWT token in request header
      }
    })
    .then(response => {
      setTasks(response.data);  // Set task list
    })
    .catch(error => {
      console.error("Error fetching tasks:", error);
      setError('Failed to fetch tasks. Please check if you are logged in.');
    });
  }, [token]);

  // Validate form input
  const validateForm = () => {
    if (!newTask || !newPriority || !newDueDate) {
      // Ensure errorMessage is a string, not an object
      setErrorMessage('Please fill in all required fields.');
      return false;
    }
    setErrorMessage('');  // Clear error if all fields are filled
    return true;
  };

  // Create a new task
  const handleAddTask = () => {
    if (!validateForm()) return;  // If form validation fails, do not proceed
    const token = localStorage.getItem('token');  // Get token

    if (!token) {
      setError('Please log in to add tasks.');
      return;
    }
    axios.post('http://34.41.207.44:4000/api/tasks', { 
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
      setTasks([...tasks, response.data]);  // Update task list
      setNewTask('');  // Clear form
      setNewPriority('');
      setNewDueDate('');
      setErrorMessage('');  // Clear error message after successful creation
    })
    .catch(error => {
      console.error("Error adding task:", error);
      setErrorMessage('Failed to add task. Make sure all fields are filled.');
    });
  };

  // Edit task
  const handleEditTask = (task) => {
    setEditingTask(task);  // Set the current task being edited
    setEditedTaskTitle(task.title);  // Set task title in input field
    setEditedTaskStatus(task.status);  // Set task status in dropdown
    setEditedTaskPriority(task.priority);  // Set priority
    setEditedTaskDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');  // Set due date
  };

  // Submit edit
  const handleUpdateTask = () => {
    if (editingTask) {
      axios.put(`http://34.41.207.44:4000/api/tasks/${editingTask.id}`, {
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
        setTasks(updatedTasks);  // Update task list
        setEditingTask(null);  // Close edit modal
      })
      .catch(error => {
        console.error('Error updating task:', error);
        setError('Failed to update task.');
      });
    }
  };

  // Delete task
  const handleDeleteTask = (id) => {
    axios.delete(`http://34.41.207.44:4000/api/tasks/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      const remainingTasks = tasks.filter(task => task.id !== id);
      setTasks(remainingTasks);  // Update task list
    })
    .catch(error => {
      console.error("Error deleting task:", error);
      setError('Failed to delete task.');
    });
  };

  // Close edit modal
  const handleCloseModal = () => {
    setEditingTask(null);  // Set the current editing task to null to close the modal
  };

  // Logic for filtering and searching tasks
  const filteredTasks = tasks
    .filter(task => {
      if (filter === 'highPriority') {
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

  // Categorize and sort tasks by status and due date
  const pendingTasks = filteredTasks
    .filter(task => task.status === 'pending')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));  // Sort pending tasks by due date (closest first)

  const completedTasks = filteredTasks
    .filter(task => task.status === 'completed')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));  // Sort completed tasks by due date (closest first)

  // Dynamically return class names for task priority
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 1:
        return 'priority-high';  // High priority
      case 2:
        return 'priority-medium';  // Medium priority
      case 3:
        return 'priority-low';  // Low priority
      default:
        return '';
    }
  };


  return (
    <div className="main-container">
      <div className="create-task">
        <h3>Create a New Task</h3>
        <form className="create-task-form">
          <div className="form-group">
            <label htmlFor="new-task-title">Title</label>
            <input
              id="new-task-title"
              type="text"
              value={newTask}
              onChange={(e) => {
                setNewTask(e.target.value);
                setErrorMessage('');  // Clear error when typing
              }}
              placeholder="e.g., Buy groceries"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="new-task-priority">Priority</label>
            <select
              id="new-task-priority"
              value={newPriority}
              onChange={(e) => {
                setNewPriority(Number(e.target.value));
                setErrorMessage('');  // Clear error when selecting
              }}
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
              onChange={(e) => {
                setNewDueDate(e.target.value);
                setErrorMessage('');  // Clear error when selecting date
              }}
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <button type="button" onClick={handleAddTask}>Create</button>
        </form>

        {/* Display general error message below the form */}
        {errorMessage && <p className="error-message" >{errorMessage}</p>}
      </div>

  
      {/* Filter and search */}
      <div className="filter-container">
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="all">All Tasks</option>
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
              <span className="task-date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
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
            <div className="task-info">
              <span className="task-title">{task.title}</span>
              <span className="task-date">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
            </div>
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
