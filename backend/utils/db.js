import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Replace with your actual MongoDB URI (stored in .env file)
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit the process if the connection fails
  }
};

export default connectDB; // Make sure to export the connectDB function
