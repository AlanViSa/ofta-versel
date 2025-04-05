import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  publicId: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  format: {
    type: String,
    required: true
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  bytes: {
    type: Number
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  transformations: [{
    type: {
      type: String,
      required: true,
      enum: ['resize', 'crop', 'rotate', 'effect', 'watermark']
    },
    params: {
      type: Object,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Actualizar lastAccessed cuando se accede a la imagen
imageSchema.methods.updateLastAccessed = async function() {
  this.lastAccessed = Date.now();
  await this.save();
};

// Método para agregar una transformación
imageSchema.methods.addTransformation = async function(type, params, url) {
  this.transformations.push({
    type,
    params,
    url
  });
  await this.save();
  return this;
};

// Método para obtener todas las transformaciones
imageSchema.methods.getTransformations = function() {
  return this.transformations;
};

// Método para obtener una transformación específica
imageSchema.methods.getTransformation = function(type, params) {
  return this.transformations.find(t => 
    t.type === type && 
    JSON.stringify(t.params) === JSON.stringify(params)
  );
};

// Método para eliminar una transformación
imageSchema.methods.removeTransformation = async function(transformationId) {
  this.transformations = this.transformations.filter(t => 
    !t._id.equals(transformationId)
  );
  await this.save();
  return this;
};

const Image = mongoose.model('Image', imageSchema);

export default Image; 