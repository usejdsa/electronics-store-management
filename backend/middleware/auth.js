const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Read token from httpOnly cookie (preferred) OR Authorization header (fallback for tools/testing)
  const token = req.cookies?.accessToken
    || (req.headers['authorization']?.startsWith('Bearer ')
        ? req.headers['authorization'].split(' ')[1]
        : null);

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    // 401 so the frontend interceptor can trigger a silent refresh
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;