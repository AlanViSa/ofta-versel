const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointmentController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, validateAppointment } = require('../middleware/validateMiddleware');

// Rutas públicas
router.post('/', validateAppointment, validate, createAppointment);

// Rutas protegidas
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, admin, validateAppointment, validate, updateAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

module.exports = router; 