# Sistema de Gestión para Óptica

Este proyecto es un sistema de gestión para óptica que permite administrar pacientes, citas, productos y ventas. El sistema está desarrollado con React para el frontend y Node.js/Express para el backend.

## 🚀 Características Principales

- Gestión de pacientes
- Gestión de citas
- Gestión de productos
- Gestión de ventas
- Sistema de autenticación y autorización
- Interfaz de usuario moderna y responsiva
- Integración con Cloudinary para gestión de imágenes
- Sistema de notificaciones por email

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- React Router
- Axios
- Vitest para testing

### Backend
- Node.js
- Express
- MongoDB con Mongoose
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes
- Nodemailer para envío de emails
- Jest para testing

## 📋 Prerrequisitos

- Node.js (versión 16 o superior)
- MongoDB
- Cuenta en Cloudinary (para almacenamiento de imágenes)
- Cuenta de email (para notificaciones)

## 🔧 Instalación

1. Clonar el repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
cd [NOMBRE_DEL_DIRECTORIO]
```

2. Instalar dependencias del frontend:
```bash
npm install
```

3. Instalar dependencias del backend:
```bash
cd backend
npm install
```

4. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env` en la carpeta backend
   - Configurar las siguientes variables:
     ```
     PORT=5000
     MONGODB_URI=tu_url_de_mongodb
     JWT_SECRET=tu_secreto_jwt
     CLOUDINARY_CLOUD_NAME=tu_cloud_name
     CLOUDINARY_API_KEY=tu_api_key
     CLOUDINARY_API_SECRET=tu_api_secret
     EMAIL_USER=tu_email
     EMAIL_PASS=tu_contraseña_de_aplicacion
     ```

## 🚀 Ejecución

1. Iniciar el backend:
```bash
cd backend
npm run dev
```

2. En una nueva terminal, iniciar el frontend:
```bash
npm run dev
```

3. Acceder a la aplicación:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📁 Estructura del Proyecto

```
proyecto-ofta/
├── src/                    # Código fuente del frontend
│   ├── components/         # Componentes React
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas de la aplicación
│   │   ├── services/       # Servicios de API
│   │   ├── utils/          # Utilidades
│   │   └── App.jsx         # Componente principal
│   └── tests/             # Pruebas del backend
└── public/                # Archivos estáticos
```

## 🔒 Seguridad

- Autenticación mediante JWT
- Encriptación de contraseñas con bcrypt
- Validación de datos con express-validator
- Protección contra ataques comunes (CORS, rate limiting)

## 📝 Scripts Disponibles

### Frontend
- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Previsualiza la build de producción
- `npm test`: Ejecuta las pruebas
- `npm run test:coverage`: Ejecuta las pruebas con cobertura

### Backend
- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm start`: Inicia el servidor en modo producción
- `npm test`: Ejecuta las pruebas
- `npm run test:coverage`: Ejecuta las pruebas con cobertura

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 👥 Autores

- [Andre Villanueva Sanchez & Alan Villanueva Sanchez] - *Trabajo Inicial*

## 🙏 Agradecimientos

- Material-UI por los componentes
- MongoDB por la base de datos
- Cloudinary por el servicio de almacenamiento de imágenes
