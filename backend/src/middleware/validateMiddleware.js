import { body, validationResult } from 'express-validator';

// @desc    Middleware para validar los resultados de express-validator
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// @desc    Validaciones para registro de usuario
export const validateRegister = [
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

// @desc    Validaciones para creación de producto
export const validateProduct = [
  body('name')
    .notEmpty().withMessage('El nombre del producto es requerido')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),
  body('description')
    .notEmpty().withMessage('La descripción es requerida'),
  body('price')
    .notEmpty().withMessage('El precio es requerido')
    .isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo'),
  body('category')
    .notEmpty().withMessage('La categoría es requerida')
    .isIn(['gafas', 'lentes_contacto', 'accesorios']).withMessage('Categoría inválida')
];

// @desc    Validaciones para creación de cita
export const validateAppointment = [
  body('patient.name')
    .notEmpty().withMessage('El nombre del paciente es requerido'),
  body('patient.email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('Email inválido'),
  body('patient.phone')
    .notEmpty().withMessage('El teléfono es requerido'),
  body('date')
    .notEmpty().withMessage('La fecha es requerida')
    .isDate().withMessage('Fecha inválida'),
  body('time')
    .notEmpty().withMessage('La hora es requerida'),
  body('type')
    .notEmpty().withMessage('El tipo de cita es requerido')
    .isIn(['consulta', 'examen', 'ajuste', 'otro']).withMessage('Tipo de cita inválido')
]; 