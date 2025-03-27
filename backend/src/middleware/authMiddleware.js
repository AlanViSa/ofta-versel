import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc    Verificar token JWT y agregar usuario a req
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      message: 'No autorizado, no hay token'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        message: 'No autorizado, token inválido'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'No autorizado, token inválido'
    });
  }
};

// @desc    Verificar si el usuario es administrador
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      message: 'No autorizado, solo administradores'
    });
  }
};

// @desc    Verificar si el usuario es el propietario o admin
export const isOwnerOrAdmin = (req, res, next) => {
  if (req.user && (req.user._id.toString() === req.params.userId || req.user.isAdmin)) {
    next();
  } else {
    return res.status(403).json({
      message: 'No autorizado, solo el propietario o administradores'
    });
  }
}; 