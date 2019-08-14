const httpStatus = require('http-status');
const Payment = require('../models/payment.model');

/**
 * Load payment and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const payment = await Payment.get(id);
    req.locals = {payment};
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get payment
 * @public
 */
exports.get = (req, res) => res.json(req.locals.payment.transform());


/**
 * Create new payment
 * @public
 */
exports.create = async (req, res, next) => {
  console.log('creating payment start');
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(httpStatus.CREATED);
    res.json(savedPayment.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Get payment list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const payments = await Payment.list(req.query);
    const transformedPayments = payments.map(payment => payment.transform());
    res.json(transformedPayments);
  } catch (error) {
    next(error);
  }
};
