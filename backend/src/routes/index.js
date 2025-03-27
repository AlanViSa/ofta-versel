import express from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import imageRoutes from './imageRoutes.js';
import cleanupRoutes from './cleanupRoutes.js';
import schedulerRoutes from './schedulerRoutes.js';

const router = express.Router();

// Rutas base
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/images', imageRoutes);
router.use('/cleanup', cleanupRoutes);
router.use('/scheduler', schedulerRoutes);

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

export default router; 