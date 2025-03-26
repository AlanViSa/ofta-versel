const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const { validate, validateProduct } = require('../middleware/validateMiddleware');

// Rutas públicas
router.get('/', getProducts);
router.get('/:id', getProductById);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, validateProduct, validate, createProduct);
router.put('/:id', protect, admin, validateProduct, validate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router; 