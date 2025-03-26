const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida']
  },
  price: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    enum: ['gafas', 'lentes_contacto', 'accesorios']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo']
  },
  images: [{
    type: String,
    required: [true, 'Al menos una imagen es requerida']
  }],
  specifications: {
    brand: String,
    model: String,
    material: String,
    color: String,
    prescription: {
      type: Boolean,
      default: false
    }
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para mejorar el rendimiento de las búsquedas
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 