const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'pagado', 'cancelado'),
    defaultValue: 'pendiente'
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

const OrderItem = sequelize.define('OrderItem', {
  nombre: DataTypes.STRING,
  precio: DataTypes.DECIMAL(10, 2),
  cantidad: DataTypes.INTEGER
});

// Relaciones
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

module.exports = { Order, OrderItem };
