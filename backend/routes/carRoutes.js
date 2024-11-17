// backend/routes/carRoutes.js
import express from 'express';
import multer from 'multer';
import { createCar, getCars, getCar, updateCar, deleteCar } from '../controllers/carController.js';
import { verifyToken } from '../middleware/authMiddleware.js'; // To verify JWT token

const router = express.Router();

// Set up file upload
const upload = multer({ dest: 'uploads/' });

router.post('/cars', verifyToken, upload.array('images', 10), createCar);
router.get('/cars', verifyToken, getCars);
router.get('/cars/:id', verifyToken, getCar);
router.put('/cars/:id', verifyToken, updateCar);
router.delete('/cars/:id', verifyToken, deleteCar);

export default router;
