const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

/**
 * EVALUACIÓN 3: SISTEMA DE PRODUCTOS
 * - Crear productos con nombre, código, precio y descripción
 * - Ver todos los productos
 * - Ver un producto por código
 * - Solo usuarios admin pueden crear productos
 * - Validación de precio > 0
 * - Carga de imágenes desde galería
 */



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png, gif, webp)'));
  }
});



/**
 * GET /products
 * Muestra todos los productos ordenados por fecha de creación
 * Requiere: Usuario autenticado (cualquier nivel)
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const products = await Product.findAll({ order: [['createdAt', 'DESC']] });
    res.render('products/index', { products });
  } catch (error) {
    console.error('Error al cargar productos:', error);
    res.status(500).send('Error al cargar productos');
  }
});


// CREAR PRODUCTO (SOLO ADMIN)


/**
 * GET /products/create
 * Muestra formulario para crear producto
 * Requiere: Usuario admin (protegido con middleware isAdmin)
 */
router.get('/create', isAdmin, (req, res) => {
  res.render('products/create', { errors: [], formData: {} });
});

/**
 * POST /products/create
 * Crea un nuevo producto en la base de datos
 * Requiere: Usuario admin (protegido con middleware isAdmin)
 * Validaciones:
 * - Nombre requerido
 * - Código requerido y único
 * - Precio mayor a 0 (VALIDACIÓN CRÍTICA)
 * - Descripción opcional
 * - Imagen desde galería (opcional)
 */
router.post('/create', isAdmin, upload.single('imagen'), [
  // Validaciones de campos
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('codigo').trim().notEmpty().withMessage('El código es requerido'),
  body('precio').isFloat({ min: 0.01 }).withMessage('El precio debe ser mayor a 0'),
  body('descripcion').trim()
], async (req, res) => {
  const errors = validationResult(req);
  
  // Si hay errores de validación, mostrarlos
  if (!errors.isEmpty()) {
    return res.render('products/create', { 
      errors: errors.array(), 
      formData: req.body 
    });
  }

  try {
    const { nombre, codigo, precio, descripcion } = req.body;
    
    // Verificar si el código ya existe
    const existingProduct = await Product.findOne({ where: { codigo } });
    if (existingProduct) {
      return res.render('products/create', { 
        errors: [{ msg: 'El código ya existe' }], 
        formData: req.body 
      });
    }

    // Obtener la ruta de la imagen subida
    const imagen = req.file ? `/uploads/${req.file.filename}` : null;

    // Crear producto en la base de datos
    await Product.create({ 
      nombre, 
      codigo, 
      precio, 
      descripcion, 
      imagen 
    });
    
    res.redirect('/products');
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.render('products/create', { 
      errors: [{ msg: 'Error al crear producto: ' + error.message }], 
      formData: req.body 
    });
  }
});

// ==========================================
// VER PRODUCTO POR CÓDIGO
// ==========================================

/**
 * GET /products/:codigo
 * Muestra un producto específico por su código
 * Requiere: Usuario autenticado (cualquier nivel)
 * Parámetro: codigo - Código único del producto
 */
router.get('/:codigo', isAuthenticated, async (req, res) => {
  try {
    const product = await Product.findOne({ where: { codigo: req.params.codigo } });
    
    // Si no existe el producto, mostrar error 404
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }
    
    res.render('products/show', { product });
  } catch (error) {
    console.error('Error al cargar producto:', error);
    res.status(500).send('Error al cargar producto');
  }
});

module.exports = router;
