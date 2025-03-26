const { tasks, toggleTask } = require('../config/scheduler');
const { deleteUnusedImages, getImageUsageStats } = require('../utils/cleanupUtils');
const { clearCache } = require('../utils/cacheUtils');

// @desc    Obtener estado de las tareas programadas
// @route   GET /api/scheduler/status
// @access  Private/Admin
const getStatus = async (req, res) => {
  try {
    const status = Object.entries(tasks).map(([name, task]) => ({
      name,
      schedule: task.schedule,
      enabled: task.enabled,
      description: task.description,
      nextRun: getNextRunTime(task.schedule)
    }));

    res.json(status);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener estado de tareas', 
      error: error.message 
    });
  }
};

// @desc    Habilitar/deshabilitar tarea
// @route   PUT /api/scheduler/tasks/:taskName
// @access  Private/Admin
const updateTaskStatus = async (req, res) => {
  try {
    const { taskName } = req.params;
    const { enabled } = req.body;

    if (typeof enabled !== 'boolean') {
      return res.status(400).json({ 
        message: 'El campo enabled debe ser un booleano' 
      });
    }

    toggleTask(taskName, enabled);

    res.json({ 
      message: `Tarea ${taskName} ${enabled ? 'habilitada' : 'deshabilitada'} exitosamente`,
      task: {
        name: taskName,
        enabled,
        schedule: tasks[taskName].schedule,
        description: tasks[taskName].description
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al actualizar estado de tarea', 
      error: error.message 
    });
  }
};

// @desc    Ejecutar tarea manualmente
// @route   POST /api/scheduler/tasks/:taskName/run
// @access  Private/Admin
const runTask = async (req, res) => {
  try {
    const { taskName } = req.params;

    switch (taskName) {
      case 'dailyCleanup':
        const dailyResult = await deleteUnusedImages();
        clearCache();
        res.json({ 
          message: 'Limpieza diaria ejecutada manualmente',
          result: dailyResult
        });
        break;

      case 'weeklyCleanup':
        const initialStats = await getImageUsageStats();
        const weeklyResult = await deleteUnusedImages();
        const finalStats = await getImageUsageStats();
        clearCache();
        res.json({ 
          message: 'Limpieza semanal ejecutada manualmente',
          initialStats,
          finalStats,
          result: weeklyResult
        });
        break;

      case 'statsCheck':
        const stats = await getImageUsageStats();
        res.json({ 
          message: 'Verificación de estadísticas ejecutada manualmente',
          stats
        });
        break;

      default:
        res.status(404).json({ 
          message: 'Tarea no encontrada' 
        });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al ejecutar tarea', 
      error: error.message 
    });
  }
};

// Función auxiliar para calcular el próximo tiempo de ejecución
const getNextRunTime = (cronExpression) => {
  const now = new Date();
  const parts = cronExpression.split(' ');
  
  // Crear fecha para el próximo día
  const nextRun = new Date(now);
  nextRun.setHours(parseInt(parts[1]));
  nextRun.setMinutes(parseInt(parts[0]));
  nextRun.setSeconds(0);
  nextRun.setMilliseconds(0);

  // Si la hora ya pasó hoy, programar para mañana
  if (nextRun < now) {
    nextRun.setDate(nextRun.getDate() + 1);
  }

  // Ajustar para tareas semanales
  if (parts[5] === '0') { // Si es domingo
    while (nextRun.getDay() !== 0) {
      nextRun.setDate(nextRun.getDate() + 1);
    }
  }

  return nextRun.toISOString();
};

module.exports = {
  getStatus,
  updateTaskStatus,
  runTask
}; 