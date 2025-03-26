const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' })
}));

// Mock de @mui/material
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      mode: 'light',
      primary: {
        main: '#1976d2'
      }
    }
  })
}));

// Mock de express para pruebas de middleware
jest.mock('express', () => {
  const express = jest.requireActual('express');
  const app = express();
  
  // Agregar middleware de prueba
  app.use(express.json());
  
  return {
    ...express,
    Router: () => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      use: jest.fn()
    })
  };
});

// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';

// Mock IntersectionObserver
if (typeof window !== 'undefined') {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  };

  // Mock ResizeObserver
  window.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  };

  // Mock matchMedia
  window.matchMedia = query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  });
}

// Mock cloudinary
jest.mock('./config/cloudinary', () => ({
  cloudinary: {
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn()
    },
    url: jest.fn()
  }
}));

// Mock image service
jest.mock('./services/imageService', () => ({
  uploadImage: jest.fn(),
  deleteImage: jest.fn(),
  getImages: jest.fn(),
  transformImage: jest.fn(),
  getImageUrls: jest.fn()
}));

// Setup MongoDB for server tests
if (process.env.NODE_ENV === 'test' && process.env.TEST_ENV === 'server') {
  const mongoose = require('mongoose');
  const { MongoMemoryServer } = require('mongodb-memory-server');

  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany();
    }
  });
} 