//middlewares/auth.js
const jwt = require('jsonwebtoken');

// JWT 验证中间件
function authenticateToken(req, res, next) {
  // 获取 Authorization 头并解析 Bearer token
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];  // Bearer token 格式
  
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  try {
    // 使用环境变量中的 JWT 密钥解码 token
    const verified = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');  // 使用环境变量存储密钥
    req.user = verified;  // 将解码后的用户信息存储在请求对象中
    next();  // 继续执行后续中间件或路由处理程序
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
