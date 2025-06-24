const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ msg: 'Access Denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // userId & role will be here
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
