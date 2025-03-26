const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validate, validateRegister } = require('../middleware/validateMiddleware');

// Rutas públicas
router.post('/register', validateRegister, validate, registerUser);
router.post('/login', loginUser);

// Rutas protegidas
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);

module.exports = router; 