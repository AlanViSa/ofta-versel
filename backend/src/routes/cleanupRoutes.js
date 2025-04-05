import express from 'express';
import { 
  getStats, 
  findUnused, 
  deleteUnused, 
  runFullCleanup 
} from '../controllers/cleanupController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación y privilegios de administrador
router.use(protect, admin);

// Rutas de limpieza
router.get('/stats', getStats);
router.get('/unused', findUnused);
router.post('/delete-unused', deleteUnused);
router.post('/full', runFullCleanup);

export default router; 