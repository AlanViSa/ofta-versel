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
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Constantes para validaciones
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const uploadDir = path.join(__dirname, '../uploads');

// Asegurar que el directorio de uploads existe
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Listar todas las imágenes
exports.getImages = async (req, res) => {
  try {
    const files = fs.readdirSync(uploadDir);
    const images = files.map(file => {
      const stats = fs.statSync(path.join(uploadDir, file));
      return {
        id: file,
        filename: file,
        url: `/uploads/${file}`,
        size: stats.size
      };
    });
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
};

// Subir una nueva imagen
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó ninguna imagen' });
    }

    const image = {
      id: req.file.filename,
      filename: req.file.originalname,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size
    };

    res.status(201).json(image);
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen' });
  }
};

// Eliminar una imagen
exports.deleteImage = async (req, res) => {
  try {
    const filePath = path.join(uploadDir, req.params.id);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Imagen eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
};

// Transformar una imagen
exports.transformImage = async (req, res) => {
  try {
    const { width, height } = req.body;
    const filePath = path.join(uploadDir, req.params.id);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    const newFilename = `transformed_${req.params.id}`;
    const newFilePath = path.join(uploadDir, newFilename);

    await sharp(filePath)
      .resize(parseInt(width), parseInt(height))
      .toFile(newFilePath);

    const stats = fs.statSync(newFilePath);
    const image = {
      id: newFilename,
      filename: newFilename,
      url: `/uploads/${newFilename}`,
      size: stats.size
    };

    res.json(image);
  } catch (error) {
    res.status(500).json({ error: 'Error al transformar la imagen' });
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
  getImages,
  transformImage,
  getImageUrls,
  applyImageEffects,
  createImageVariants,
  addWatermark,
  getTransformationConfigs
};

export default imageController; 