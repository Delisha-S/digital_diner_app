// middleware/auth.js - basic JWT auth middleware (optional)
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Missing Authorization header' } });
  }
  const [, token] = header.split(' ');
  if (!token) return res.status(401).json({ error: { code: 'unauthorized', message: 'Malformed Authorization header' } });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'unauthorized', message: 'Invalid token' } });
  }
};
