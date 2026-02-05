# Pineiroordax - Proyecto Separado Frontend/Backend

## 📁 Estructura del Proyecto

```
pineiroordax/
├── backend/                  # Servidor Express + MongoDB
│   ├── server/
│   │   ├── articulosRoutes.js
│   │   ├── authController.js
│   │   ├── authRoutes.js
│   │   ├── contacto.js
│   │   ├── facturaRoutes.js
│   │   ├── server.js
│   │   ├── data/
│   │   │   └── db.json       # Base de datos JSON Server
│   │   └── uploads/          # Archivos subidos
│   ├── models/
│   │   ├── Articulo.js
│   │   └── Factura.js
│   └── .env                  # Variables de entorno
│
├── frontend/                 # Aplicación Vue.js
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── data/
│   │   ├── router/
│   │   └── store/
│   ├── App.vue
│   ├── main.js
│   └── style.css
│
├── index.html               # HTML raíz
├── vite.config.js          # Configuración Vite
└── package.json            # Dependencias compartidas
```

## 🚀 Instalación

```bash
# Instalar todas las dependencias (desde la raíz)
npm install
```

## ▶️ Ejecutar el Proyecto

### Opción 1: Ejecutar todo (recomendado)

```bash
npm start
```

Esto iniciará automáticamente:

- JSON Server en http://localhost:3000
- Backend (Express) en http://localhost:5000
- Frontend (Vite) en http://localhost:5173

### Opción 2: Ejecutar cada servicio por separado

#### Terminal 1 - JSON Server

```bash
npm run json-server
```

#### Terminal 2 - Backend

```bash
npm run server
```

#### Terminal 3 - Frontend

```bash
npm run dev
```

## 🔧 Variables de Entorno

Asegúrate de tener el archivo `.env` en la carpeta `backend/` con:

```env
PORT=5000
MONGODB_URI=tu_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
STRIPE_SECRET_KEY=tu_clave_stripe
RESEND_API_KEY=tu_clave_resend
CONTACT_EMAIL=tu_email
```

## 📡 Endpoints

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **JSON Server**: http://localhost:3000

## 🛠️ Scripts Disponibles

- `npm start` - Ejecuta todo (JSON Server + Backend + Frontend)
- `npm run dev` - Solo frontend (Vite)
- `npm run server` - Solo backend
- `npm run json-server` - Solo JSON Server
- `npm run build` - Build del frontend para producción
- `npm run preview` - Preview del build
