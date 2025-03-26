const Appointment = require('../models/Appointment');

// @desc    Crear una nueva cita
// @route   POST /api/appointments
// @access  Public
const createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create({
      ...req.body,
      createdBy: req.user ? req.user._id : null
    });
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear cita', error: error.message });
  }
};

// @desc    Obtener todas las citas (con filtros)
// @route   GET /api/appointments
// @access  Private
const getAppointments = async (req, res) => {
  try {
    const { date, status, type } = req.query;
    
    // Construir query
    const query = {};
    if (date) query.date = date;
    if (status) query.status = status;
    if (type) query.type = type;

    // Si no es admin, solo mostrar sus propias citas
    if (req.user && req.user.role !== 'admin') {
      query.createdBy = req.user._id;
    }

    const appointments = await Appointment.find(query)
      .sort({ date: 1, time: 1 })
      .populate('createdBy', 'name email');

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener citas', error: error.message });
  }
};

// @desc    Obtener una cita por ID
// @route   GET /api/appointments/:id
// @access  Private
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('createdBy', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar permisos
    if (req.user && req.user.role !== 'admin' && 
        appointment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cita', error: error.message });
  }
};

// @desc    Actualizar una cita
// @route   PUT /api/appointments/:id
// @access  Private
const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar permisos
    if (req.user && req.user.role !== 'admin' && 
        appointment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    Object.assign(appointment, req.body);
    const updatedAppointment = await appointment.save();
    res.json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cita', error: error.message });
  }
};

// @desc    Cancelar una cita
// @route   PUT /api/appointments/:id/cancel
// @access  Private
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Cita no encontrada' });
    }

    // Verificar permisos
    if (req.user && req.user.role !== 'admin' && 
        appointment.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado' });
    }

    appointment.status = 'cancelada';
    await appointment.save();
    res.json({ message: 'Cita cancelada exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar cita', error: error.message });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  cancelAppointment
}; 