const Joi = require('joi');
const Order = require('../models/order.model');

module.exports = {

  // POST /v1/order
  createOrder: {
    body: {
      createdBy: Joi.string().max(128),
      product: Joi.string().max(128),
      status: Joi.string().valid(Order.status),
      payment: Joi.object().required().keys({
        cardHolderName: Joi.string().required().required(),
        cardNumber: Joi.string().min(10).max(20).required(),
        expiryDate: Joi.string().required().regex(/^(0[1-9]|1[0-2]|[1-9])\/(1[4-9]|[2-9][0-9]|20[1-9][1-9])$/),
        cvc: Joi.string().required().min(3).max(4)
      })
    }
  },
  // PATCH /v1/order/:orderId
  cancelOrder: {
    body: {},
    params: {
      orderId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  }
};
