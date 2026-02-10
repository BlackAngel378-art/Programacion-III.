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
        nombre: 'Jugo del Valle',
        codigo: 'PROD001',
        precio: 25.50,
        descripcion: 'Jugo del Valle sabor naranja 1L, 100% natural sin conservadores',
        imagen: '/productos/producto_01.png'
      },
      {
        nombre: 'Gomitas con Chile',
        codigo: 'PROD002',
        precio: 15.00,
        descripcion: 'Gomitas enchiladas sabor tamarindo, picante y dulce',
        imagen: '/productos/producto_02.png'
      },
      {
        nombre: 'Mangomita',
        codigo: 'PROD003',
        precio: 18.50,
        descripcion: 'Dulce de mango enchilado con chamoy, sabor intenso',
        imagen: '/productos/producto_03.png'
      },
      {
        nombre: 'Coca Cola de Lata',
        codigo: 'PROD004',
        precio: 12.00,
        descripcion: 'Coca Cola lata 355ml, refrescante y fría',
        imagen: '/productos/producto_04.png'
      },
      {
        nombre: 'Pistachos Colonia Pixi',
        codigo: 'PROD005',
        precio: 45.00,
        descripcion: 'Pistachos naturales tostados y salados, 100g',
        imagen: '/productos/producto_05.png'
      },
      {
        nombre: 'Pistachos de Chocolate',
        codigo: 'PROD006',
        precio: 55.00,
        descripcion: 'Pistachos cubiertos con chocolate oscuro premium',
        imagen: '/productos/producto_06.png'
      },
      {
        nombre: 'Vino de Naranja',
        codigo: 'PROD007',
        precio: 120.00,
        descripcion: 'Vino de naranja artesanal, dulce y aromático 750ml',
        imagen: '/productos/producto_07.png'
      },
      {
        nombre: 'Mayonesa La Costeña Mediana',
        codigo: 'PROD008',
        precio: 32.00,
        descripcion: 'Mayonesa La Costeña 380g, cremosa y deliciosa',
        imagen: '/productos/producto_08.png'
      },
      {
        nombre: 'Mayonesa La Costeña Grande',
        codigo: 'PROD009',
        precio: 58.00,
        descripcion: 'Mayonesa La Costeña 880g, presentación familiar',
        imagen: '/productos/producto_09.png'
      },
      {
        nombre: 'Salsa Valentina',
        codigo: 'PROD010',
        precio: 22.00,
        descripcion: 'Salsa picante Valentina 370ml, la original',
        imagen: '/productos/producto_10.png'
      },
      {
        nombre: 'Churrumais',
        codigo: 'PROD011',
        precio: 16.50,
        descripcion: 'Botana Churrumais sabor chile y limón 62g',
        imagen: '/productos/producto_11.png'
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
