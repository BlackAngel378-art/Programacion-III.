const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Product = require('./Product');

/**
 * MODELO DE ITEM DEL CARRITO
 * Campos para Evaluación 4:
 * - userId: ID del usuario dueño del carrito
 * - productId: ID del producto en el carrito
 * - cantidad: Cantidad del producto (mínimo 1)
 * 
 * Relaciones:
 * - Pertenece a un Usuario
 * - Pertenece a un Producto
 */

const CartItem = sequelize.define('CartItem', {
  // Cantidad del producto en el carrito
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'La cantidad debe ser al menos 1' }
    }
  }
});

// ==========================================
// RELACIONES
// ==========================================

// Un usuario puede tener muchos items en su carrito
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// Un producto puede estar en muchos carritos
// Si se elimina el producto, el item del carrito se mantiene pero con productId null
Product.hasMany(CartItem, { foreignKey: 'productId', onDelete: 'SET NULL' });
CartItem.belongsTo(Product, { foreignKey: 'productId' });

module.exports = CartItem;
