const express = require('express');
const paymentRoutes = require('./payment.route');

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


// v1/<payment>
router.use('/payment', paymentRoutes);

module.exports = router;
