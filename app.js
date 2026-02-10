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
  
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Error al sincronizar base de datos:', err);
});
