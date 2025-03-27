import cloudinary from '../../config/cloudinary.js';
import * as imageTransformUtils from '../imageTransformUtils.js';

jest.mock('../../config/cloudinary', () => ({
  v2: {
    url: jest.fn(),
    uploader: {
      explicit: jest.fn()
    }
  }
}));

describe('Image Transform Utils', () => {
  const publicId = 'test-image';
  const text = 'Test Watermark';

  beforeEach(() => {
    jest.clearAllMocks();
    cloudinary.v2.url.mockReturnValue('https://test.com/transformed.jpg');
    cloudinary.v2.uploader.explicit.mockResolvedValue({
      secure_url: 'https://test.com/transformed.jpg'
    });
  });

  describe('applyTransformations', () => {
    it('should apply transformations successfully', () => {
      const transformations = {
        width: 300,
        height: 200,
        crop: 'fill'
      };

      const result = imageTransformUtils.applyTransformations(publicId, transformations);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        width: 300,
        height: 200,
        crop: 'fill',
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });

    it('should handle transformation errors', () => {
      const error = new Error('Transformation error');
      cloudinary.v2.url.mockImplementation(() => {
        throw error;
      });

      expect(() => imageTransformUtils.applyTransformations('test-image', {}))
        .toThrow('Error al aplicar transformaciones: Transformation error');
    });
  });

  describe('applyEffects', () => {
    it('should apply single effect successfully', () => {
      const effects = ['sepia'];

      const result = imageTransformUtils.applyEffects(publicId, effects);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: [{ effect: 'sepia' }],
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });

    it('should apply multiple effects successfully', () => {
      const effects = ['sepia', 'blur'];

      const result = imageTransformUtils.applyEffects(publicId, effects);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: [
          { effect: 'sepia' },
          { effect: 'blur' }
        ],
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });

    it('should handle invalid effects', () => {
      const effects = ['invalid_effect'];

      const result = imageTransformUtils.applyEffects(publicId, effects);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: [{}],
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });
  });

  describe('applyWatermark', () => {
    it('should apply watermark successfully', async () => {
      const options = {
        color: 'white',
        fontFamily: 'Arial',
        fontSize: 50,
        opacity: 50,
        position: { x: 10, y: 10 }
      };

      const result = imageTransformUtils.applyWatermark(publicId, text, options);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: {
          overlay: {
            font_family: 'Arial',
            font_size: 50,
            text: text
          },
          color: 'white',
          opacity: 50,
          x: 10,
          y: 10,
          secure: true
        },
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });

    it('should use default options when not provided', async () => {
      const result = imageTransformUtils.applyWatermark(publicId, text);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: {
          overlay: {
            font_family: 'Arial',
            font_size: 50,
            text: text
          },
          color: 'white',
          opacity: 70,
          x: 10,
          y: 10,
          secure: true
        },
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });

    it('should apply watermark with custom options', async () => {
      const options = {
        color: 'white',
        fontFamily: 'Arial',
        fontSize: 40,
        opacity: 70,
        position: { x: 15, y: 15 }
      };

      const result = imageTransformUtils.applyWatermark(publicId, text, options);

      expect(cloudinary.v2.url).toHaveBeenCalledWith(publicId, {
        transformation: {
          overlay: {
            font_family: 'Arial',
            font_size: 40,
            text: text
          },
          color: 'white',
          opacity: 70,
          x: 15,
          y: 15,
          secure: true
        },
        secure: true
      });
      expect(result).toBe('https://test.com/transformed.jpg');
    });
  });

  describe('validateTransformParams', () => {
    it('should validate resize parameters', () => {
      const params = {
        width: 300,
        height: 200,
        crop: 'fill'
      };

      expect(() => imageTransformUtils.validateTransformParams(params))
        .not.toThrow();
    });

    it('should validate effect parameters', () => {
      const params = {
        effect: 'sepia'
      };

      expect(() => imageTransformUtils.validateTransformParams(params))
        .not.toThrow();
    });

    it('should validate watermark parameters', () => {
      const params = {
        watermark: {
          text: 'Test',
          fontSize: 24,
          opacity: 50
        }
      };

      expect(() => imageTransformUtils.validateTransformParams(params))
        .not.toThrow();
    });

    it('should throw error for null parameters', () => {
      expect(() => imageTransformUtils.validateTransformParams(null))
        .toThrow('Invalid transformation parameters');
    });
  });
});