import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, validateRegister } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', validateRegister, validate, registerUser);
router.post('/login', loginUser);

// Rutas protegidas
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

export default router; 