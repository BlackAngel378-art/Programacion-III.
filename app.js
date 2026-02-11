const express = require('express');
const session = require('express-session');
const path = require('path');
const methodOverride = require('method-override');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session
app.use(session({
  secret: 'mi-secreto-super-seguro-2026',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 horas
}));

// Middleware para pasar usuario a todas las vistas
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', require('./routes/auth'));
app.use('/products', require('./routes/products'));
app.use('/cart', require('./routes/cart'));
app.use('/orders', require('./routes/orders'));

// Ruta principal
app.get('/', (req, res) => {
  res.render('home');
});

// Sincronizar base de datos e iniciar servidor
db.sync().then(async () => {
  console.log('Base de datos sincronizada');
  
  // Crear usuarios por defecto
  const User = require('./models/User');
  const adminExists = await User.findOne({ where: { email: 'admin@tienda.com' } });
  const userExists = await User.findOne({ where: { email: 'usuario@tienda.com' } });
  
  if (!adminExists) {
    await User.create({
      nombre: 'Administrador',
      email: 'admin@tienda.com',
      password: 'admin123',
      nivel: 'admin'
    });
    console.log('✅ Usuario admin creado: admin@tienda.com / admin123');
  }
  
  if (!userExists) {
    await User.create({
      nombre: 'Usuario Demo',
      email: 'usuario@tienda.com',
      password: 'usuario123',
      nivel: 'usuario'
    });
    console.log('✅ Usuario demo creado: usuario@tienda.com / usuario123');
  }
  
  // Crear productos por defecto
  const Product = require('./models/Product');
  const productCount = await Product.count();
  
  if (productCount === 0) {
    const productosDefault = [
      {
        nombre: 'Samsung S26 Ultra',
        codigo: 'PROD001',
        precio: 25999.00,
        descripcion: 'Samsung Galaxy S26 Ultra, pantalla AMOLED 6.8", cámara 200MP, 512GB',
        imagen: '/productos/s26 utra.jpeg'
      },
      {
        nombre: 'Laptop Gaming',
        codigo: 'PROD002',
        precio: 18500.00,
        descripcion: 'Laptop gaming de alto rendimiento, Intel i7, RTX 4060, 16GB RAM',
        imagen: '/productos/lapto.jpeg'
      },
      {
        nombre: 'Televisor 4K',
        codigo: 'PROD003',
        precio: 12999.00,
        descripcion: 'Smart TV 4K UHD 55", HDR, sistema operativo Android TV',
        imagen: '/productos/4k televisor.jpeg'
      },
      {
        nombre: 'PlayStation 4',
        codigo: 'PROD004',
        precio: 6500.00,
        descripcion: 'Consola PlayStation 4 Slim 1TB, incluye control DualShock 4',
        imagen: '/productos/play 4.jpeg'
      },
      {
        nombre: 'Tablet Pro',
        codigo: 'PROD005',
        precio: 8999.00,
        descripcion: 'Tablet profesional 11", procesador octa-core, 256GB, incluye stylus',
        imagen: '/productos/tablet.jpeg'
      },
      {
        nombre: 'Cámara Digital',
        codigo: 'PROD006',
        precio: 15500.00,
        descripcion: 'Cámara digital profesional 24MP, lente 18-55mm, grabación 4K',
        imagen: '/productos/camara.jpeg'
      },
      {
        nombre: 'Teclado Mecánico RGB',
        codigo: 'PROD007',
        precio: 1899.00,
        descripcion: 'Teclado mecánico gaming, switches azules, iluminación RGB personalizable',
        imagen: '/productos/teclado.jpeg'
      },
      {
        nombre: 'Mouse Gaming',
        codigo: 'PROD008',
        precio: 899.00,
        descripcion: 'Mouse gaming óptico 16000 DPI, 8 botones programables, RGB',
        imagen: '/productos/raton.jpeg'
      },
      {
        nombre: 'Audífonos Bluetooth',
        codigo: 'PROD009',
        precio: 2499.00,
        descripcion: 'Audífonos inalámbricos con cancelación de ruido, batería 30hrs',
        imagen: '/productos/audifonos.jpeg'
      },
      {
        nombre: 'Smartwatch',
        codigo: 'PROD010',
        precio: 3999.00,
        descripcion: 'Reloj inteligente con monitor de salud, GPS, resistente al agua',
        imagen: '/productos/el relop.jpeg'
      },
      {
        nombre: 'Bocina JBL',
        codigo: 'PROD011',
        precio: 1899.00,
        descripcion: 'Bocina portátil Bluetooth JBL, resistente al agua, 12hrs batería',
        imagen: '/productos/UBL.jpeg'
      }
    ];
    
    await Product.bulkCreate(productosDefault);
    console.log('✅ Productos por defecto creados:', productosDefault.length);
  }
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar base de datos:', err);
});
