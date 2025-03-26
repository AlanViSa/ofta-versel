require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const routes = require('./routes');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const { initializeScheduler } = require('./config/scheduler');

const app = express();

// Crear directorio de uploads si no existe
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Middleware
app.use(cors());
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
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conexión a MongoDB establecida');
    
    // Inicializar el programador de tareas
    initializeScheduler();
    
    // Iniciar servidor
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con MongoDB:', error);
  }); 