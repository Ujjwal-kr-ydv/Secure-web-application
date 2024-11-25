const jwt = require('jsonwebtoken');

const userAgentMiddleware = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  const routePath = req.path;

  if (routePath.startsWith('/api/public') && userAgent !== 'Dart') {
    return res.status(403).json({ error: 'Forbidden: User-agent must be Dart' });
  }

  if (routePath.startsWith('/api/fetch/users/') && userAgent !== 'Dart') {
    return res.status(403).json({ error: 'Forbidden: User-agent must be Dart' });
  }

  if (routePath.startsWith('/api/users') && userAgent !== 'Dart') {
    return res.status(403).json({ error: 'Forbidden: User-agent must be Dart' });
  }

  if (routePath.startsWith('/api/users/') && userAgent === 'Dart') {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
  }

  // If the route is not '/api/public' or '/api/fetch/users/', proceed without restriction
  return next();
};

module.exports = userAgentMiddleware;
