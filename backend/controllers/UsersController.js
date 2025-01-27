import User from '../models/user.js';
import generateUserToken from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

class UserController {
  // Register a new user
  static async register(req, res) {
    try {
      const { name, email, password, role } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already in use' });

      // Create a new user
      const user = new User({ name, email, password, role });
      await user.save();

      const token = generateUserToken(user);
      res.cookie('authToken', token, { httpOnly: true });
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Log in a user
  static async login(req, res) {
    try {
      const tokenExists = req.cookies?.authToken;
      if (tokenExists) {
        // If tokenExists already exists, verify it
        try {
          const decoded = jwt.verify(tokenExists, process.env.JWT_SECRET);
          return res.status(200).json({
            message: 'You are already logged in',
            user: decoded,  // Optionally send user data if you want
          });
        } catch (err) {
          // If token is invalid, proceed to login flow
          console.error('Invalid token, user needs to log in again');
        }
      }
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid email or password' });

      // Compare passwords
      const isMatch = await user.comparePassword(password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

      // Generate JWT
      const token = generateUserToken(user);
      res.cookie('authToken', token, { httpOnly: true });

      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async logout(req, res) {
    try {
      res.clearCookie('authToken');  // Clear the authToken cookie
      res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  
}
}

export default UserController;
