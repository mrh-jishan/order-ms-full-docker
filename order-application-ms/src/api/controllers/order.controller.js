const httpStatus = require('http-status');
const Order = require('../models/order.model');
const serviceProviders = require('../services/serviceProviders');
const APIError = require('../utils/APIError');
/**
 * Load order and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const order = await Order.get(id);
    req.locals = { order };
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Get order
 * @public
 */
exports.get = (req, res) => res.json(req.locals.order.transform());


/**
 * Create new order
 * @public
 */
exports.create = async (req, res, next) => {

  console.log(req.body)
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();

    // eslint-disable-next-line no-unused-vars
    createPayout(req, savedOrder).then((response) => {
      res.status(httpStatus.CREATED);
      const tOrder = savedOrder.transform();
      tOrder.payout = {
        status: response.status,
        cardHolderName: response.cardHolderName,
        product: response.product,
        order: response.order
      }
      res.json(tOrder);
    }).catch((err) => {
      next(err);
    });
  } catch (error) {
    next(Order.checkValidation(error));
  }
};

const createPayout = async (req, order) => new Promise((resolve, reject) => {
  const body = req.body.payment;
  body.createdBy = `${order.createdBy}`;
  body.product = `${order.product}`;
  body.order = `${order._id}`;
  serviceProviders.payment(req.headers.authorization, body).then((res) => {
    resolve(res);
  }).catch((err) => {
    reject(err);
  });
});

/**
 * cancel existing order
 * @public
 */
exports.cancelOrder = (req, res, next) => {
  const { order } = req.locals;
  if (order.status === 'created') {
    order.status = 'canceled';
    order.save()
      .then(savedOrder => res.json(savedOrder.transform()))
      .catch(e => next(e));
  } else {
    throw new APIError({
      message: 'Sorry! Order is not in created mode',
      status: httpStatus.BAD_REQUEST
    });
  }
};

/**
 * Get order list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    const orders = await Order.list(req.query);
    const transformedOrders = orders.map(order => order.transform());
    res.json(transformedOrders);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete order
 * @public
 */
exports.remove = (req, res, next) => {
  const { order } = req.locals;

  order.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};
