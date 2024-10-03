// src/App.js
import React, { useState } from 'react';
import TaskList from './TaskList';
import Login from './Login';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const username = localStorage.getItem('username');  // 假设登录时存储了用户名

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1 className="app-title">Task Management System</h1>
          {isLoggedIn && (
            <div className="user-info">
              <span className="username">Hello, {username}</span>
              <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      </header>
      <main className="App-main">
        {isLoggedIn ? (
          <>
            <TaskList />
          </>
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </main>
    </div>
  );
}

export default App;

