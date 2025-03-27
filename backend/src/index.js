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
import config from './config/config.js';
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

// Middleware
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas
app.use('/api', routes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

// Conexión a MongoDB
mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Inicializar el programador de tareas
    initializeScheduler();
    
    // Rutas
    app.use('/api/users', userRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/appointments', appointmentRoutes);
    app.use('/api/images', imageRoutes);

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.json({ message: 'API is running' });
    });

    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }); 