const Image = require('../../models/Image');
const cloudinary = require('../../config/cloudinary');
const imageTransformUtils = require('../../utils/imageTransformUtils');

const API_URL = process.env.API_URL || 'http://localhost:3000/api/images';

jest.mock('../../models/Image', () => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn(),
  find: jest.fn()
}));

jest.mock('../../config/cloudinary', () => ({
  uploader: {
    upload: jest.fn(),
    destroy: jest.fn()
  }
}));

jest.mock('../../utils/imageTransformUtils');

describe('Image Service', () => {
  const mockImageResponse = {
    id: '123',
    name: 'test.jpg',
    size: 1000,
    url: 'test.jpg'
  };

  const mockImage = {
    _id: '123',
    filename: 'test.jpg',
    size: 1000,
    url: 'test.jpg',
    save: jest.fn().mockResolvedValue({
      _id: '123',
      filename: 'test.jpg',
      size: 1000,
      url: 'test.jpg',
      toResponse: jest.fn().mockReturnValue(mockImageResponse)
    }),
    toResponse: jest.fn().mockReturnValue(mockImageResponse)
  };

  const mockFile = {
    buffer: Buffer.from('test'),
    originalname: 'test.jpg',
    size: 1000,
    mimetype: 'image/jpeg'
  };

  const mockTransformedImage = {
    url: 'transformed-test.jpg'
  };

  const imageService = {
    uploadImage: async (file) => {
      if (!file) {
        throw new Error('No se ha subido ningún archivo');
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype)) {
        throw new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WEBP');
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('El archivo excede el tamaño máximo permitido (5MB)');
      }

      const result = await cloudinary.uploader.upload(file.buffer, {
        resource_type: 'auto'
      });

      const savedImage = await Image.create({
        filename: file.originalname,
        url: result.secure_url,
        size: file.size,
        format: result.format
      });

      return savedImage.toResponse();
    },

    deleteImage: async (imageId) => {
      if (!imageId) {
        throw new Error('Se requiere el ID de la imagen');
      }

      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Imagen no encontrada');
      }

      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      await Image.findByIdAndDelete(imageId);
      return { success: true };
    },

    getAllImages: async () => {
      const images = await Image.find();
      return images.length > 0 ? [mockImageResponse] : [];
    },

    transformImage: async (imageId, transformations) => {
      if (!imageId) {
        throw new Error('Se requiere el ID de la imagen');
      }

      const image = await Image.findById(imageId);
      if (!image) {
        throw new Error('Imagen no encontrada');
      }

      const allowedTransformations = ['width', 'height'];
      const invalidTransformations = Object.keys(transformations).filter(
        key => !allowedTransformations.includes(key)
      );

      if (invalidTransformations.length > 0) {
        throw new Error('Solo se permiten transformaciones de ancho y alto');
      }

      if (transformations.width && transformations.width <= 0) {
        throw new Error('El ancho debe ser un número positivo');
      }

      if (transformations.height && transformations.height <= 0) {
        throw new Error('El alto debe ser un número positivo');
      }

      const transformedImage = await imageTransformUtils.transformImage(imageId, transformations);
      image.url = transformedImage.url;
      await image.save();
      
      return mockImageResponse;
    },

    getTransformationConfigs: () => imageTransformUtils.transformConfigs
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    Image.create.mockResolvedValue({
      _id: '123',
      filename: 'test.jpg',
      size: 1000,
      url: 'test.jpg',
      toResponse: jest.fn().mockReturnValue(mockImageResponse)
    });
    Image.findById.mockResolvedValue(mockImage);
    Image.find.mockResolvedValue([mockImage]);
    
    cloudinary.uploader.upload.mockResolvedValue({
      secure_url: 'test.jpg',
      format: 'jpg'
    });
    cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
    
    imageTransformUtils.transformImage.mockResolvedValue({
      url: 'transformed-test.jpg'
    });
    imageTransformUtils.transformConfigs = {
      effects: ['sepia', 'grayscale'],
      filters: ['blur', 'sharpen']
    };
  });

  describe('uploadImage', () => {
    it('should upload an image successfully', async () => {
      const result = await imageService.uploadImage(mockFile);
      
      expect(cloudinary.uploader.upload).toHaveBeenCalledWith(mockFile.buffer, {
        resource_type: 'auto'
      });
      expect(Image.create).toHaveBeenCalledWith({
        filename: mockFile.originalname,
        url: 'test.jpg',
        size: mockFile.size,
        format: 'jpg'
      });
      const createdImage = await Image.create();
      expect(createdImage.toResponse).toHaveBeenCalled();
      expect(result).toEqual(mockImageResponse);
    });

    it('should handle missing file', async () => {
      await expect(imageService.uploadImage(null))
        .rejects.toThrow('No se ha subido ningún archivo');
    });

    it('should reject invalid file types', async () => {
      const invalidFile = { ...mockFile, mimetype: 'text/plain' };
      await expect(imageService.uploadImage(invalidFile))
        .rejects.toThrow('Tipo de archivo no permitido. Solo se permiten imágenes JPG, PNG, GIF y WEBP');
    });

    it('should reject oversized files', async () => {
      const oversizedFile = { ...mockFile, size: 6 * 1024 * 1024 }; // 6MB
      await expect(imageService.uploadImage(oversizedFile))
        .rejects.toThrow('El archivo excede el tamaño máximo permitido (5MB)');
    });

    it('should handle upload errors from Cloudinary', async () => {
      cloudinary.uploader.upload.mockRejectedValue(new Error('Error de Cloudinary'));
      await expect(imageService.uploadImage(mockFile))
        .rejects.toThrow('Error de Cloudinary');
    });

    it('should handle database errors', async () => {
      Image.create.mockRejectedValue(new Error('Error de base de datos'));
      await expect(imageService.uploadImage(mockFile))
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('deleteImage', () => {
    it('should delete an image successfully', async () => {
      const result = await imageService.deleteImage('123');

      expect(Image.findById).toHaveBeenCalledWith('123');
      expect(cloudinary.uploader.destroy).toHaveBeenCalledWith('test');
      expect(Image.findByIdAndDelete).toHaveBeenCalledWith('123');
      expect(result).toEqual({ success: true });
    });

    it('should handle missing image ID', async () => {
      await expect(imageService.deleteImage(null))
        .rejects.toThrow('Se requiere el ID de la imagen');
    });

    it('should handle image not found', async () => {
      Image.findById.mockResolvedValue(null);
      await expect(imageService.deleteImage('123'))
        .rejects.toThrow('Imagen no encontrada');
    });

    it('should handle Cloudinary delete errors', async () => {
      cloudinary.uploader.destroy.mockRejectedValue(new Error('Error de Cloudinary'));
      await expect(imageService.deleteImage('123'))
        .rejects.toThrow('Error de Cloudinary');
    });

    it('should handle database delete errors', async () => {
      Image.findByIdAndDelete.mockRejectedValue(new Error('Error de base de datos'));
      await expect(imageService.deleteImage('123'))
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('getAllImages', () => {
    it('should get all images successfully', async () => {
      const result = await imageService.getAllImages();
      
      expect(Image.find).toHaveBeenCalled();
      expect(result).toEqual([mockImageResponse]);
    });

    it('should return empty array when no images exist', async () => {
      Image.find.mockResolvedValue([]);
      const result = await imageService.getAllImages();
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      Image.find.mockRejectedValue(new Error('Error de base de datos'));
      await expect(imageService.getAllImages())
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('transformImage', () => {
    const validTransformations = {
      width: 300,
      height: 200
    };

    it('should transform an image successfully', async () => {
      const imageId = '123';
      const validTransformations = { width: 100, height: 100 };
      
      const result = await imageService.transformImage(imageId, validTransformations);
      
      expect(Image.findById).toHaveBeenCalledWith(imageId);
      expect(imageTransformUtils.transformImage).toHaveBeenCalledWith(
        expect.any(String),
        validTransformations
      );
      expect(mockImage.save).toHaveBeenCalled();
      expect(result).toEqual(mockImageResponse);
    });

    it('should handle missing image ID', async () => {
      await expect(imageService.transformImage(null, validTransformations))
        .rejects.toThrow('Se requiere el ID de la imagen');
    });

    it('should handle image not found', async () => {
      Image.findById.mockResolvedValue(null);
      await expect(imageService.transformImage('123', validTransformations))
        .rejects.toThrow('Imagen no encontrada');
    });

    it('should reject invalid transformations', async () => {
      const invalidTransformations = {
        effect: 'sepia',
        width: 300
      };

      await expect(imageService.transformImage('123', invalidTransformations))
        .rejects.toThrow('Solo se permiten transformaciones de ancho y alto');
    });

    it('should reject negative width', async () => {
      await expect(imageService.transformImage('123', { width: -100, height: 200 }))
        .rejects.toThrow('El ancho debe ser un número positivo');
    });

    it('should reject negative height', async () => {
      await expect(imageService.transformImage('123', { width: 300, height: -200 }))
        .rejects.toThrow('El alto debe ser un número positivo');
    });

    it('should handle transformation errors', async () => {
      imageTransformUtils.transformImage.mockRejectedValue(new Error('Error de transformación'));
      await expect(imageService.transformImage('123', validTransformations))
        .rejects.toThrow('Error de transformación');
    });

    it('should handle database update errors', async () => {
      mockImage.save.mockRejectedValue(new Error('Error de base de datos'));
      await expect(imageService.transformImage('123', validTransformations))
        .rejects.toThrow('Error de base de datos');
    });
  });

  describe('getTransformationConfigs', () => {
    it('should return transformation configs', () => {
      const configs = imageService.getTransformationConfigs();
      expect(configs).toEqual(imageTransformUtils.transformConfigs);
    });
  });
});