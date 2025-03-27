import cloudinary from '../config/cloudinary.js';

// Configuraciones predefinidas para diferentes tipos de transformaciones
export const transformConfigs = {
  // Efectos de color
  effects: {
    grayscale: { effect: 'grayscale' },
    blur: { effect: 'blur' },
    sepia: { effect: 'sepia' },
    brightness: (value) => ({ effect: 'brightness', value }),
    contrast: (value) => ({ effect: 'contrast', value }),
    saturation: (value) => ({ effect: 'saturation', value }),
    negate: { effect: 'negate' },
    hue: (value) => ({ effect: `hue:${value}` }),
    gamma: (value) => ({ effect: `gamma:${value}` }),
    tint: (color) => ({ effect: `tint:${color}` }),
    colorize: (color, strength) => ({ effect: `colorize:${strength}:${color}` })
  },

  // Filtros y mejoras
  filters: {
    sharpen: (strength) => ({ effect: `sharpen:${strength}` }),
    pixelate: (size) => ({ effect: `pixelate:${size}` }),
    oilPaint: (radius) => ({ effect: `oil_paint:${radius}` }),
    sketch: (radius) => ({ effect: `sketch:${radius}` }),
    cartoonify: (strength) => ({ effect: `cartoonify:${strength}` }),
    autoColor: { effect: 'auto_color' },
    autoContrast: { effect: 'auto_contrast' },
    autoBrightness: { effect: 'auto_brightness' }
  },

  // Ajustes de imagen
  adjustments: {
    rotate: (angle) => ({ angle }),
    flip: { effect: 'flip' },
    flop: { effect: 'flop' },
    crop: (mode, width, height) => ({ 
      crop: mode,
      width,
      height
    }),
    gravity: (value) => ({ gravity: value }),
    quality: (value) => ({ quality: value }),
    format: (format) => ({ fetch_format: format }),
    background: (color) => ({ background: color }),
    border: (width, color) => ({ 
      border: `${width}px_solid_${color}` 
    })
  },

  // Efectos especiales
  special: {
    vignette: (strength) => ({ effect: `vignette:${strength}` }),
    gradient: (colors) => ({ 
      effect: `gradient_fade:${colors.join(':')}` 
    }),
    overlay: (image, opacity) => ({ 
      overlay: image,
      opacity
    }),
    watermark: (text, font, size, color) => ({
      overlay: {
        font_family: font,
        font_size: size,
        text: text,
        font_weight: 'bold',
        font_style: 'normal',
        text_align: 'center',
        text_decoration: 'none',
        stroke: 'none',
        letter_spacing: 0,
        line_spacing: 0,
        text_antialiasing: 'subpixel',
        font_hinting: 'medium',
        font_kerning: 'normal',
        text_trim: 'normal',
        text_encryption: 'none',
        color: color
      }
    })
  },

  resize: {
    fill: { crop: 'fill' },
    fit: { crop: 'fit' },
    thumb: { crop: 'thumb' },
    scale: { crop: 'scale' }
  },

  quality: {
    auto: { quality: 'auto' },
    best: { quality: '100' },
    good: { quality: '80' },
    eco: { quality: '60' }
  }
};

export const applyTransformations = (publicId, transformations) => {
  try {
    const options = {
      ...transformations,
      secure: true
    };

    return cloudinary.v2.url(publicId, options);
  } catch (error) {
    throw new Error(`Error al aplicar transformaciones: ${error.message}`);
  }
};

export const applyEffects = (publicId, effects) => {
  try {
    if (!Array.isArray(effects)) {
      effects = [effects];
    }

    const transformations = effects.map(effect => {
      if (typeof effect === 'string') {
        return transformConfigs.effects[effect] || {};
      }
      return effect;
    });

    return applyTransformations(publicId, { transformation: transformations });
  } catch (error) {
    if (error.message.startsWith('Error al aplicar transformaciones:')) {
      throw error;
    }
    throw new Error(`Error al aplicar efectos: ${error.message}`);
  }
};

export const createVariants = (publicId, variants) => {
  try {
    return variants.map(variant => {
      const transformations = {
        width: variant.width,
        height: variant.height,
        crop: variant.crop || 'fill',
        quality: variant.quality || 'auto',
        secure: true
      };

      return applyTransformations(publicId, transformations);
    });
  } catch (error) {
    if (error.message.startsWith('Error al aplicar transformaciones:')) {
      throw error;
    }
    throw new Error(`Error al crear variantes: ${error.message}`);
  }
};

export const applyWatermark = (publicId, text, options = {}) => {
  try {
    const defaultOptions = {
      color: 'white',
      fontFamily: 'Arial',
      fontSize: 50,
      opacity: 70,
      position: { x: 10, y: 10 }
    };

    const watermarkOptions = {
      ...defaultOptions,
      ...options
    };

    const transformations = {
      overlay: {
        font_family: watermarkOptions.fontFamily,
        font_size: watermarkOptions.fontSize,
        text: text
      },
      color: watermarkOptions.color,
      opacity: watermarkOptions.opacity,
      x: watermarkOptions.position.x,
      y: watermarkOptions.position.y,
      secure: true
    };

    return applyTransformations(publicId, { transformation: transformations });
  } catch (error) {
    if (error.message.startsWith('Error al aplicar transformaciones:')) {
      throw error;
    }
    throw new Error(`Error al aplicar marca de agua: ${error.message}`);
  }
};

export const resizeImage = (params) => {
  const { width, height, crop = 'fill' } = params;
  return { width, height, crop };
};

export const applyEffect = (params) => {
  const { effect, value } = params;
  return transformConfigs.effects[effect]?.(value) || {};
};

export const getTransformationString = (transformations) => {
  const mapping = {
    width: 'w',
    height: 'h',
    crop: 'c',
    quality: 'q',
    format: 'f',
    angle: 'a',
    gravity: 'g',
    background: 'b',
    border: 'bo',
    radius: 'r',
    effect: 'e',
    opacity: 'o',
    overlay: 'l',
    underlay: 'u',
    color: 'co',
    dpr: 'dpr',
    fetch_format: 'f',
    flags: 'fl',
    secure: 's'
  };

  return Object.entries(transformations)
    .map(([key, value]) => {
      const prefix = mapping[key] || key;
      return `${prefix}_${value}`;
    })
    .join(',');
};

export const validateTransformParams = (params, type) => {
  if (!params) {
    throw new Error('Invalid transformation parameters');
  }

  switch (type) {
    case 'resize':
      return !!(params.width && params.height);
    case 'effect':
      return !!(params.effect && transformConfigs.effects[params.effect]);
    case 'watermark':
      return !!params.text;
    default:
      return false;
  }
};

export const transformImage = async (publicId, transformations) => {
  try {
    const transformationString = getTransformationString(transformations);
    const result = await cloudinary.v2.uploader.explicit(publicId, {
      type: 'upload',
      transformation: transformationString
    });
    return result.secure_url;
  } catch (error) {
    console.error('Error transforming image:', error);
    throw error;
  }
}; 