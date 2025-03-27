import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { validate, validateProduct } from '../middleware/validateMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, validateProduct, validate, createProduct);
router.put('/:id', protect, admin, validateProduct, validate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router; 