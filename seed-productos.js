/**
 * Seed: productos de ejemplo en español con imágenes
 * Ejecutar: node seed-productos.js
 */
const sequelize = require('./config/database');
const Product = require('./models/Product');

const productos = [
  {
    nombre: 'Pistache Promanuez',
    codigo: 'PROD-001',
    precio: 45.50,
    descripcion: 'Pistachos en bolsa resealable. Marca Promanuez. Advertencia: exceso de sodio (Secretaría de Salud). Ideal como snack.',
    imagen: '/productos/producto_01.png'
  },
  {
    nombre: 'Pixi Skintreats Glow Tonic',
    codigo: 'PROD-002',
    precio: 389.00,
    descripcion: 'Loción tónica exfoliante con 5% de ácido glicólico. Toner exfoliante para piel radiante. PIXI desde 1999.',
    imagen: '/productos/producto_02.png'
  },
  {
    nombre: 'Mister Mangomita',
    codigo: 'PROD-003',
    precio: 25.00,
    descripcion: 'Gomitas de almidón sabor mango cubiertas de chile en polvo. Adicionado con vitamina C. Advertencias: exceso calorías, azúcares y sodio. KMD México - Fun Food.',
    imagen: '/productos/producto_03.png'
  },
  {
    nombre: 'Coca-Cola Lata 375 ml',
    codigo: 'PROD-004',
    precio: 18.00,
    descripcion: 'Refresco Coca-Cola en lata de aluminio 375 ml. Sabor clásico, refrescante. Depósito 10¢ reciclable.',
    imagen: '/productos/producto_04.png'
  },
  {
    nombre: 'Promanuez Gomitas con Chile',
    codigo: 'PROD-005',
    precio: 32.00,
    descripcion: 'Gomitas de grenetina con sabores frutales cubiertas con chile. Cont. net. 200 g. Advertencias: exceso calorías, azúcares y sodio.',
    imagen: '/productos/producto_05.png'
  },
  {
    nombre: 'del Valle Durazno',
    codigo: 'PROD-006',
    precio: 28.50,
    descripcion: 'Bebida sabor durazno. 21% de durazno. Adicionada con vitaminas. Advertencias: exceso calorías y azúcares.',
    imagen: '/productos/producto_06.png'
  },
  {
    nombre: 'La Costeña Mayonesa con Jugo de Limón',
    codigo: 'PROD-007',
    precio: 42.00,
    descripcion: 'Mayonesa con jugo de limón. Cont. net. 385 g. Advertencias: exceso calorías, grasas saturadas y sodio. Secretaría de Salud.',
    imagen: '/productos/producto_07.png'
  },
  {
    nombre: 'de la Rosa Mazapán Untable',
    codigo: 'PROD-008',
    precio: 55.00,
    descripcion: 'Mazapán untable con trocitos de cacahuate. Hecho en México. Crema de mazapán para pan o galletas.',
    imagen: '/productos/producto_08.png'
  },
  {
    nombre: 'La Costeña Mayonesa con Jugo de Limón (presentación 2)',
    codigo: 'PROD-009',
    precio: 42.00,
    descripcion: 'Mayonesa con jugo de limón. Cont. net. 385 g. Ideal para tus platillos favoritos.',
    imagen: '/productos/producto_09.png'
  },
  {
    nombre: 'Promanuez Mix Almendra con Chocolate',
    codigo: 'PROD-010',
    precio: 78.00,
    descripcion: 'Mezcla de almendras cubiertas de chocolate (leche y blanco). Advertencias: exceso calorías, azúcares y grasas saturadas.',
    imagen: '/productos/producto_10.png'
  },
  {
    nombre: 'Chilcano Bar Bebida',
    codigo: 'PROD-011',
    precio: 35.00,
    descripcion: 'Bebida refrescante Chilcano Bar con toque cítrico de naranja. Ideal para cualquier ocasión. Se sirve frío.',
    imagen: '/productos/producto_11.png'
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Conexión a SQLite correcta.');
    await sequelize.sync();
    const count = await Product.count();
    const force = process.argv.includes('--force');
    if (count > 0 && !force) {
      console.log(`Ya existen ${count} productos. Usa: node seed-productos.js --force  para reemplazar con datos de ejemplo.`);
      process.exit(0);
      return;
    }
    if (count > 0 && force) {
      await Product.destroy({ where: {} });
      console.log('Productos anteriores eliminados.');
    }
    await Product.bulkCreate(productos);
    console.log('✅ 11 productos de ejemplo insertados correctamente.');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

seed();
