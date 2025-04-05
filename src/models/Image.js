const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'Filename is required']
  },
  url: {
    type: String,
    required: [true, 'URL is required']
  },
  size: {
    type: Number,
    required: [true, 'File size is required']
  },
  format: {
    type: String,
    required: [true, 'File format is required'],
    enum: ['jpeg', 'jpg', 'png', 'gif', 'webp']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índices
imageSchema.index({ createdAt: 1 });

// Método para transformar la imagen a formato de respuesta
imageSchema.methods.toResponse = function() {
  return {
    id: this._id,
    name: this.filename,
    url: this.url,
    size: this.size
  };
};

// Método estático para obtener todas las imágenes en formato de respuesta
imageSchema.statics.getAllImages = async function() {
  const images = await this.find();
  return images.map(image => image.toResponse());
};

// Método estático para limpiar imágenes antiguas
imageSchema.statics.cleanupOldImages = function(days) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return this.deleteMany({
    createdAt: { $lt: cutoffDate }
  });
};

const Image = mongoose.model('Image', imageSchema);

module.exports = Image; 