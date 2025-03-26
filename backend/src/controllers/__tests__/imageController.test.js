import imageController from '../../controllers/imageController';
import { imageService } from '../../services/imageService';

jest.mock('../../services/imageService', () => ({
  imageService: {
    uploadImage: jest.fn(),
    deleteImage: jest.fn(),
    getAllImages: jest.fn(),
    transformImage: jest.fn()
  }
}));

describe('Image Controller', () => {
  let mockReq;
  let mockRes;
  let mockNext;
  
  const mockImage = {
    id: '123',
    name: 'test.jpg',
    url: 'http://example.com/test.jpg',
    size: 1024
  };

  const mockImages = [mockImage];

  beforeEach(() => {
    mockReq = {
      file: {
        buffer: Buffer.from('test'),
        originalname: 'test.jpg',
        size: 1024,
        mimetype: 'image/jpeg'
      },
      params: { id: '123' },
      body: { width: 300, height: 200 }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      imageService.uploadImage.mockResolvedValue(mockImage);

      await imageController.uploadImage(mockReq, mockRes, mockNext);

      expect(imageService.uploadImage).toHaveBeenCalledWith(mockReq.file);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockImage);
    });

    it('should handle missing file', async () => {
      mockReq.file = undefined;

      await imageController.uploadImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'No se ha subido ningún archivo' 
      });
    });

    it('should handle invalid file type', async () => {
      mockReq.file.mimetype = 'text/plain';

      await imageController.uploadImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WEBP' 
      });
    });

    it('should handle oversized file', async () => {
      mockReq.file.size = 6 * 1024 * 1024; // 6MB

      await imageController.uploadImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'El archivo excede el tamaño máximo permitido (5MB)' 
      });
    });

    it('should handle upload errors', async () => {
      const error = new Error('Upload failed');
      imageService.uploadImage.mockRejectedValue(error);

      await imageController.uploadImage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteImage', () => {
    it('should delete an image successfully', async () => {
      imageService.deleteImage.mockResolvedValue({ success: true });

      await imageController.deleteImage(mockReq, mockRes, mockNext);

      expect(imageService.deleteImage).toHaveBeenCalledWith('123');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Imagen eliminada correctamente' 
      });
    });

    it('should handle missing id', async () => {
      mockReq.params.id = undefined;

      await imageController.deleteImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Se requiere el ID de la imagen' 
      });
    });

    it('should handle image not found', async () => {
      const error = new Error('Image not found');
      imageService.deleteImage.mockRejectedValue(error);

      await imageController.deleteImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Imagen no encontrada' 
      });
    });

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed');
      imageService.deleteImage.mockRejectedValue(error);

      await imageController.deleteImage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getAllImages', () => {
    it('should get all images successfully', async () => {
      imageService.getAllImages.mockResolvedValue(mockImages);

      await imageController.getAllImages(mockReq, mockRes, mockNext);

      expect(imageService.getAllImages).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(mockImages);
    });

    it('should handle get all images errors', async () => {
      const error = new Error('Database error');
      imageService.getAllImages.mockRejectedValue(error);

      await imageController.getAllImages(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('transformImage', () => {
    it('should transform an image successfully', async () => {
      const transformedImage = {
        id: '123',
        name: 'test.jpg',
        url: 'http://example.com/transformed.jpg',
        size: 1024
      };
      imageService.transformImage.mockResolvedValue(transformedImage);

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(imageService.transformImage).toHaveBeenCalledWith('123', { width: 300, height: 200 });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(transformedImage);
    });

    it('should handle missing id', async () => {
      mockReq.params.id = undefined;

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Se requiere el ID de la imagen' 
      });
    });

    it('should handle invalid transformations', async () => {
      mockReq.body = { effect: 'sepia' };

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Solo se permiten transformaciones de ancho y alto',
        invalidTransformations: ['effect']
      });
    });

    it('should handle invalid width value', async () => {
      mockReq.body = { width: -100, height: 200 };

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'El ancho debe ser un número positivo' 
      });
    });

    it('should handle invalid height value', async () => {
      mockReq.body = { width: 300, height: -200 };

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'El alto debe ser un número positivo' 
      });
    });

    it('should handle image not found', async () => {
      const error = new Error('Image not found');
      imageService.transformImage.mockRejectedValue(error);

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        error: 'Imagen no encontrada' 
      });
    });

    it('should handle transformation errors', async () => {
      const error = new Error('Transformation failed');
      imageService.transformImage.mockRejectedValue(error);

      await imageController.transformImage(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
}); 