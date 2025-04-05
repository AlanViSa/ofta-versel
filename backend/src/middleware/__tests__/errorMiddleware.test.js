const { errorHandler, notFound } = require('../errorMiddleware');

describe('Error Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {
      originalUrl: '/test'
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('errorHandler middleware', () => {
    it('should handle validation errors', () => {
      const error = {
        name: 'ValidationError',
        errors: {
          field1: { message: 'Campo requerido' },
          field2: { message: 'Formato inválido' }
        }
      };

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de validación',
        errors: ['Campo requerido', 'Formato inválido']
      });
    });

    it('should handle duplicate key errors', () => {
      const error = {
        code: 11000,
        keyPattern: { email: 1 }
      };

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de duplicación',
        field: 'email'
      });
    });

    it('should handle invalid JWT errors', () => {
      const error = {
        name: 'JsonWebTokenError'
      };

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Token inválido'
      });
    });

    it('should handle expired JWT errors', () => {
      const error = {
        name: 'TokenExpiredError'
      };

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Token expirado'
      });
    });

    it('should handle unknown errors in development', () => {
      process.env.NODE_ENV = 'development';
      const error = new Error('Some unknown error');

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error interno del servidor',
        error: 'Some unknown error'
      });
    });

    it('should handle unknown errors in production', () => {
      process.env.NODE_ENV = 'production';
      const error = new Error('Some unknown error');

      errorHandler(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error interno del servidor',
        error: undefined
      });
    });
  });

  describe('notFound middleware', () => {
    it('should handle undefined routes', () => {
      notFound(mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
      expect(nextFunction.mock.calls[0][0].message).toBe('Ruta no encontrada: /test');
    });
  });
}); 