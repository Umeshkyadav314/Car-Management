import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register User
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    const token = sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user' });
  }
}

// Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in user' });
  }
}
