// @desc    Middleware para manejar errores de manera centralizada
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      message: 'Error de validación',
      errors: messages
    });
  }

  // Errores de duplicación de MongoDB
  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Error de duplicación',
      field: Object.keys(err.keyPattern)[0]
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado'
    });
  }

  // Error por defecto
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// @desc    Middleware para manejar rutas no encontradas
export const notFound = (req, res, next) => {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  res.status(404);
  next(error);
}; 