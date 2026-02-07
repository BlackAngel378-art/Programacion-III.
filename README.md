# 🛒 Tienda Online - Sistema de E-commerce

Sistema completo de tienda online con autenticación, gestión de productos, carrito de compras y procesamiento de pagos.

## 📋 Características

### Evaluación 2: Login Básico (100 pts)
- ✅ Registro de usuarios con nombre, email, password y nivel (admin/usuario)
- ✅ Login que devuelve sesión con token
- ✅ Contraseñas encriptadas con bcrypt
- ✅ Validaciones completas de formularios
- ✅ Código limpio y organizado

### Evaluación 3: Productos (100 pts)
- ✅ CRUD completo de productos (nombre, código, precio, descripción)
- ✅ Ver todos los productos
- ✅ Ver producto individual por código
- ✅ Solo administradores pueden crear productos
- ✅ Validación de precio > 0

### Evaluación 4: Carrito Simple (100 pts)
- ✅ Agregar productos al carrito (guardado en BD)
- ✅ Ver carrito con total calculado automáticamente
- ✅ Vaciar carrito completo
- ✅ Eliminar items individuales

### Evaluación 5: Integración de Pagos (Opcional)
- ✅ Botón de pago y proceso de checkout
- ✅ Guardar órdenes al confirmar pago
- ✅ Ver historial de compras
- 💡 Preparado para integrar PayPal/Stripe

## 🚀 Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor:
```bash
npm start
```

O en modo desarrollo con nodemon:
```bash
npm run dev
```

3. Abrir en el navegador:
```
http://localhost:3000
```

## 👤 Usuarios por Defecto

El sistema crea automáticamente 2 usuarios al iniciar:

### Administrador
```
Email: admin@tienda.com
Contraseña: admin123
Nivel: admin
```

### Usuario Normal
```
Email: usuario@tienda.com
Contraseña: usuario123
Nivel: usuario
```

## 👥 Tipos de Usuario

### Usuario Normal
- Ver productos
- Agregar al carrito
- Realizar compras
- Ver historial de órdenes

### Administrador
- Todas las funciones de usuario normal
- Crear nuevos productos
- Gestionar catálogo

## 📁 Estructura del Proyecto

```
├── app.js                 # Archivo principal
├── config/
│   └── database.js        # Configuración de SQLite
├── models/
│   ├── User.js           # Modelo de usuarios
│   ├── Product.js        # Modelo de productos
│   ├── CartItem.js       # Modelo de items del carrito
│   └── Order.js          # Modelo de órdenes
├── routes/
│   ├── auth.js           # Rutas de autenticación
│   ├── products.js       # Rutas de productos
│   ├── cart.js           # Rutas del carrito
│   └── orders.js         # Rutas de órdenes
├── middleware/
│   └── auth.js           # Middlewares de autenticación
├── views/
│   ├── auth/             # Vistas de login/registro
│   ├── products/         # Vistas de productos
│   ├── cart/             # Vistas del carrito
│   └── orders/           # Vistas de órdenes
└── public/
    └── css/
        └── style.css     # Estilos CSS

```

## 🔐 Seguridad

- Contraseñas encriptadas con bcrypt (10 rounds)
- Sesiones seguras con express-session
- Validación de datos con express-validator
- Protección de rutas con middlewares
- Validación de permisos por nivel de usuario

## 🛠️ Tecnologías Utilizadas

- **Backend:** Express.js
- **ORM:** Sequelize
- **Base de Datos:** SQLite3
- **Template Engine:** EJS
- **Autenticación:** bcryptjs + express-session
- **Validación:** express-validator
- **Estilos:** CSS puro

## 📝 Uso del Sistema

### 1. Registro
- Ir a `/register`
- Completar formulario con nombre, email, contraseña
- Seleccionar nivel (usuario o admin)

### 2. Login
- Ir a `/login`
- Ingresar email y contraseña

### 3. Ver Productos
- Navegar a `/products`
- Ver catálogo completo

### 4. Agregar al Carrito
- Click en "Agregar al Carrito" en cualquier producto
- O ver detalle y seleccionar cantidad

### 5. Realizar Compra
- Ir a `/cart`
- Revisar productos y total
- Click en "Proceder al Pago"
- Confirmar pago

### 6. Ver Historial
- Ir a `/orders`
- Ver todas las compras realizadas

## 🎯 Puntos de Evaluación

### Evaluación 2 (100 pts)
- Funciona registro y login: 60 pts ✅
- Validaciones básicas: 30 pts ✅
- Código ordenado: 10 pts ✅

### Evaluación 3 (100 pts)
- CRUD funciona: 60 pts ✅
- Protección con login: 25 pts ✅
- Validación precio > 0: 15 pts ✅

### Evaluación 4 (100 pts)
- Agregar productos: 40 pts ✅
- Calcular total correctamente: 40 pts ✅
- Ver y vaciar carrito: 20 pts ✅

## 🔄 Base de Datos

La base de datos SQLite se crea automáticamente al iniciar el servidor.
Archivo: `database.sqlite`

### Cargar productos de ejemplo (español)

El proyecto incluye 11 imágenes de productos en `public/productos/` y un seed con datos en español:

```bash
npm run seed
```

Para reemplazar todos los productos por los de ejemplo:

```bash
npm run seed:force
```

### Modelos:
- **Users:** id, nombre, email, password, nivel
- **Products:** id, nombre, codigo, precio, descripcion, imagen
- **CartItems:** id, userId, productId, cantidad
- **Orders:** id, userId, total, estado, paymentId
- **OrderItems:** id, orderId, nombre, precio, cantidad

## 🌟 Características Adicionales

- Diseño Dark Mode (Negro con Naranja)
- Productos con imágenes
- Usuarios por defecto pre-creados
- Diseño responsive
- Interfaz moderna y amigable
- Mensajes de error claros
- Navegación intuitiva
- Cálculo automático de totales
- Gestión de sesiones
- Protección de rutas

## 📧 Contacto

Proyecto desarrollado para las evaluaciones 2, 3, 4 y 5 de Programación III.
