const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

/**
 * MODELO DE USUARIO
 * Campos requeridos para Evaluación 2:
 * - nombre: Nombre completo del usuario
 * - email: Email único para login
 * - password: Contraseña encriptada con bcrypt
 * - nivel: Tipo de usuario (admin o usuario)
 */

const User = sequelize.define('User', {
  // Nombre del usuario
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es requerido' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' }
    }
  },
  
  // Email único para identificación
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
      notEmpty: { msg: 'El email es requerido' }
    }
  },
  
  // Contraseña (se encripta automáticamente antes de guardar)
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es requerida' },
      len: { args: [6, 100], msg: 'La contraseña debe tener al menos 6 caracteres' }
    }
  },
  
  // Nivel de usuario: admin o usuario
  nivel: {
    type: DataTypes.ENUM('admin', 'usuario'),
    defaultValue: 'usuario',
    allowNull: false
  }
}, {
  hooks: {
    // Hook para encriptar la contraseña antes de crear el usuario
    beforeCreate: async (user) => {
      if (user.password) {
        // Encriptar con bcrypt usando 10 rounds de salt
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

/**
 * Método para validar contraseña
 * Compara la contraseña en texto plano con el hash almacenado
 * @param {string} password - Contraseña en texto plano
 * @returns {Promise<boolean>} - True si la contraseña es correcta
 */
User.prototype.validPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = User;
