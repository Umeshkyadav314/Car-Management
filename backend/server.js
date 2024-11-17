import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import carRoutes from './routes/carRoutes.js';
import authRoutes from './routes/authRoutes.js'
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// Routes
app.use('/api/users',authRoutes );
app.use('/api', carRoutes);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
