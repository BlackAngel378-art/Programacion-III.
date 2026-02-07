const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * MODELO DE PRODUCTO
 * Campos requeridos para Evaluación 3:
 * - nombre: Nombre del producto
 * - codigo: Código único del producto
 * - precio: Precio del producto (debe ser mayor a 0)
 * - descripcion: Descripción del producto (opcional)
 * - imagen: URL de imagen del producto (opcional)
 */

const Product = sequelize.define('Product', {
  // Nombre del producto
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es requerido' }
    }
  },
  
  // Código único del producto
  codigo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'El código es requerido' }
    }
  },
  
  // Precio del producto (VALIDACIÓN: debe ser mayor a 0)
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: { msg: 'El precio debe ser un número' },
      min: { args: [0.01], msg: 'El precio debe ser mayor a 0' }
    }
  },
  
  // Descripción del producto (opcional)
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // URL de imagen del producto (opcional)
  imagen: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'https://via.placeholder.com/300x200?text=Sin+Imagen'
  }
});

module.exports = Product;
