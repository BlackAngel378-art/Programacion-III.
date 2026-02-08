const express = require('express');
const router = express.Router();
const { Order, OrderItem } = require('../models/Order');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');

// Ver historial de órdenes
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.session.user.id },
      include: [OrderItem],
      order: [['createdAt', 'DESC']]
    });

    res.render('orders/index', { orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar órdenes');
  }
});

// Crear orden desde el carrito
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { userId: req.session.user.id },
      include: [Product]
    });

    if (cartItems.length === 0) {
      return res.redirect('/cart');
    }

    let total = 0;
    cartItems.forEach(item => {
      total += parseFloat(item.Product.precio) * item.cantidad;
    });

    const order = await Order.create({
      userId: req.session.user.id,
      total,
      estado: 'pendiente'
    });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        nombre: item.Product.nombre,
        precio: item.Product.precio,
        cantidad: item.cantidad
      });
    }

    await CartItem.destroy({ where: { userId: req.session.user.id } });

    res.redirect(`/orders/${order.id}/checkout`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear orden');
  }
});

// Página de checkout
router.get('/:id/checkout', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.session.user.id },
      include: [OrderItem]
    });

    if (!order) {
      return res.status(404).send('Orden no encontrada');
    }

    res.render('orders/checkout', { order });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar checkout');
  }
});

// Confirmar pago (simulado)
router.post('/:id/confirm', isAuthenticated, async (req, res) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.session.user.id }
    });

    if (!order) {
      return res.status(404).send('Orden no encontrada');
    }

    order.estado = 'pagado';
    order.paymentId = 'PAYMENT-' + Date.now();
    await order.save();

    res.redirect('/orders?success=true');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al confirmar pago');
  }
});

module.exports = router;
