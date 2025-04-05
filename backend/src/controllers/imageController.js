import Image from '../models/imageModel.js';
import { imageService } from '../services/imageService.js';
import cloudinary from '../config/cloudinary.js';
import { 
  generateAllImageUrls, 
  optimizeImage, 
  checkImageExists
} from '../utils/imageUtils.js';
import {
  getImageUrlsFromCache,
  setImageUrlsInCache,
  getImageListFromCache,
  setImageListInCache,
  getImageExistsFromCache,
  setImageExistsInCache,
  invalidateImageCache
} from '../utils/cacheUtils.js';
import { 
  applyTransformations, 
  applyEffects,
  createVariants, 
  applyWatermark,
  transformConfigs 
} from '../utils/imageTransformUtils.js';

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
        error: 'El archivo es demasiado grande. El tamaño máximo permitido es 5MB' 
      });
    }

    // Optimizar imagen antes de subir
    const optimizedImage = await optimizeImage(req.file.buffer, req.file.mimetype);
    
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(optimizedImage, {
      resource_type: 'auto',
      folder: 'oftalmologia'
    });

    // Crear registro en la base de datos
    const image = await Image.create({
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      uploadedBy: req.user._id
    });

    // Generar URLs de todas las variantes
    const imageUrls = await generateAllImageUrls(image.publicId, image.format);

    // Guardar en caché
    await setImageUrlsInCache(image.publicId, imageUrls);

    res.status(201).json({
      success: true,
      data: {
        image,
        urls: imageUrls
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Eliminar una imagen
// @route   DELETE /api/images/:filename
// @access  Private
const deleteImage = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const image = await Image.findOne({ publicId: filename });

    if (!image) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Verificar permisos
    if (image.uploadedBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ error: 'No autorizado para eliminar esta imagen' });
    }

    // Eliminar de Cloudinary
    await cloudinary.uploader.destroy(filename);

    // Eliminar de la base de datos
    await image.deleteOne();

    // Invalidar caché
    await invalidateImageCache(filename);

    res.json({ success: true, message: 'Imagen eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

// @desc    Obtener todas las imágenes
// @route   GET /api/images
// @access  Private
const getImages = async (req, res, next) => {
  try {
    // Intentar obtener de caché
    const cachedImages = await getImageListFromCache();
    if (cachedImages) {
      return res.json({ success: true, data: cachedImages });
    }

    // Si no está en caché, obtener de la base de datos
    const images = await Image.find({ active: true })
      .select('publicId url format width height size createdAt')
      .sort('-createdAt');

    // Guardar en caché
    await setImageListInCache(images);

    res.json({ success: true, data: images });
  } catch (error) {
    next(error);
  }
};

// @desc    Transformar una imagen
// @route   POST /api/images/:publicId/transform
// @access  Private
const transformImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    const { transformations } = req.body;

    // Verificar si la imagen existe
    const exists = await checkImageExists(publicId);
    if (!exists) {
      return res.status(404).json({ error: 'Imagen no encontrada' });
    }

    // Aplicar transformaciones
    const result = await applyTransformations(publicId, transformations);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
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

    const result = await applyEffects(publicId, effects);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Crear variantes de una imagen
// @route   POST /api/images/:publicId/variants
// @access  Private
const createImageVariants = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { variants } = req.body;

    const result = await createVariants(publicId, variants);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Agregar marca de agua a una imagen
// @route   POST /api/images/:publicId/watermark
// @access  Private
const addWatermark = async (req, res) => {
  try {
    const { publicId } = req.params;
    const { watermark } = req.body;

    const result = await applyWatermark(publicId, watermark);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Obtener configuraciones de transformación
// @route   GET /api/images/transform-configs
// @access  Private
const getTransformConfigs = (req, res) => {
  res.json({ success: true, data: transformConfigs });
};

export {
  uploadImage,
  deleteImage,
  getImages,
  transformImage,
  applyImageEffects,
  createImageVariants,
  addWatermark,
  getTransformConfigs
}; 