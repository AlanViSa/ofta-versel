import express from 'express';
import { 
  getStatus, 
  updateTaskStatus, 
  runTask 
} from '../controllers/schedulerController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y privilegios de administrador
router.use(protect, admin);

// Rutas de tareas programadas
router.get('/status', getStatus);
router.put('/tasks/:taskName', updateTaskStatus);
router.post('/tasks/:taskName/run', runTask);

export default router; 