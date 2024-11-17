// backend/controllers/carController.js
import Car from '../models/Car.js';
import cloudinary from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export const createCar = async (req, res) => {
  try {
    const { title, description, car_type, company, dealer } = req.body;
    const images = [];

    if (req.files) {
      for (const file of req.files) {
        const result = await cloudinary.v2.uploader.upload(file.path);
        images.push(result.secure_url);
      }
    }

    const car = new Car({
      title,
      description,
      car_type,
      company,
      dealer,
      images,
      userId: req.userId,
    });

    await car.save();
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create car' });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ userId: req.userId });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve cars' });
  }
};

export const getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve car' });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update car' });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.status(200).json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete car' });
  }
};
