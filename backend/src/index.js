import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';
import { initializeScheduler } from './config/scheduler.js';
import { config } from './config/config.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import imageRoutes from './routes/imageRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configuración de CORS
const corsOptions = {
  origin: [
    'https://ofta-versel.vercel.app',
    'https://ofta-versel-50a2ayr2s-alan-villanueva-sanchezs-projects.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Rutas API
app.use('/api', routes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/images', imageRoutes);

// Manejo de errores - debe estar después de todas las rutas
app.use(notFound);
app.use(errorHandler);

// Opciones de conexión a MongoDB
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Conexión a MongoDB
mongoose.connect(config.mongodbUri, mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB successfully');
    
    // Inicializar el programador de tareas
    initializeScheduler();
    
    // Iniciar servidor
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }); 