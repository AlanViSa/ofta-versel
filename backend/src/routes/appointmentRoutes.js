import express from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment
} from '../controllers/appointmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate, validateAppointment } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/', validateAppointment, validate, createAppointment);

// Rutas protegidas
router.get('/', protect, getAppointments);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, admin, validateAppointment, validate, updateAppointment);
router.put('/:id/cancel', protect, cancelAppointment);

export default router; 