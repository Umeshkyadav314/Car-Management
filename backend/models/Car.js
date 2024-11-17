// backend/models/Car.js
import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  car_type: { type: String, required: true },
  company: { type: String, required: true },
  dealer: { type: String, required: true },
  images: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Car = mongoose.model('Car', carSchema);
export default Car;
