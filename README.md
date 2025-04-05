# Proyecto OFTA - Sistema de Gestión para Óptica

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
- Landing page
- Catálogo de productos
- Panel de administración
- Gestión de inventario

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- Vite
- Tailwind CSS
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
cd frontend_temp
npm install
```

3. Instalar dependencias del backend:
```bash
cd ../backend
npm install
```

4. Configurar variables de entorno:
   - Copiar el archivo `.env.example` a `.env` en la carpeta backend
   - Configurar las siguientes variables:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/ofta
     JWT_SECRET=tu_secreto_jwt
     CLOUDINARY_CLOUD_NAME=tu_cloud_name
     CLOUDINARY_API_KEY=tu_api_key
     CLOUDINARY_API_SECRET=tu_api_secret
     ```

5. Iniciar el servidor de desarrollo:
```bash
# En una terminal para el frontend
cd frontend_temp
npm run dev

# En otra terminal para el backend
cd backend
npm run dev
```

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
