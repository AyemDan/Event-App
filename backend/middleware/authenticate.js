import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Middleware to verify token from cookies
export const verifyToken = (req, res, next) => {
  // Retrieve token from cookies
  const token = req.cookies?.authToken;  // Assuming the cookie is named 'token'
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided,denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user information to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to authorize based on user roles
export const authorize = (...roles) => {
    return (req, res, next) => {
      // Ensure the user is authenticated first
      const token = req.cookies?.authToken || req.header('Authorization')?.split(' ')[1]; // get token from cookies or Authorization header
  
      if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied' });
      }
  
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  // Attach decoded user to request object
  
        // Check if the user's role is in the allowed roles
        if (!roles.includes(req.user.role)) {
          return res.status(403).json({ message: 'Access denied' });
        }
  
        next();  // Proceed to the next middleware or route handler
      } catch (error) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
    };
  };