const mongoose = require('mongoose');
const APIError = require('../utils/APIError');
const httpStatus = require('http-status');


/**
 * Order status
 */
const status = ['created', 'declined', 'canceled', 'confirmed', 'delivered'];


/**
 * Order Schema
 * @private
 */
const orderSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  status: {
    type: String,
    enum: status,
    required: true,
    default: 'created'
  }
}, {
  timestamps: true
});


/**
 * Methods
 */
orderSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'status', 'createdBy', 'product'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  }
});

/**
 * Statics
 */
orderSchema.statics = {

  status,
  async get(id) {
    try {
      let order;

      if (mongoose.Types.ObjectId.isValid(id)) {
        order = await this.findById(id).exec();
      }
      if (order) {
        return order;
      }

      throw new APIError({
        message: 'Order does not exist',
        status: httpStatus.NOT_FOUND
      });
    } catch (error) {
      throw error;
    }
  },


  checkValidation(error) {
    if (error.name === 'ValidationError') {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'createdBy, Product',
          location: 'body',
          messages: 'schema does not exists'
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack
      });
    }
    return error;
  },


  /**
   * List products in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Order[]>}
   */
  list({page = 1, perPage = 30}) {
    return this.find()
      .populate('createdBy', '-password')
      .populate('product')
      .sort({createdAt: -1})
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  }

}
/**
 * @typedef Order
 */
module.exports = mongoose.model('Order', orderSchema);
