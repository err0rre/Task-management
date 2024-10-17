// src/health.js
export function healthCheck(req, res) {
    res.status(200).send('Frontend is healthy');
  }
  
  export function readyCheck(req, res) {
    res.status(200).send('Frontend is ready');
  }
  