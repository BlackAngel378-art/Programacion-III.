/**
 * MIDDLEWARE DE AUTENTICACIÓN
 * Protege las rutas y verifica permisos de usuario
 */

// Verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login');
};

// Verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.nivel === 'admin') {
    return next();
  }
  res.status(403).render('error', { 
    message: 'Acceso denegado. Solo administradores pueden acceder a esta página.' 
  });
};

// Verificar si el usuario es invitado (no autenticado)
const isGuest = (req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  res.redirect('/');
};

module.exports = { isAuthenticated, isAdmin, isGuest };
