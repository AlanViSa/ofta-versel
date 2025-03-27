import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/fileMiddleware.js';
import {
  uploadImage,
  deleteImage,
  getImages,
  transformImage,
  applyImageEffects,
  createImageVariants,
  addWatermark,
  getTransformConfigs
} from '../controllers/imageController.js';

const router = express.Router();

// Rutas protegidas que requieren autenticación
router.use(protect);

// Rutas básicas
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:filename', deleteImage);
router.get('/', getImages);

// Rutas de transformación
router.post('/:publicId/transform', transformImage);
router.post('/:publicId/effects', applyImageEffects);
router.post('/:publicId/variants', createImageVariants);
router.post('/:publicId/watermark', addWatermark);
router.get('/transform-configs', getTransformConfigs);

export default router; 