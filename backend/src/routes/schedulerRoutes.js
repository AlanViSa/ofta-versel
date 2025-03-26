const express = require('express');
const router = express.Router();
const { 
  getStatus, 
  updateTaskStatus, 
  runTask 
} = require('../controllers/schedulerController');
const { protect, admin } = require('../middleware/authMiddleware');

// Todas las rutas requieren autenticación y privilegios de administrador
router.use(protect, admin);

// Rutas de tareas programadas
router.get('/status', getStatus);
router.put('/tasks/:taskName', updateTaskStatus);
router.post('/tasks/:taskName/run', runTask);

module.exports = router; 