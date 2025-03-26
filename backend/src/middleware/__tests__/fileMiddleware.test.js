const multer = require('multer');
const { handleMulterError } = require('../fileMiddleware');

describe('File Middleware', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
  });

  describe('handleMulterError middleware', () => {
    it('should handle file size limit errors', () => {
      const error = new multer.MulterError('LIMIT_FILE_SIZE');

      handleMulterError(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'El archivo es demasiado grande. Tamaño máximo: 5MB'
      });
    });

    it('should handle other multer errors', () => {
      const error = new Error('Error de prueba');

      handleMulterError(error, mockReq, mockRes, nextFunction);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: 'Error de prueba'
      });
    });

    it('should call next if no error', () => {
      handleMulterError(null, mockReq, mockRes, nextFunction);

      expect(nextFunction).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });
  });
});