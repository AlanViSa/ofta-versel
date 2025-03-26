import Image from '../models/imageModel';
import { imageService } from '../services/imageService';
const cloudinary = require('../config/cloudinary');
const { 
  generateAllImageUrls, 
  optimizeImage, 
  checkImageExists,
  imageConfigs 
} = require('../utils/imageUtils');
const {
  getImageUrlsFromCache,
  setImageUrlsInCache,
  getImageListFromCache,
  setImageListInCache,
  getImageExistsFromCache,
  setImageExistsInCache,
  invalidateImageCache
} = require('../utils/cacheUtils');
const { 
  applyTransformations, 
  applyEffects, 
  createVariants, 
  applyWatermark,
  transformConfigs 
} = require('../utils/imageTransformUtils');

// Constantes para validaciones
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// @desc    Subir una imagen
// @route   POST /api/images/upload
// @access  Private
const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        error: 'No se ha subido ningún archivo' 
      });
    }

    // Validación de tipo de archivo
    if (!ALLOWED_TYPES.includes(req.file.mimetype)) {
      return res.status(400).json({ 
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WEBP' 
      });
    }

    // Validación de tamaño
    if (req.file.size > MAX_FILE_SIZE) {
      return res.status(400).json({ 
        error: 'El archivo excede el tamaño máximo permitido (5MB)' 
      });
    }

    const image = await imageService.uploadImage(req.file);
    res.status(201).json(image);
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar una imagen
// @route   DELETE /api/images/:id
// @access  Private
const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Se requiere el ID de la imagen' 
      });
    }

    await imageService.deleteImage(id);
    res.status(200).json({ 
      message: 'Imagen eliminada correctamente' 
    });
  } catch (error) {
    if (error.message === 'Image not found') {
      return res.status(404).json({ 
        error: 'Imagen no encontrada' 
      });
    }
    next(error);
  }
};

// @desc    Obtener todas las imágenes
// @route   GET /api/images
// @access  Private
const getAllImages = async (req, res, next) => {
  try {
    const images = await imageService.getAllImages();
    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

// @desc    Transformar una imagen
// @route   POST /api/images/:id/transform
// @access  Private
const transformImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const transformations = req.body;

    if (!id) {
      return res.status(400).json({ 
        error: 'Se requiere el ID de la imagen' 
      });
    }

    // Validar que solo se incluyan transformaciones permitidas
    const allowedTransformations = ['width', 'height'];
    const receivedTransformations = Object.keys(transformations);
    
    const invalidTransformations = receivedTransformations.filter(
      key => !allowedTransformations.includes(key)
    );

    if (invalidTransformations.length > 0) {
      return res.status(400).json({ 
        error: 'Solo se permiten transformaciones de ancho y alto',
        invalidTransformations 
      });
    }

    // Validar que los valores sean números positivos
    if (transformations.width && (isNaN(transformations.width) || transformations.width <= 0)) {
      return res.status(400).json({ 
        error: 'El ancho debe ser un número positivo' 
      });
    }

    if (transformations.height && (isNaN(transformations.height) || transformations.height <= 0)) {
      return res.status(400).json({ 
        error: 'El alto debe ser un número positivo' 
      });
    }

    const result = await imageService.transformImage(id, transformations);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Image not found') {
      return res.status(404).json({ 
        error: 'Imagen no encontrada' 
      });
    }
    next(error);
  }
};

// @desc    Aplicar efectos a una imagen
// @route   POST /api/images/:publicId/effects
// @access  Private
const applyImageEffects = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { effects } = req.body;

    const transformedUrl = await applyEffects(publicId, effects);
    res.json({ url: transformedUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear variantes de una imagen
// @route   POST /api/images/:publicId/variants
// @access  Private
const createImageVariants = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { variants } = req.body;

    const urls = await createVariants(publicId, variants);
    res.json({ urls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Aplicar marca de agua a una imagen
// @route   POST /api/images/:publicId/watermark
// @access  Private
const addWatermark = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { text, options } = req.body;

    const watermarkedUrl = await applyWatermark(publicId, text, options);
    res.json({ url: watermarkedUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener configuraciones de transformación disponibles
// @route   GET /api/images/transform-configs
// @access  Private
const getTransformationConfigs = (req, res) => {
  const configs = imageService.getTransformationConfigs();
  res.status(200).json(configs);
};

// @desc    Obtener URLs optimizadas de una imagen
// @route   GET /api/images/:publicId/urls
// @access  Public
const getImageUrls = async (req, res) => {
  try {
    const { publicId } = req.params;

    // Intentar obtener del caché
    const cachedUrls = getImageUrlsFromCache(publicId);
    if (cachedUrls) {
      return res.json(cachedUrls);
    }

    // Verificar si la imagen existe
    const imageExists = await checkImageExists(publicId);
    if (!imageExists) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Generar URLs y guardar en caché
    const urls = generateAllImageUrls(publicId);
    setImageUrlsInCache(publicId, urls);
    setImageExistsInCache(publicId, true);

    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener URLs de la imagen', error: error.message });
  }
};

const imageController = {
  uploadImage,
  deleteImage,
  getAllImages,
  transformImage,
  getImageUrls,
  applyImageEffects,
  createImageVariants,
  addWatermark,
  getTransformationConfigs
};

export default imageController; 