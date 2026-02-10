const express = require('express');
const router = express.Router();
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');
const { isAuthenticated } = require('../middleware/auth');

/**
 * EVALUACIÓN 4: CARRITO SIMPLE
 * - Agregar productos al carrito (guardar en base de datos)
 * - Ver mi carrito con total calculado
 * - Vaciar carrito
 */



/**
 * GET /cart
 * Muestra el carrito del usuario con el total calculado
 * Requiere: Usuario autenticado
 * Calcula: Total sumando precio * cantidad de cada item
 */
router.get('/', isAuthenticated, async (req, res) => {
  try {
    // Obtener items del carrito del usuario actual con información del producto
    const cartItems = await CartItem.findAll({
      where: { userId: req.session.user.id },
      include: [Product]
    });

    // Filtrar items con productos válidos y calcular total
    const validCartItems = cartItems.filter(item => item.Product !== null);
    
    // Eliminar items con productos eliminados
    const invalidItems = cartItems.filter(item => item.Product === null);
    for (const item of invalidItems) {
      await item.destroy();
    }

    // Calcular total del carrito
    let total = 0;
    validCartItems.forEach(item => {
      total += parseFloat(item.Product.precio) * item.cantidad;
    });

    res.render('cart/index', { cartItems: validCartItems, total });
  } catch (error) {
    console.error('Error al cargar carrito:', error);
    res.status(500).send('Error al cargar carrito');
  }
});



/**
 * POST /cart/add/:productId
 * Agrega un producto al carrito (guardado en base de datos)
 * Requiere: Usuario autenticado
 * Parámetros:
 * - productId: ID del producto a agregar
 * - cantidad: Cantidad a agregar (default: 1)
 * 
 * Si el producto ya existe en el carrito, incrementa la cantidad
 * Si no existe, crea un nuevo item en el carrito
 */
router.post('/add/:productId', isAuthenticated, async (req, res) => {
  try {
    const { productId } = req.params;
    const cantidad = parseInt(req.body.cantidad) || 1;

    // Verificar que el producto existe
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).send('Producto no encontrado');
    }

    // Buscar si el producto ya está en el carrito del usuario
    const existingItem = await CartItem.findOne({
      where: { userId: req.session.user.id, productId }
    });

    if (existingItem) {
      // Si ya existe, incrementar la cantidad
      existingItem.cantidad += cantidad;
      await existingItem.save();
    } else {
      // Si no existe, crear nuevo item en el carrito
      await CartItem.create({
        userId: req.session.user.id,
        productId,
        cantidad
      });
    }

    // Redirigir al carrito para ver los cambios
    res.redirect('/cart');
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).send('Error al agregar al carrito');
  }
});


/**
 * DELETE /cart/clear
 * Vacía completamente el carrito del usuario
 * Requiere: Usuario autenticado
 * Elimina todos los items del carrito de la base de datos
 */
router.delete('/clear', isAuthenticated, async (req, res) => {
  try {
    // Eliminar todos los items del carrito del usuario actual
    await CartItem.destroy({ where: { userId: req.session.user.id } });
    res.redirect('/cart');
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).send('Error al vaciar carrito');
  }
});


/**
 * DELETE /cart/remove/:id
 * Elimina un item específico del carrito
 * Requiere: Usuario autenticado
 * Parámetro: id - ID del item del carrito a eliminar
 * Verifica que el item pertenezca al usuario actual
 */
router.delete('/remove/:id', isAuthenticated, async (req, res) => {
  try {
    // Eliminar item específico verificando que pertenezca al usuario
    await CartItem.destroy({ 
      where: { 
        id: req.params.id, 
        userId: req.session.user.id 
      } 
    });
    res.redirect('/cart');
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).send('Error al eliminar item');
  }
});

module.exports = router;
