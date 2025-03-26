const express = require('express');
const router = express.Router();
const { 
  getStats, 
  findUnused, 
  deleteUnused, 
  runFullCleanup 
} = require('../controllers/cleanupController');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y privilegios de administrador
router.use(protect, admin);

// Rutas de limpieza
router.get('/stats', getStats);
router.get('/unused', findUnused);
router.post('/delete-unused', deleteUnused);
router.post('/full', runFullCleanup);

module.exports = router; 