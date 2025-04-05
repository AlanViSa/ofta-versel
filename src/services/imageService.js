import axios from 'axios';
import Image from '../models/Image';
import cloudinary from '../config/cloudinary';
import * as imageTransformUtils from '../utils/imageTransformUtils';

const API_URL = '/api/images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const imageService = {
  // Obtener todas las imágenes
  getAllImages: async () => {
    try {
      return await Image.getAllImages();
    } catch (error) {
      console.error('Error getting all images:', error);
      throw error;
    }
  },

  // Subir una imagen
  uploadImage: async (file) => {
    try {
      // Validaciones
      if (!ALLOWED_TYPES.includes(file.mimetype)) {
        throw new Error('Solo se permiten imágenes JPG, PNG, GIF y WEBP');
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error('El archivo excede el tamaño máximo permitido (5MB)');
      }

      const result = await cloudinary.uploader.upload(file.buffer, {
        resource_type: 'auto'
      });

      const image = await Image.create({
        filename: file.originalname,
        url: result.secure_url,
        size: file.size,
        format: result.format
      });

      return image.toResponse();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Eliminar una imagen
  deleteImage: async (imageId) => {
    try {
      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Image not found');
      }

      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      await Image.findByIdAndDelete(imageId);

      return { success: true };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Transformar una imagen
  transformImage: async (imageId, transformations) => {
    try {
      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Image not found');
      }

      // Validar que solo se transformen ancho y alto
      if (Object.keys(transformations).some(key => !['width', 'height'].includes(key))) {
        throw new Error('Solo se permiten transformaciones de ancho y alto');
      }

      const publicId = image.url.split('/').pop().split('.')[0];
      const result = await imageTransformUtils.transformImage(publicId, transformations);
      
      // Actualizar la URL de la imagen en la base de datos
      image.url = result.url;
      await image.save();

      return image.toResponse();
    } catch (error) {
      console.error('Error transforming image:', error);
      throw error;
    }
  },

  // Aplicar efectos
  applyEffect: async (params) => {
    const response = await axios.post(`${API_URL}/effect`, params);
    return response.data;
  },

  // Crear variantes
  createVariants: async (publicId, variants) => {
    const response = await axios.post(`${API_URL}/${publicId}/variants`, {
      variants
    });
    return response.data;
  },

  // Agregar marca de agua
  addWatermark: async (params) => {
    const response = await axios.post(`${API_URL}/watermark`, params);
    return response.data;
  },

  // Obtener configuraciones de transformación
  getTransformationConfigs: () => {
    return imageTransformUtils.transformConfigs;
  }
};