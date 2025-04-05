import cloudinary from '../config/cloudinary.js';

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
export const generateOptimizedUrl = (publicId, config = 'product') => {
  const options = imageConfigs[config] || imageConfigs.product;
  return cloudinary.url(publicId, options);
};

// @desc    Generar URLs para todos los tamaños de una imagen
export const generateAllImageUrls = (publicId) => {
  return {
    thumbnail: generateOptimizedUrl(publicId, 'thumbnail'),
    product: generateOptimizedUrl(publicId, 'product'),
    gallery: generateOptimizedUrl(publicId, 'gallery'),
    original: generateOptimizedUrl(publicId, 'original')
  };
};

// @desc    Optimizar imagen existente
export const optimizeImage = async (publicId, options = {}) => {
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

// @desc    Verificar si una imagen existe en Cloudinary
export const checkImageExists = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return result;
  } catch (error) {
    if (error.message.includes('No such file')) {
      return null;
    }
    throw error;
  }
};

// @desc    Aplicar transformaciones a una imagen
export const applyTransformations = async (publicId, transformations) => {
  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      transformation: transformations
    });
    return result;
  } catch (error) {
    throw new Error(`Error al aplicar transformaciones: ${error.message}`);
  }
};

// @desc    Aplicar efectos a una imagen
export const applyEffects = async (publicId, effects) => {
  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      effect: effects
    });
    return result;
  } catch (error) {
    throw new Error(`Error al aplicar efectos: ${error.message}`);
  }
}; 