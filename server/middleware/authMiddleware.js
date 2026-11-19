import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const authMiddleware = async (req, res, next) => {
  let token;
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    token = header.slice('Bearer '.length).trim();
  }
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const roleMiddleware = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ message: 'User no longer exists' });
      }
      const allowed = roles.map((role) => role.toLowerCase());
      if (!allowed.includes(user.role.toLowerCase())) {
        return res.status(403).json({ message: 'Permission denied' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
