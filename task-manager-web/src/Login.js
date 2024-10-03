//src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // 引入自定义的 CSS 文件

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');  // 注册时使用的 email
  const [isRegistering, setIsRegistering] = useState(false);  // 用来切换登录和注册
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // 添加加载状态

  // 处理登录
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);  // 开始加载
    axios.post('http://localhost:4000/api/login', { username, password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);  // 将 token 存储在 localStorage
        localStorage.setItem('username', username);  // 存储用户名
        onLogin();  // 登录成功后的回调
      })
      .catch(() => {
        setError('Invalid username or password');
      })
      .finally(() => {
        setLoading(false);  // 结束加载
      });
  };

  // 处理注册
  const handleRegister = () => {
    if (!username || !password || !email) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);  // 开始加载
    axios.post('http://localhost:4000/api/register', { username, password, email })
      .then(() => {
        setIsRegistering(false);  // 注册成功后切换回登录页面
        setError('');  // 清空错误信息
      })
      .catch(() => {
        setError('Registration failed. Please try again.');
      })
      .finally(() => {
        setLoading(false);  // 结束加载
      });
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {isRegistering && (
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input-field"
        />
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="input-field"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="input-field"
      />

      {/* 根据 isRegistering 状态显示注册或登录按钮 */}
      {isRegistering ? (
        <>
          <button className="btn" onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p>
            Already have an account?{' '}
            <button className="toggle-btn" onClick={() => setIsRegistering(false)}>
              Login here
            </button>
          </p>
        </>
      ) : (
        <>
          <button className="btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <p>
            Don't have an account?{' '}
            <button className="toggle-btn" onClick={() => setIsRegistering(true)}>
              Register here
            </button>
          </p>
        </>
      )}

      {/* 显示错误信息 */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;


