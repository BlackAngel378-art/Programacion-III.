const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { isGuest } = require('../middleware/auth');

/**
 * EVALUACIÓN 2: SISTEMA DE AUTENTICACIÓN
 * - Registro de usuarios con nombre, email, password y nivel
 * - Login con validación de credenciales
 * - Contraseñas encriptadas con bcrypt
 * - Validaciones completas en todos los campos
 * - Sesiones para mantener usuario autenticado
 */

// ==========================================
// REGISTRO DE USUARIOS
// ==========================================

// Mostrar formulario de registro
router.get('/register', isGuest, (req, res) => {
  res.render('auth/register', { errors: [], formData: {} });
});

// Procesar registro de nuevo usuario
router.post('/register', isGuest, [
  // Validaciones de campos
  body('nombre').trim().notEmpty().withMessage('El nombre es requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('nivel').isIn(['admin', 'usuario']).withMessage('Nivel inválido')
], async (req, res) => {
  const errors = validationResult(req);
  
  // Si hay errores de validación, mostrarlos
  if (!errors.isEmpty()) {
    return res.render('auth/register', { 
      errors: errors.array(), 
      formData: req.body 
    });
  }

  try {
    const { nombre, email, password, nivel } = req.body;
    
    // Verificar si el email ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.render('auth/register', { 
        errors: [{ msg: 'El email ya está registrado' }], 
        formData: req.body 
      });
    }

    // Crear nuevo usuario (la contraseña se encripta automáticamente en el modelo)
    const user = await User.create({ nombre, email, password, nivel });
    
    // Crear sesión con los datos del usuario (token simple)
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      nivel: user.nivel
    };
    
    // Redirigir a la página principal
    res.redirect('/');
  } catch (error) {
    console.error('Error en registro:', error);
    res.render('auth/register', { 
      errors: [{ msg: 'Error al registrar usuario' }], 
      formData: req.body 
    });
  }
});



// Mostrar formulario de login
router.get('/login', isGuest, (req, res) => {
  res.render('auth/login', { errors: [], formData: {} });
});

// Procesar login de usuario
router.post('/login', isGuest, [
  // Validaciones de campos
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], async (req, res) => {
  const errors = validationResult(req);
  
  // Si hay errores de validación, mostrarlos
  if (!errors.isEmpty()) {
    return res.render('auth/login', { 
      errors: errors.array(), 
      formData: req.body 
    });
  }

  try {
    const { email, password } = req.body;
    
    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    
    // Verificar si el usuario existe y la contraseña es correcta
    if (!user || !(await user.validPassword(password))) {
      return res.render('auth/login', { 
        errors: [{ msg: 'Email o contraseña incorrectos' }], 
        formData: req.body 
      });
    }

    // Crear sesión con los datos del usuario (token simple)
    req.session.user = {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
      nivel: user.nivel
    };
    
    // Redirigir a la página principal
    res.redirect('/');
  } catch (error) {
    console.error('Error en login:', error);
    res.render('auth/login', { 
      errors: [{ msg: 'Error al iniciar sesión' }], 
      formData: req.body 
    });
  }
});


// Cerrar sesión del usuario
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
