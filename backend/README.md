# Proyecto OFTA - Sistema de Gestión para Óptica

Este proyecto es un sistema de gestión para una óptica que incluye:
- Landing page
- Catálogo de productos
- Sistema de citas
- Panel de administración
- Gestión de inventario

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB
- npm o yarn

## Instalación

1. Clonar el repositorio
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Instalar dependencias
```bash
npm install
```

3. Crear archivo .env en la raíz del proyecto con las siguientes variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ofta
JWT_SECRET=tu_secreto_jwt
```

4. Iniciar el servidor en modo desarrollo
```bash
npm run dev
```

## Estructura del Proyecto
```
proyecto-ofta/
├── src/
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── models/        # Modelos
│   ├── routes/        # Rutas
│   ├── middleware/    # Middlewares
│   └── utils/         # Utilidades
├── tests/             # Pruebas
└── package.json       # Dependencias
```

## Tecnologías Utilizadas
- Node.js
- Express.js
- MongoDB
- JWT para autenticación
- Jest para testing 