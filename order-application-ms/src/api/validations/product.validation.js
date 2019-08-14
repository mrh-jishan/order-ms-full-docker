const Joi = require('joi');

module.exports = {

  // POST /v1/Products
  createProduct: {
    body: {
      name: Joi.string().required(),
      price: Joi.number().min(10).required(),
      category: Joi.string().max(128).required(),
      picture: Joi.string().max(128).required(),
      description: Joi.string().max(356).required()
    }
  },

  // PATCH /v1/product/:productId
  updateProduct: {
    body: {
      name: Joi.string().required(),
      price: Joi.number().min(10).required(),
      category: Joi.string().max(128).required(),
      picture: Joi.string().max(128).required(),
      description: Joi.string().max(356).required()
    },
    params: {
      userId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required()
    }
  }
};
