const cron = require('node-cron');
const { deleteUnusedImages, getImageUsageStats } = require('../utils/cleanupUtils');
const { clearCache } = require('../utils/cacheUtils');
const { notifyAdmins } = require('./notifications');

// Configuración de tareas programadas
const tasks = {
  // Limpieza diaria a las 3 AM
  dailyCleanup: {
    schedule: '0 3 * * *',
    enabled: true,
    description: 'Limpieza diaria de imágenes no utilizadas'
  },
  // Limpieza semanal los domingos a las 4 AM
  weeklyCleanup: {
    schedule: '0 4 * * 0',
    enabled: true,
    description: 'Limpieza semanal completa de imágenes'
  },
  // Verificación de estadísticas cada 6 horas
  statsCheck: {
    schedule: '0 */6 * * *',
    enabled: true,
    description: 'Verificación de estadísticas de imágenes'
  }
};

// Función para ejecutar la limpieza diaria
const runDailyCleanup = async () => {
  try {
    console.log('Iniciando limpieza diaria de imágenes...');
    const result = await deleteUnusedImages();
    clearCache();
    console.log('Limpieza diaria completada:', result);
    
    // Enviar notificación si se eliminaron imágenes
    if (result.total > 0) {
      await notifyAdmins('cleanupReport', result);
    }
  } catch (error) {
    console.error('Error en limpieza diaria:', error);
  }
};

// Función para ejecutar la limpieza semanal
const runWeeklyCleanup = async () => {
  try {
    console.log('Iniciando limpieza semanal de imágenes...');
    const initialStats = await getImageUsageStats();
    const result = await deleteUnusedImages();
    const finalStats = await getImageUsageStats();
    clearCache();
    console.log('Limpieza semanal completada:', {
      initialStats,
      finalStats,
      deletedImages: result.deleted,
      totalDeleted: result.total
    });
    
    // Enviar reporte semanal
    await notifyAdmins('cleanupReport', result);
  } catch (error) {
    console.error('Error en limpieza semanal:', error);
  }
};

// Función para verificar estadísticas
const checkStats = async () => {
  try {
    const stats = await getImageUsageStats();
    console.log('Estadísticas de imágenes:', stats);
    
    // Alerta si hay muchas imágenes no utilizadas
    if (stats.unusedImages > 100) {
      console.warn('ALERTA: Hay más de 100 imágenes no utilizadas');
      await notifyAdmins('storageAlert', stats);
    }
    
    // Alerta si el uso de almacenamiento es alto
    const storageGB = stats.totalSize / (1024 * 1024 * 1024);
    if (storageGB > 5) {
      console.warn('ALERTA: Uso de almacenamiento superior a 5GB');
      await notifyAdmins('storageAlert', stats);
    }
  } catch (error) {
    console.error('Error al verificar estadísticas:', error);
  }
};

// Inicializar tareas programadas
const initializeScheduler = () => {
  // Limpieza diaria
  if (tasks.dailyCleanup.enabled) {
    cron.schedule(tasks.dailyCleanup.schedule, runDailyCleanup);
    console.log(`Programada limpieza diaria: ${tasks.dailyCleanup.schedule}`);
  }

  // Limpieza semanal
  if (tasks.weeklyCleanup.enabled) {
    cron.schedule(tasks.weeklyCleanup.schedule, runWeeklyCleanup);
    console.log(`Programada limpieza semanal: ${tasks.weeklyCleanup.schedule}`);
  }

  // Verificación de estadísticas
  if (tasks.statsCheck.enabled) {
    cron.schedule(tasks.statsCheck.schedule, checkStats);
    console.log(`Programada verificación de estadísticas: ${tasks.statsCheck.schedule}`);
  }

  console.log('Sistema de tareas programadas inicializado');
};

// Función para habilitar/deshabilitar tareas
const toggleTask = async (taskName, enabled) => {
  if (tasks[taskName]) {
    tasks[taskName].enabled = enabled;
    console.log(`Tarea ${taskName} ${enabled ? 'habilitada' : 'deshabilitada'}`);
    
    // Notificar cambio de estado
    await notifyAdmins('taskStatus', taskName, enabled);
  }
};

module.exports = {
  initializeScheduler,
  toggleTask,
  tasks
}; 