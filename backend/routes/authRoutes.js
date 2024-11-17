import express from "express";
import {register,  login } from "../controllers/userController.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
  
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });
  
      res.status(201).json({ token });
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ message: 'Registration failed. Please try again.' });
    }
  });

// User Login Route
router.post("/login", login);

export default router;
