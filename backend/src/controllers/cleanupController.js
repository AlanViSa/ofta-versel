import {
  findUnusedImages,
  deleteUnusedImages,
  getImageUsageStats
} from '../utils/cleanupUtils.js';
import { clearCache } from '../utils/cacheUtils.js';

// @desc    Obtener estadísticas de uso de imágenes
// @route   GET /api/cleanup/stats
// @access  Private/Admin
export const getStats = async (req, res) => {
  try {
    const stats = await getImageUsageStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estadísticas de imágenes', 
      error: error.message 
    });
  }
};

// @desc    Encontrar imágenes no utilizadas
// @route   GET /api/cleanup/unused
// @access  Private/Admin
export const findUnused = async (req, res) => {
  try {
    const unusedImages = await findUnusedImages();
    res.json({
      total: unusedImages.length,
      images: unusedImages.map(img => ({
        publicId: img.public_id,
        size: img.bytes,
        format: img.format,
        createdAt: img.created_at
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al encontrar imágenes no utilizadas', 
      error: error.message 
    });
  }
};

// @desc    Eliminar imágenes no utilizadas
// @route   POST /api/cleanup/delete-unused
// @access  Private/Admin
export const deleteUnused = async (req, res) => {
  try {
    const result = await deleteUnusedImages();
    
    // Limpiar caché después de eliminar imágenes
    clearCache();

    res.json({
      message: 'Limpieza de imágenes completada',
      ...result
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al eliminar imágenes no utilizadas', 
      error: error.message 
    });
  }
};

// @desc    Ejecutar limpieza completa
// @route   POST /api/cleanup/full
// @access  Private/Admin
export const runFullCleanup = async (req, res) => {
  try {
    // Obtener estadísticas iniciales
    const initialStats = await getImageUsageStats();
    
    // Encontrar imágenes no utilizadas
    const unusedImages = await findUnusedImages();
    
    // Eliminar imágenes no utilizadas
    const deleteResult = await deleteUnusedImages();
    
    // Obtener estadísticas finales
    const finalStats = await getImageUsageStats();
    
    // Limpiar caché
    clearCache();

    res.json({
      message: 'Limpieza completa ejecutada',
      initialStats,
      finalStats,
      deletedImages: deleteResult.deleted,
      totalDeleted: deleteResult.total
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al ejecutar limpieza completa', 
      error: error.message 
    });
  }
}; 