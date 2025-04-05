import cloudinary from '../config/cloudinary.js';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Appointment from '../models/Appointment.js';

// @desc    Obtener todas las imágenes de Cloudinary
export const getAllCloudinaryImages = async () => {
  try {
    const result = await cloudinary.search
      .expression('folder:ofta/*')
      .execute();
    return result.resources;
  } catch (error) {
    throw new Error(`Error al obtener imágenes de Cloudinary: ${error.message}`);
  }
};

// @desc    Obtener todas las referencias a imágenes en la base de datos
export const getImageReferences = async () => {
  try {
    // Obtener imágenes de productos
    const products = await Product.find({}, 'images');
    const productImages = products.flatMap(product => product.images);

    // Obtener imágenes de citas
    const appointments = await Appointment.find({}, 'images');
    const appointmentImages = appointments.flatMap(appointment => appointment.images);

    // Combinar todas las referencias
    return [...new Set([...productImages, ...appointmentImages])];
  } catch (error) {
    throw new Error(`Error al obtener referencias de imágenes: ${error.message}`);
  }
};

// @desc    Encontrar imágenes no utilizadas
export const findUnusedImages = async () => {
  try {
    const cloudinaryImages = await getAllCloudinaryImages();
    const usedImages = await getImageReferences();

    return cloudinaryImages.filter(image => 
      !usedImages.includes(image.public_id)
    );
  } catch (error) {
    throw new Error(`Error al encontrar imágenes no utilizadas: ${error.message}`);
  }
};

// @desc    Eliminar imágenes no utilizadas
export const deleteUnusedImages = async () => {
  try {
    const unusedImages = await findUnusedImages();
    const deletedImages = [];

    for (const image of unusedImages) {
      await cloudinary.uploader.destroy(image.public_id);
      deletedImages.push(image.public_id);
    }

    return {
      total: unusedImages.length,
      deleted: deletedImages
    };
  } catch (error) {
    throw new Error(`Error al eliminar imágenes no utilizadas: ${error.message}`);
  }
};

// @desc    Obtener estadísticas de uso de imágenes
export const getImageUsageStats = async () => {
  try {
    const cloudinaryImages = await getAllCloudinaryImages();
    const usedImages = await getImageReferences();
    
    const stats = {
      totalImages: cloudinaryImages.length,
      usedImages: usedImages.length,
      unusedImages: cloudinaryImages.length - usedImages.length,
      totalSize: cloudinaryImages.reduce((acc, img) => acc + img.bytes, 0),
      averageSize: cloudinaryImages.length > 0 
        ? cloudinaryImages.reduce((acc, img) => acc + img.bytes, 0) / cloudinaryImages.length 
        : 0
    };

    return stats;
  } catch (error) {
    throw new Error(`Error al obtener estadísticas: ${error.message}`);
  }
}; 