const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const productRoutes = require('./product.route');
const orderRoutes = require('./order.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));

/**
 * GET v1/docs
 */
router.use('/docs', express.static('docs'));


// v1/auth/<user, auth, product>
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/product', productRoutes);
router.use('/order', orderRoutes);

module.exports = router;
