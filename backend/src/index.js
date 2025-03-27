require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { initializeScheduler } = require('./config/scheduler');
const config = require('./config/config');

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
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/products', require('./routes/productRoutes'));
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/images', require('./routes/imageRoutes'));
    app.use('/api/cleanup', require('./routes/cleanupRoutes'));
    app.use('/api/scheduler', require('./routes/schedulerRoutes'));

    // Ruta de prueba
    app.get('/', (req, res) => {
      res.json({ message: 'API is running' });
    });

    // Iniciar servidor
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }); 