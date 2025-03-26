const cloudinary = require('../config/cloudinary');

// Configuraciones predefinidas para diferentes tipos de imágenes
const imageConfigs = {
  thumbnail: {
    width: 150,
    height: 150,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  product: {
    width: 800,
    height: 800,
    crop: 'limit',
    quality: 'auto',
    fetch_format: 'auto'
  },
  gallery: {
    width: 1200,
    height: 800,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto'
  },
  original: {
    quality: 'auto',
    fetch_format: 'auto'
  }
};

// @desc    Generar URL optimizada para una imagen
const generateOptimizedUrl = (publicId, config = 'product') => {
  const options = imageConfigs[config] || imageConfigs.product;
  return cloudinary.url(publicId, options);
};

// @desc    Generar URLs para todos los tamaños de una imagen
const generateAllImageUrls = (publicId) => {
  return {
    thumbnail: generateOptimizedUrl(publicId, 'thumbnail'),
    product: generateOptimizedUrl(publicId, 'product'),
    gallery: generateOptimizedUrl(publicId, 'gallery'),
    original: generateOptimizedUrl(publicId, 'original')
  };
};

// @desc    Optimizar imagen existente
const optimizeImage = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      ...options
    });
    return result;
  } catch (error) {
    throw new Error(`Error al optimizar imagen: ${error.message}`);
  }
};

// @desc    Verificar si una imagen existe
const checkImageExists = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateOptimizedUrl,
  generateAllImageUrls,
  optimizeImage,
  checkImageExists,
  imageConfigs
}; 