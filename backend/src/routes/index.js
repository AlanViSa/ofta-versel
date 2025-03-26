const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const imageRoutes = require('./imageRoutes');
const cleanupRoutes = require('./cleanupRoutes');
const schedulerRoutes = require('./schedulerRoutes');

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

module.exports = router; 