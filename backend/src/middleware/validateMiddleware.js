import { validationResult } from 'express-validator';

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
  {
    field: 'name',
    rules: [
      { rule: 'notEmpty', message: 'El nombre es requerido' },
      { rule: 'isLength', options: { min: 2, max: 50 }, message: 'El nombre debe tener entre 2 y 50 caracteres' }
    ]
  },
  {
    field: 'email',
    rules: [
      { rule: 'notEmpty', message: 'El email es requerido' },
      { rule: 'isEmail', message: 'Email inválido' }
    ]
  },
  {
    field: 'password',
    rules: [
      { rule: 'notEmpty', message: 'La contraseña es requerida' },
      { rule: 'isLength', options: { min: 6 }, message: 'La contraseña debe tener al menos 6 caracteres' }
    ]
  }
];

// @desc    Validaciones para creación de producto
export const validateProduct = [
  {
    field: 'name',
    rules: [
      { rule: 'notEmpty', message: 'El nombre del producto es requerido' },
      { rule: 'isLength', options: { min: 3, max: 100 }, message: 'El nombre debe tener entre 3 y 100 caracteres' }
    ]
  },
  {
    field: 'description',
    rules: [
      { rule: 'notEmpty', message: 'La descripción es requerida' }
    ]
  },
  {
    field: 'price',
    rules: [
      { rule: 'notEmpty', message: 'El precio es requerido' },
      { rule: 'isFloat', options: { min: 0 }, message: 'El precio debe ser un número positivo' }
    ]
  },
  {
    field: 'category',
    rules: [
      { rule: 'notEmpty', message: 'La categoría es requerida' },
      { rule: 'isIn', options: { values: ['gafas', 'lentes_contacto', 'accesorios'] }, message: 'Categoría inválida' }
    ]
  }
];

// @desc    Validaciones para creación de cita
const validateAppointment = [
  {
    field: 'patient.name',
    rules: [
      { rule: 'notEmpty', message: 'El nombre del paciente es requerido' }
    ]
  },
  {
    field: 'patient.email',
    rules: [
      { rule: 'notEmpty', message: 'El email es requerido' },
      { rule: 'isEmail', message: 'Email inválido' }
    ]
  },
  {
    field: 'patient.phone',
    rules: [
      { rule: 'notEmpty', message: 'El teléfono es requerido' }
    ]
  },
  {
    field: 'date',
    rules: [
      { rule: 'notEmpty', message: 'La fecha es requerida' },
      { rule: 'isDate', message: 'Fecha inválida' }
    ]
  },
  {
    field: 'time',
    rules: [
      { rule: 'notEmpty', message: 'La hora es requerida' }
    ]
  },
  {
    field: 'type',
    rules: [
      { rule: 'notEmpty', message: 'El tipo de cita es requerido' },
      { rule: 'isIn', options: { values: ['consulta', 'examen', 'ajuste', 'otro'] }, message: 'Tipo de cita inválido' }
    ]
  }
];

export { validateAppointment }; 