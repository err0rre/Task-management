//middlewares/auth.js
const jwt = require('jsonwebtoken');

// JWT authentication middleware
function authenticateToken(req, res, next) {
  // Retrieve Authorization header and extract the Bearer token
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];  // Bearer token format
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    // Decode the token using the JWT secret from the environment variables
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');  // Use environment variables to store the secret
    req.user = verified;  // Store the decoded user information in the request object
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token' });
    } else {
      return res.status(400).json({ error: 'Token validation failed' });
    }
  }
}

module.exports = authenticateToken;

