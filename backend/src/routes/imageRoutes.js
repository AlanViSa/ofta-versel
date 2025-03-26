const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/fileMiddleware');
const {
  uploadImage,
  deleteImage,
  getImages,
  transformImage,
  applyImageEffects,
  createImageVariants,
  addWatermark,
  getTransformConfigs
} = require('../controllers/imageController');

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

module.exports = router; 