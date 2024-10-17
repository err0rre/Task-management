//src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';  // Import custom CSS file

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');  // Email used during registration
  const [isRegistering, setIsRegistering] = useState(false);  // Toggle between login and registration
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state

  // Helper function to validate email format
  const isValidEmail = (email) => {
    return email.includes('@');  // Only checks if '@' is included
  };

  // Handle login
  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    setLoading(true);  // Start loading
    axios.post('http://localhost:4000/api/login', { username, password })
      .then(response => {
        const token = response.data.token;
        localStorage.setItem('token', token);  // Store token in localStorage
        localStorage.setItem('username', username);  // Store username
        onLogin();  // Callback after successful login
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setError('Invalid username or password');  // Invalid login information
        } else {
          setError('An error occurred. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);  // End loading
      });
  };

  // Handle registration
  const handleRegister = () => {
    if (!username || !password || !email) {
      setError('Please fill in all fields.');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);  // Start loading
    axios.post('http://localhost:4000/api/register', { username, password, email })
      .then(() => {
        setIsRegistering(false);  // Switch back to login page after successful registration
        setError('');  // Clear error message
      })
      .catch((error) => {
        console.error('Error response:', error.response);  // Log error response

        if (error.response && error.response.data) {
          const errorMsg = error.response.data.error || 'Registration failed. Please try again.';

          // Check if it is the "Username or email already exists" error
          if (errorMsg.includes('Username or email already exists')) {
            setError('Username or email already exists.');
          } else {
            setError(errorMsg);  // Otherwise, show the specific error from the backend
          }
        } else {
          setError('An error occurred. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);  // End loading
      });
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? 'Register' : 'Login'}</h2>

      {isRegistering && (
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');  // Clear error when typing
          }}
          placeholder="Email"
          className="input-field"
        />
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          setError('');  // Clear error when typing
        }}
        placeholder="Username"
        className="input-field"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError('');  // Clear error when typing
        }}
        placeholder="Password"
        className="input-field"
      />

      {/* Show register or login button based on isRegistering state */}
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

      {/* Show error message */}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;







