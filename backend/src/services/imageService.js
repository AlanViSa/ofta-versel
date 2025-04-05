import axios from 'axios';
import Image from '../models/imageModel.js';
import cloudinary from '../config/cloudinary.js';
import * as imageTransformUtils from '../utils/imageTransformUtils.js';

const API_URL = '/api/images';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export const imageService = {
  // Obtener todas las imágenes
  getAllImages: async () => {
    try {
      return await Image.find({ active: true }).sort('-createdAt');
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
        resource_type: 'auto',
        folder: 'oftalmologia'
      });

      const image = await Image.create({
        publicId: result.public_id,
        url: result.secure_url,
        filename: file.originalname,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes
      });

      return image;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Eliminar una imagen
  deleteImage: async (id) => {
    try {
      const image = await Image.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }

      await cloudinary.uploader.destroy(image.publicId);
      await image.deleteOne();

      return { message: 'Imagen eliminada correctamente' };
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },

  // Transformar una imagen
  transformImage: async (id, transformations) => {
    try {
      const image = await Image.findById(id);
      if (!image) {
        throw new Error('Image not found');
      }

      const result = await imageTransformUtils.applyTransformations(image.publicId, transformations);
      return result;
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